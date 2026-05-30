import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, RoleGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { useTTAuth } from '@/components/trusttag/shared/useTTAuth';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';

function Inner() {
  const { user } = useTTAuth();
  const [byDay, setByDay] = useState<any[]>([]);
  const [byResult, setByResult] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: m } = await supabase.from('tt_manufacturers').select('id').eq('user_id', user.id).maybeSingle();
      if (!m) return;
      const { data: batches } = await supabase.from('tt_qr_batches').select('id').eq('manufacturer_id', m.id);
      const batchIds = (batches ?? []).map((b: any) => b.id);
      if (!batchIds.length) return;
      const { data: qrs } = await supabase.from('tt_qr_codes').select('id').in('batch_id', batchIds);
      const qrIds = (qrs ?? []).map((q: any) => q.id);
      if (!qrIds.length) return;
      const { data: scans } = await supabase.from('tt_scans').select('created_at, result').in('qr_code_id', qrIds);
      const days: Record<string, number> = {};
      const results: Record<string, number> = {};
      (scans ?? []).forEach((s: any) => {
        const d = new Date(s.created_at).toLocaleDateString();
        days[d] = (days[d] || 0) + 1;
        results[s.result] = (results[s.result] || 0) + 1;
      });
      setByDay(Object.entries(days).map(([date, count]) => ({ date, count })));
      setByResult(Object.entries(results).map(([result, count]) => ({ result, count })));
    })();
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl md:text-3xl">Analytics</h1>
      <div className="tt-glass rounded-2xl p-6">
        <h2 className="font-display font-semibold mb-4">Scans over time</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={byDay}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="count" stroke="hsl(158 64% 40%)" strokeWidth={2} /></LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="tt-glass rounded-2xl p-6">
        <h2 className="font-display font-semibold mb-4">Result distribution</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={byResult}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="result" /><YAxis /><Tooltip /><Bar dataKey="count" fill="hsl(158 64% 40%)" radius={[8,8,0,0]} /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function BrandAnalytics() { return <AuthGate><RoleGate role="manufacturer"><TTLayout><Inner /></TTLayout></RoleGate></AuthGate>; }
