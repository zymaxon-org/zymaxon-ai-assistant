import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicHeader, PublicFooter } from '@/components/tracetag/shared/Layout';
import { useDocTitle } from '@/components/tracetag/shared/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function ItemStatusPage() {
  const { assetId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  useDocTitle(`Item ${assetId} — TraceTag Nigeria`, 'Public item status page on TraceTag Nigeria.');

  useEffect(() => {
    if (!assetId) return;
    supabase.rpc('tt_verify_search', { _query: assetId }).then(({ data }) => {
      setData(data); setLoading(false);
    });
  }, [assetId]);

  return (
    <div className="tracetag bg-slate-50 min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-10 w-full">
        <Link to="/tracetag/search" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-tt-navy mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to search
        </Link>

        {loading && <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border">Loading…</div>}

        {!loading && data?.status === 'stolen' && (
          <div className="bg-white border-2 border-tt-red rounded-2xl overflow-hidden">
            <div className="bg-tt-red text-white p-6 text-center">
              <AlertTriangle className="h-14 w-14 mx-auto mb-2" />
              <div className="text-2xl font-bold">REPORTED STOLEN</div>
              <div className="opacity-90 text-sm mt-1">Do not purchase this item</div>
            </div>
            <div className="p-6 space-y-2 text-sm">
              <Row k="Item" v={`${data.item_name}${data.brand ? ` · ${data.brand}` : ''}`} />
              <Row k="TraceTag Asset ID" v={data.asset_id} />
              <Row k="Owner" v={data.owner_display} />
              <Row k="Date stolen" v={data.date_stolen ?? '—'} />
              <Row k="Location" v={[data.lga_stolen, data.state_stolen].filter(Boolean).join(', ') || '—'} />
              <Row k="Police report" v={data.police_report_number ?? 'Not provided'} />
              <Button asChild className="w-full mt-4 bg-tt-navy text-white">
                <Link to={`/tracetag/tip?q=${assetId}&item=${data.item_id}`}>Report where you saw this item</Link>
              </Button>
            </div>
          </div>
        )}

        {!loading && (data?.status === 'clean' || data?.status === 'recovered' || data?.status === 'transferred') && (
          <div className="bg-white border-2 border-tt-green rounded-2xl overflow-hidden">
            <div className="bg-tt-green text-white p-6 text-center">
              <ShieldCheck className="h-14 w-14 mx-auto mb-2" />
              <div className="text-2xl font-bold">{data.status === 'clean' ? 'ITEM IS CLEAN' : data.status.toUpperCase()}</div>
              <div className="opacity-90 text-sm mt-1">Registered on TraceTag Nigeria</div>
            </div>
            <div className="p-6 space-y-2 text-sm">
              <Row k="Item" v={`${data.item_name}${data.brand ? ` · ${data.brand}` : ''}`} />
              <Row k="TraceTag Asset ID" v={data.asset_id} />
              <Row k="Category" v={data.item_category} />
              <Row k="Owner" v={data.owner_display} />
              <Row k="Registered" v={new Date(data.registered_at).toLocaleDateString()} />
            </div>
          </div>
        )}

        {!loading && (!data || data.status === 'not_found') && (
          <div className="bg-white border-2 border-slate-300 rounded-2xl p-8 text-center">
            <Shield className="h-12 w-12 mx-auto text-slate-400 mb-3" />
            <div className="text-xl font-bold text-slate-700">Item not found</div>
            <p className="text-sm text-slate-500 mt-2">No item with TraceTag ID <strong>{assetId}</strong> is registered.</p>
          </div>
        )}

        <Button asChild variant="outline" className="w-full mt-4"><Link to="/tracetag/search">Check another item</Link></Button>
      </main>
      <PublicFooter />
    </div>
  );
}

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between gap-3 py-1.5 border-b border-slate-100 last:border-0">
    <span className="text-slate-500">{k}</span>
    <span className="font-medium text-slate-900 text-right">{v}</span>
  </div>
);
