// TrustTag fraud detection edge function
// Heuristics + Lovable AI verdict → writes to tt_fraud_flags, tt_audit_logs, tt_notifications
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

type Severity = 'low' | 'medium' | 'high';
type Reason = 'multi_country_burst' | 'duplicate_serial' | 'rapid_transfer_chain' | 'counterfeit_pattern';

interface Flag {
  entity_type: 'qr_code' | 'item' | 'transfer' | 'serial';
  entity_id: string | null;
  reason: Reason;
  severity: Severity;
  metadata: Record<string, unknown>;
  owner_id?: string | null;
}

const supa = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

async function checkQrScans(qrCodeId: string): Promise<Flag[]> {
  const flags: Flag[] = [];
  const since24h = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const since1h = new Date(Date.now() - 3600 * 1000).toISOString();

  const { data: scans24 } = await supa
    .from('tt_scans').select('ip_country,result,created_at')
    .eq('qr_code_id', qrCodeId).gte('created_at', since24h);
  const countries = new Set((scans24 ?? []).map(s => (s.ip_country || '').trim()).filter(Boolean));
  if (countries.size > 2) {
    flags.push({
      entity_type: 'qr_code', entity_id: qrCodeId, reason: 'multi_country_burst', severity: 'high',
      metadata: { countries: [...countries], scan_count_24h: scans24?.length ?? 0 },
    });
  }

  const { data: scans1h } = await supa
    .from('tt_scans').select('ip_country,result')
    .eq('qr_code_id', qrCodeId).gte('created_at', since1h);
  const cts1h = new Set((scans1h ?? []).map(s => (s.ip_country || '').trim()).filter(Boolean));
  if ((scans1h?.length ?? 0) > 20 && cts1h.size > 5) {
    flags.push({
      entity_type: 'qr_code', entity_id: qrCodeId, reason: 'counterfeit_pattern', severity: 'high',
      metadata: { scans_1h: scans1h!.length, countries_1h: [...cts1h] },
    });
  }

  const { data: recent } = await supa
    .from('tt_scans').select('result').eq('qr_code_id', qrCodeId)
    .order('created_at', { ascending: false }).limit(50);
  if ((recent?.length ?? 0) >= 10) {
    const invalid = recent!.filter(r => r.result === 'invalid').length;
    if (invalid / recent!.length > 0.5) {
      flags.push({
        entity_type: 'qr_code', entity_id: qrCodeId, reason: 'counterfeit_pattern', severity: 'high',
        metadata: { invalid_ratio: invalid / recent!.length, sample: recent!.length },
      });
    }
  }
  return flags;
}

async function checkDuplicateSerials(itemId?: string): Promise<Flag[]> {
  let serialList: string[] = [];
  if (itemId) {
    const { data: it } = await supa.from('tt_items').select('serial_number').eq('id', itemId).maybeSingle();
    if (it?.serial_number) serialList = [it.serial_number];
  } else {
    const { data: all } = await supa.from('tt_items').select('serial_number').not('serial_number', 'is', null);
    const counts: Record<string, number> = {};
    for (const r of all ?? []) {
      const s = (r.serial_number || '').trim();
      if (!s) continue;
      counts[s] = (counts[s] ?? 0) + 1;
    }
    serialList = Object.entries(counts).filter(([, n]) => n > 1).map(([s]) => s);
  }

  const flags: Flag[] = [];
  for (const serial of serialList) {
    const { data: matches } = await supa.from('tt_items').select('id,owner_id,name').eq('serial_number', serial);
    if ((matches?.length ?? 0) > 1) {
      flags.push({
        entity_type: 'serial', entity_id: matches![0].id, reason: 'duplicate_serial', severity: 'high',
        metadata: { serial, count: matches!.length, items: matches!.map(m => m.id) },
      });
    }
  }
  return flags;
}

async function checkTransfer(transferId?: string, itemId?: string): Promise<Flag[]> {
  const flags: Flag[] = [];
  let targetItem = itemId;
  if (!targetItem && transferId) {
    const { data: t } = await supa.from('tt_transfers').select('item_id').eq('id', transferId).maybeSingle();
    targetItem = t?.item_id ?? undefined;
  }
  const items: string[] = [];
  if (targetItem) items.push(targetItem);
  else {
    const since30 = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
    const { data: rows } = await supa.from('tt_transfers').select('item_id').gte('created_at', since30);
    const counts: Record<string, number> = {};
    for (const r of rows ?? []) counts[r.item_id] = (counts[r.item_id] ?? 0) + 1;
    items.push(...Object.entries(counts).filter(([, n]) => n > 3).map(([id]) => id));
  }

  for (const id of items) {
    const since30 = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
    const { data: list } = await supa.from('tt_transfers').select('from_user,to_user_id,status,created_at')
      .eq('item_id', id).gte('created_at', since30).order('created_at', { ascending: true });
    if (!list) continue;
    const accepted = list.filter(l => l.status === 'accepted');
    let bounce = false;
    for (let i = 1; i < accepted.length; i++) {
      if (accepted[i].from_user === accepted[i - 1].to_user_id && accepted[i].to_user_id === accepted[i - 1].from_user) {
        bounce = true; break;
      }
    }
    if (accepted.length > 3 || bounce) {
      const { data: item } = await supa.from('tt_items').select('owner_id').eq('id', id).maybeSingle();
      flags.push({
        entity_type: 'item', entity_id: id, reason: 'rapid_transfer_chain', severity: 'medium',
        metadata: { transfers_30d: list.length, accepted: accepted.length, bounce },
        owner_id: item?.owner_id ?? null,
      });
    }
  }
  return flags;
}

