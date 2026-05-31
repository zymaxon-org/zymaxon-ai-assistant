import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { useTTAuth } from '@/components/trusttag/shared/useTTAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, Check, X } from 'lucide-react';
import { toast } from 'sonner';

function Inner() {
  const { user } = useTTAuth();
  const [transfers, setTransfers] = useState<any[]>([]);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('tt_transfers').select('*, tt_items(name, brand)')
      .or(`from_user.eq.${user.id},to_user_id.eq.${user.id}`).order('created_at', { ascending: false });
    setTransfers(data ?? []);
  };
  useEffect(() => { load(); }, [user]);

  const accept = async (t: any) => {
    await supabase.from('tt_transfers').update({ status: 'accepted' }).eq('id', t.id);
    await supabase.from('tt_items').update({ owner_id: user!.id }).eq('id', t.item_id);
    await supabase.from('tt_ownership_history').insert({ item_id: t.item_id, from_user: t.from_user, to_user: user!.id, reason: 'transfer accepted' });
    supabase.functions.invoke('tt-fraud-check', { body: { mode: 'transfer', transfer_id: t.id, item_id: t.item_id } }).catch(() => {});
    toast.success('Ownership transferred to you');
    load();
  };
  const reject = async (t: any) => {
    await supabase.from('tt_transfers').update({ status: 'rejected' }).eq('id', t.id);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl md:text-3xl">Transfers</h1>
      {transfers.length === 0 ? (
        <div className="tt-glass rounded-2xl p-12 text-center text-tt-muted">
          <ArrowLeftRight className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No transfers yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transfers.map((t) => {
            const isIncoming = t.to_user_id === user?.id;
            return (
              <div key={t.id} className="tt-glass rounded-2xl p-5 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-display font-semibold">{t.tt_items?.name}</h3>
                  <p className="text-sm text-tt-muted">{isIncoming ? 'Incoming transfer' : `To: ${t.to_user_email}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'pending' ? 'bg-tt-warn/20 text-tt-warn' : t.status === 'accepted' ? 'bg-tt-primary/10 text-tt-primary' : 'bg-tt-glass text-tt-muted'}`}>{t.status}</span>
                  {isIncoming && t.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => accept(t)} className="bg-tt-primary text-white"><Check className="h-3 w-3" /> Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => reject(t)} className="border-tt-border"><X className="h-3 w-3" /> Reject</Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TransfersPage() { return <AuthGate><TTLayout><Inner /></TTLayout></AuthGate>; }
