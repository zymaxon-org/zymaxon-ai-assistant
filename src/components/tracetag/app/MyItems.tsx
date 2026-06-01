import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppLayout } from '@/components/tracetag/shared/Layout';
import { useAuth, useDocTitle } from '@/components/tracetag/shared/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge } from './Dashboard';
import { ITEM_CATEGORIES } from '@/components/tracetag/shared/types';

export default function MyItems() {
  useDocTitle('My items — TraceTag');
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState({ category: 'all', status: 'all', q: '' });

  useEffect(() => {
    if (!user) return;
    supabase.from('tt_items').select('*').eq('owner_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setItems(data ?? []));
  }, [user]);

  const filtered = items.filter(i =>
    (filter.category === 'all' || i.item_category === filter.category) &&
    (filter.status === 'all' || i.status === filter.status) &&
    (!filter.q || i.item_name.toLowerCase().includes(filter.q.toLowerCase()) || i.vivesa_asset_id?.toLowerCase().includes(filter.q.toLowerCase()))
  );

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-tt-navy">My items</h1>
          <p className="text-sm text-slate-500">{items.length} registered</p>
        </div>
        <Button asChild className="bg-tt-navy text-white"><Link to="/tracetag/app/items/new"><Plus className="h-4 w-4 mr-1" />Register new</Link></Button>
      </div>

      <div className="bg-white border border-tt-border rounded-2xl p-4 mb-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search items…" className="pl-9" value={filter.q} onChange={e => setFilter({...filter, q: e.target.value})} />
        </div>
        <select className="border border-input rounded-md px-3 text-sm" value={filter.category} onChange={e => setFilter({...filter, category: e.target.value})}>
          <option value="all">All categories</option>
          {ITEM_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select className="border border-input rounded-md px-3 text-sm" value={filter.status} onChange={e => setFilter({...filter, status: e.target.value})}>
          <option value="all">All statuses</option>
          <option value="clean">Clean</option><option value="stolen">Stolen</option>
          <option value="recovered">Recovered</option><option value="transferred">Transferred</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-tt-border rounded-2xl p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500">No items match.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(i => (
            <Link key={i.id} to={`/tracetag/app/items/${i.id}`} className="bg-white border border-tt-border rounded-2xl p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-2">
                <div className="text-2xl">{ITEM_CATEGORIES.find(c => c.id === i.item_category)?.emoji ?? '📦'}</div>
                <StatusBadge status={i.status} />
              </div>
              <div className="font-bold text-tt-navy">{i.item_name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{[i.brand, i.model].filter(Boolean).join(' · ')}</div>
              <div className="text-xs font-mono text-slate-600 mt-2">{i.vivesa_asset_id}</div>
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
