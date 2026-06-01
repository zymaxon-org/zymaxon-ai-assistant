import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, AlertTriangle, ArrowLeftRight, Search, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/tracetag/shared/Layout';
import { useAuth, useDocTitle } from '@/components/tracetag/shared/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function Dashboard() {
  useDocTitle('Dashboard — TraceTag');
  const { user } = useAuth();
  const [stats, setStats] = useState({ items: 0, stolen: 0, transfers: 0, searches: 0 });
  const [name, setName] = useState('');
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [items, stolen, transfers, profile, recentItems] = await Promise.all([
        supabase.from('tt_items').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
        supabase.from('tt_items').select('id', { count: 'exact', head: true }).eq('owner_id', user.id).eq('status','stolen'),
        supabase.from('tt_transfers').select('id', { count: 'exact', head: true }).eq('from_user_id', user.id).eq('status','pending'),
        supabase.from('tt_profiles').select('full_name').eq('user_id', user.id).maybeSingle(),
        supabase.from('tt_items').select('id,item_name,status,vivesa_asset_id,created_at').eq('owner_id', user.id).order('created_at', { ascending: false }).limit(5),
      ]);
      const myItemIds = (recentItems.data ?? []).map(i => i.id);
      const searches = myItemIds.length
        ? await supabase.from('tt_search_logs').select('id', { count: 'exact', head: true }).in('item_id', myItemIds)
        : { count: 0 };
      setStats({ items: items.count ?? 0, stolen: stolen.count ?? 0, transfers: transfers.count ?? 0, searches: searches.count ?? 0 });
      setName(profile.data?.full_name ?? '');
      setRecent(recentItems.data ?? []);
    })();
  }, [user]);

  const cards = [
    { icon: Package, label: 'Total items', value: stats.items, color: 'bg-tt-navy' },
    { icon: AlertTriangle, label: 'Flagged stolen', value: stats.stolen, color: 'bg-tt-red' },
    { icon: ArrowLeftRight, label: 'Pending transfers', value: stats.transfers, color: 'bg-amber-500' },
    { icon: Search, label: 'Searches on your items', value: stats.searches, color: 'bg-tt-green' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-tt-navy">Welcome back{name ? `, ${name.split(' ')[0]}` : ''}</h1>
          <p className="text-slate-600 text-sm mt-1">Manage your registered items, transfers, and alerts.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cards.map(c => (
            <div key={c.label} className="bg-white border border-tt-border rounded-2xl p-4">
              <div className={`h-9 w-9 rounded-lg ${c.color} text-white flex items-center justify-center mb-3`}><c.icon className="h-4 w-4" /></div>
              <div className="text-2xl font-bold text-tt-navy">{c.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{c.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild className="bg-tt-navy hover:bg-tt-navy/90 text-white"><Link to="/tracetag/app/items/new"><Plus className="h-4 w-4 mr-1" /> Register new item</Link></Button>
          <Button asChild variant="outline"><Link to="/tracetag/app/items">My items</Link></Button>
        </div>

        <div className="bg-white border border-tt-border rounded-2xl p-5">
          <h2 className="font-bold text-tt-navy mb-3">Recent items</h2>
          {recent.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <ShieldCheck className="h-10 w-10 mx-auto mb-2 text-slate-300" />
              No items yet. <Link to="/tracetag/app/items/new" className="text-tt-navy font-medium">Register your first</Link>.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recent.map(i => (
                <Link key={i.id} to={`/tracetag/app/items/${i.id}`} className="flex items-center gap-3 py-3 hover:bg-slate-50 -mx-2 px-2 rounded">
                  <Package className="h-5 w-5 text-slate-400" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{i.item_name}</div>
                    <div className="text-xs text-slate-500">{i.vivesa_asset_id}</div>
                  </div>
                  <StatusBadge status={i.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    clean: 'bg-tt-green/10 text-tt-green',
    stolen: 'bg-tt-red/10 text-tt-red',
    recovered: 'bg-blue-100 text-blue-700',
    transferred: 'bg-slate-200 text-slate-700',
  };
  return <span className={`text-xs font-semibold px-2 py-1 rounded ${map[status] ?? 'bg-slate-100'}`}>{status.toUpperCase()}</span>;
}