async function aiVerdict(flag: Flag): Promise<{ severity?: Severity; confidence: number; explanation: string } | null> {
  if (!LOVABLE_API_KEY) return null;
  try {
    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a product-authenticity fraud analyst. Given evidence, return ONLY a tool call with severity (low/medium/high), confidence 0-1, and a brief explanation.' },
          { role: 'user', content: `Reason: ${flag.reason}\nEntity: ${flag.entity_type}/${flag.entity_id}\nEvidence: ${JSON.stringify(flag.metadata)}` },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'verdict',
            description: 'Return fraud verdict',
            parameters: {
              type: 'object',
              properties: {
                severity: { type: 'string', enum: ['low', 'medium', 'high'] },
                confidence: { type: 'number' },
                explanation: { type: 'string' },
              },
              required: ['severity', 'confidence', 'explanation'],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'verdict' } },
      }),
    });
    if (!res.ok) { console.error('AI verdict failed', res.status, await res.text()); return null; }
    const j = await res.json();
    const args = j.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) return null;
    const v = JSON.parse(args);
    return { severity: v.severity, confidence: Number(v.confidence) || 0, explanation: String(v.explanation || '') };
  } catch (e) { console.error('AI verdict exception', e); return null; }
}

async function persistFlags(flags: Flag[]) {
  const results: any[] = [];
  for (const f of flags) {
    const ai = await aiVerdict(f);
    let severity = f.severity;
    const meta = { ...f.metadata };
    if (ai) {
      meta.ai_explanation = ai.explanation;
      meta.ai_confidence = ai.confidence;
      meta.ai_severity = ai.severity;
      if (ai.severity && ai.confidence >= 0.7) severity = ai.severity;
    }

    const { data: existing } = await supa.from('tt_fraud_flags').select('id')
      .eq('entity_type', f.entity_type).eq('entity_id', f.entity_id).eq('reason', f.reason).eq('resolved', false).maybeSingle();

    let flagId = existing?.id;
    if (!flagId) {
      const { data: ins, error } = await supa.from('tt_fraud_flags').insert({
        entity_type: f.entity_type, entity_id: f.entity_id, reason: f.reason, severity, resolved: false,
      }).select('id').single();
      if (error) { console.error('insert flag', error); continue; }
      flagId = ins.id;
    }

    await supa.from('tt_audit_logs').insert({
      actor_user_id: null, action: 'fraud_check', target_type: f.entity_type,
      target_id: String(f.entity_id ?? ''), metadata: { reason: f.reason, severity, ...meta, flag_id: flagId },
    });

    if (severity === 'high' && f.owner_id) {
      await supa.from('tt_notifications').insert({
        user_id: f.owner_id, type: 'fraud', title: 'Suspicious activity detected',
        body: `${f.reason.replace(/_/g, ' ')} on your item. ${ai?.explanation ?? ''}`.slice(0, 500),
        link: '/trusttag/app/items', read: false,
      });
    }
    results.push({ ...f, severity, ai_explanation: meta.ai_explanation });
  }
  return results;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const mode = body.mode as string;

    if (mode === 'full') {
      const auth = req.headers.get('Authorization');
      if (!auth?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } });
      const token = auth.replace('Bearer ', '');
      const { data: claims, error: cerr } = await userClient.auth.getClaims(token);
      if (cerr || !claims?.claims?.sub) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const { data: isAdmin } = await supa.rpc('tt_has_role', { _user_id: claims.claims.sub, _role: 'admin' });
      if (!isAdmin) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

      const flags: Flag[] = [];
      const { data: qrs } = await supa.from('tt_qr_codes').select('id').limit(500);
      for (const q of qrs ?? []) flags.push(...await checkQrScans(q.id));
      flags.push(...await checkDuplicateSerials());
      flags.push(...await checkTransfer());
      const results = await persistFlags(flags);
      return new Response(JSON.stringify({ ok: true, mode, flags_created: results.length, results }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const flags: Flag[] = [];
    if (mode === 'scan' && body.qr_code_id) {
      flags.push(...await checkQrScans(body.qr_code_id));
      const { data: qr } = await supa.from('tt_qr_codes').select('item_id').eq('id', body.qr_code_id).maybeSingle();
      if (qr?.item_id) flags.push(...await checkDuplicateSerials(qr.item_id));
    } else if (mode === 'transfer') {
      flags.push(...await checkTransfer(body.transfer_id, body.item_id));
    } else {
      return new Response(JSON.stringify({ error: 'invalid mode' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const results = await persistFlags(flags);
    return new Response(JSON.stringify({ ok: true, mode, flags_created: results.length, results }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('tt-fraud-check error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'unknown' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
