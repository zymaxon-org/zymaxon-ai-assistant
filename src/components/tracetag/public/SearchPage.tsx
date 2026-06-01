import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ShieldCheck, AlertTriangle, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PublicHeader, PublicFooter } from '@/components/tracetag/shared/Layout';
import { useDocTitle } from '@/components/tracetag/shared/useAuth';
import { supabase } from '@/integrations/supabase/client';

type Result = any;

export default function SearchPage() {
  useDocTitle('Verify Item — TraceTag Nigeria', 'Free public search. Check if any phone, laptop, car or item is reported stolen. No account needed.');
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [recent, setRecent] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('tt_recent') ?? '[]'); } catch { return []; }
  });

  const handleSearch = async (query?: string) => {
    const finalQ = (query ?? q).trim();
    if (finalQ.length < 4) { setResult({ status: 'invalid' }); return; }
    setLoading(true); setResult(null);
    const { data, error } = await supabase.rpc('tt_verify_search', { _query: finalQ });
    setLoading(false);
    setResult(error ? { status: 'error', message: error.message } : data);
    const newRecent = [finalQ, ...recent.filter(r => r !== finalQ)].slice(0, 5);
    setRecent(newRecent);
    localStorage.setItem('tt_recent', JSON.stringify(newRecent));
  };

  return (
    <div className="tracetag bg-white min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <section className="tt-gradient-hero text-white py-10 md:py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h1 className="text-3xl md:text-4xl font-bold">Check if an item is stolen</h1>
            <p className="mt-3 text-white/80">Enter IMEI, serial number, plate number, VIN, or TraceTag ID</p>
            <form onSubmit={e => { e.preventDefault(); handleSearch(); }}
              className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
              <Input value={q} onChange={e => setQ(e.target.value.toUpperCase())}
                placeholder="e.g. TT-2026-NG-48291 or 354858109876543"
                className="h-12 bg-white text-slate-900 border-0 text-base flex-1" />
              <Button type="submit" size="lg" disabled={loading}
                className="h-12 bg-tt-red hover:bg-tt-red/90 text-white px-6 font-semibold">
                {loading ? 'Checking…' : <><Search className="mr-2 h-4 w-4" />Check now</>}
              </Button>
            </form>
            <p className="mt-3 text-xs text-white/60">No account needed. Free for everyone.</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 -mt-8 md:-mt-12 pb-12">
          {result && <ResultCard result={result} query={q} />}
          {!result && recent.length > 0 && (
            <div className="bg-white border border-tt-border rounded-2xl p-5 mt-6">
              <div className="text-xs font-semibold text-slate-500 mb-2">RECENT SEARCHES</div>
              <div className="flex flex-wrap gap-2">
                {recent.map(r => (
                  <button key={r} onClick={() => { setQ(r); handleSearch(r); }}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700">{r}</button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 bg-slate-50 border border-tt-border rounded-2xl p-6 text-center">
            <ShieldCheck className="h-8 w-8 mx-auto text-tt-navy mb-2" />
            <h3 className="font-bold text-tt-navy">Own this item? Protect it.</h3>
            <p className="text-sm text-slate-600 mt-1">Register your valuables now — takes under 2 minutes.</p>
            <Button asChild className="mt-4 bg-tt-navy hover:bg-tt-navy/90 text-white">
              <Link to="/tracetag/auth?tab=signup">Register your items <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

function ResultCard({ result, query }: { result: Result; query: string }) {
  if (result.status === 'invalid')
    return <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-6">
      <p className="text-amber-800">Enter at least 4 characters to search.</p></div>;
  if (result.status === 'error')
    return <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mt-6">
      <p className="text-red-800">Error: {result.message}</p></div>;

  if (result.status === 'stolen') return (
    <div className="bg-white border-2 border-tt-red rounded-2xl shadow-lg overflow-hidden mt-6 animate-in fade-in">
      <div className="bg-tt-red text-white p-5 flex items-center gap-3">
        <AlertTriangle className="h-10 w-10 shrink-0" />
        <div>
          <div className="text-xs font-bold opacity-90">🚨 WARNING</div>
          <div className="text-xl font-bold">THIS ITEM IS REPORTED STOLEN</div>
        </div>
      </div>
      <div className="p-6 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Row label="Item" value={`${result.item_name}${result.brand ? ` · ${result.brand}` : ''}`} />
          <Row label="TraceTag ID" value={result.asset_id} />
          <Row label="Date reported" value={result.date_stolen ?? '—'} />
          <Row label="State stolen" value={[result.state_stolen, result.lga_stolen].filter(Boolean).join(', ') || '—'} />
          <Row label="Police report #" value={result.police_report_number ?? 'Not provided'} />
          {result.reward_offered && <Row label="Reward" value={`₦${Number(result.reward_amount ?? 0).toLocaleString()}`} />}
        </div>
        <div className="bg-red-50 border-l-4 border-tt-red p-3 rounded text-sm text-red-900">
          <strong>Do NOT purchase this item.</strong> The owner has been notified that this item was searched.
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button asChild className="bg-tt-navy hover:bg-tt-navy/90 text-white flex-1">
            <Link to={`/tracetag/tip?q=${encodeURIComponent(query)}&item=${result.item_id}`}>Submit anonymous tip</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/tracetag/item/${result.asset_id}`}>View public record</Link>
          </Button>
        </div>
      </div>
    </div>
  );

  if (result.status === 'not_found') return (
    <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-3 mb-3">
        <Shield className="h-10 w-10 text-slate-400" />
        <div>
          <div className="text-lg font-bold text-slate-700">⚪ Item not found in registry</div>
          <div className="text-sm text-slate-500">"{query}"</div>
        </div>
      </div>
      <p className="text-sm text-slate-600">This item is not registered on TraceTag. Ask the seller to register it before purchase, or proceed with caution.</p>
    </div>
  );

  return (
    <div className="bg-white border-2 border-tt-green rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-tt-green flex items-center justify-center"><ShieldCheck className="h-6 w-6 text-white" /></div>
        <div>
          <div className="text-xs font-bold text-tt-green">✓ ITEM IS CLEAN</div>
          <div className="text-xl font-bold text-slate-900">{result.item_name}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Row label="TraceTag ID" value={result.asset_id} />
        <Row label="Category" value={result.item_category} />
        <Row label="Owner" value={result.owner_display} />
        <Row label="Registered" value={new Date(result.registered_at).toLocaleDateString()} />
      </div>
      <p className="mt-4 text-sm text-slate-600">This item has been verified as legitimately owned and is not reported stolen.</p>
    </div>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div><div className="text-xs text-slate-500 uppercase tracking-wide">{label}</div><div className="font-medium text-slate-900 truncate">{value}</div></div>
);
