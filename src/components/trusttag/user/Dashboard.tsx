import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { useTTAuth } from '@/components/trusttag/shared/useTTAuth';
import { Package, AlertTriangle, ShieldCheck, ArrowLeftRight, Plus, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

function DashboardInner() {
  const { user } = useTTAuth();
  const [stats, setStats] = useState({ items: 0, lost: 0, scans: 0, transfers: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [items, lost, transfers] = await Promise.all([
        supabase.from('tt_items').select('id, name, status, created_at, category').eq('owner_id', user.id).order('created_at', { ascending: false }),
        supabase.from('tt_lost_reports').select('id').eq('reported_by', user.id).eq('status', 'open'),
        supabase.from('tt_transfers').select('id').or(`from_user.eq.${user.id},to_user_id.eq.${user.id}`).eq('status', 'pending'),
      ]);
      const itemIds = (items.data ?? []).map((i: any) => i.id);
      let scanCount = 0;
      if (itemIds.length) {
        const { count } = await supabase.from('tt_qr_codes').select('scan_count', { count: 'exact', head: false }).in('item_id', itemIds);
        scanCount = count ?? 0;
      }
      setStats({
        items: items.data?.length ?? 0,
        lost: lost.data?.length ?? 0,
        scans: scanCount,
        transfers: transfers.data?.length ?? 0,
      });
      setRecent((items.data ?? []).slice(0, 5));
    })();
  }, [user]);

  const cards = [
    { icon: Package, label: 'Registered Items', value: stats.items, color: 'text-tt-primary' },
    { icon: AlertTriangle, label: 'Lost Items', value: stats.lost, color: 'text-tt-warn' },
    { icon: ShieldCheck, label: 'Total Scans', value: stats.scans, color: 'text-tt-primary' },
    { icon: ArrowLeftRight, label: 'Pending Transfers', value: stats.transfers, color: 'text-tt-primary' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Welcome back</h1>
          <p className="text-tt-muted text-sm mt-1">Here's what's happening with your protected items.</p>
        </div>
        <Link to="/trusttag/app/items/new"><Button className="bg-tt-primary hover:bg-tt-primary/90 text-white"><Plus className="h-4 w-4" /> Register Item</Button></Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="tt-glass rounded-2xl p-5">
            <c.icon className={`h-5 w-5 ${c.color} mb-3`} />
            <div className="text-2xl md:text-3xl font-display font-bold">{c.value}</div>
            <div className="text-xs text-tt-muted mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="tt-glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">Recent Items</h2>
          <Link to="/trusttag/app/items" className="text-sm text-tt-primary hover:underline">View all</Link>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-12 text-tt-muted">
            <QrCode className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p>No items yet. Register your first item to get started.</p>
            <Link to="/trusttag/app/items/new"><Button className="mt-4 bg-tt-primary hover:bg-tt-primary/90 text-white">Register Item</Button></Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((i) => (
              <Link key={i.id} to={`/trusttag/app/items/${i.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-tt-glass transition">
                <div>
                  <div className="font-medium">{i.name}</div>
                  <div className="text-xs text-tt-muted">{i.category}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${i.status === 'lost' ? 'bg-tt-warn/20 text-tt-warn' : 'bg-tt-primary/10 text-tt-primary'}`}>{i.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return <AuthGate><TTLayout><DashboardInner /></TTLayout></AuthGate>;
}
