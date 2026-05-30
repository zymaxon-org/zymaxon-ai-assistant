import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { useTTAuth } from '@/components/trusttag/shared/useTTAuth';
import { AlertTriangle } from 'lucide-react';

function Inner() {
  const { user } = useTTAuth();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from('tt_lost_reports')
        .select('*, tt_items(name, brand, category)')
        .eq('reported_by', user.id).order('created_at', { ascending: false });
      setReports(data ?? []);
    })();
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl md:text-3xl">Lost & Found</h1>
      {reports.length === 0 ? (
        <div className="tt-glass rounded-2xl p-12 text-center text-tt-muted">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No lost reports. Mark an item as lost from its detail page.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Link key={r.id} to={`/trusttag/app/items/${r.item_id}`} className="block tt-glass rounded-2xl p-5 hover:tt-glow transition">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold">{r.tt_items?.name}</h3>
                  <p className="text-sm text-tt-muted">{r.last_location || 'Location unknown'}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${r.status === 'open' ? 'bg-tt-warn/20 text-tt-warn' : 'bg-tt-primary/10 text-tt-primary'}`}>{r.status}</span>
                  {r.reward_amount > 0 && <div className="text-sm font-semibold text-tt-primary mt-1">₦{Number(r.reward_amount).toLocaleString()}</div>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LostPage() { return <AuthGate><TTLayout><Inner /></TTLayout></AuthGate>; }
