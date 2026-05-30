import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { useTTAuth } from '@/components/trusttag/shared/useTTAuth';
import { Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TTItem } from '@/components/trusttag/shared/types';

function Inner() {
  const { user } = useTTAuth();
  const [items, setItems] = useState<TTItem[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase.from('tt_items').select('*').eq('owner_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setItems((data ?? []) as any));
  }, [user]);

  const filtered = items.filter((i) =>
    [i.name, i.brand, i.model, i.serial_number, i.category].join(' ').toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display font-bold text-2xl md:text-3xl">My Items</h1>
        <Link to="/trusttag/app/items/new"><Button className="bg-tt-primary hover:bg-tt-primary/90 text-white"><Plus className="h-4 w-4" /> Register Item</Button></Link>
      </div>
      <Input placeholder="Search items…" value={q} onChange={(e) => setQ(e.target.value)} />
      {filtered.length === 0 ? (
        <div className="tt-glass rounded-2xl p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-tt-muted opacity-40 mb-3" />
          <p className="text-tt-muted">No items found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((i) => (
            <Link key={i.id} to={`/trusttag/app/items/${i.id}`} className="tt-glass rounded-2xl p-5 hover:tt-glow transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-tt-glass">{i.category}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${i.status === 'lost' ? 'bg-tt-warn/20 text-tt-warn' : 'bg-tt-primary/10 text-tt-primary'}`}>{i.status}</span>
              </div>
              <h3 className="font-display font-semibold">{i.name}</h3>
              <p className="text-sm text-tt-muted mt-1">{i.brand} {i.model}</p>
              {i.serial_number && <p className="text-xs text-tt-muted mt-2 font-mono">SN: {i.serial_number}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ItemsList() { return <AuthGate><TTLayout><Inner /></TTLayout></AuthGate>; }
