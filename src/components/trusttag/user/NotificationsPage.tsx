import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { useTTAuth } from '@/components/trusttag/shared/useTTAuth';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Inner() {
  const { user } = useTTAuth();
  const [items, setItems] = useState<any[]>([]);
  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('tt_notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => {
    load();
    if (!user) return;
    const ch = supabase.channel('tt-notifs').on('postgres_changes', { event: '*', schema: 'public', table: 'tt_notifications', filter: `user_id=eq.${user.id}` }, () => load()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const markRead = async (id: string) => {
    await supabase.from('tt_notifications').update({ read: true }).eq('id', id);
    load();
  };
  const markAll = async () => {
    await supabase.from('tt_notifications').update({ read: true }).eq('user_id', user!.id).eq('read', false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl md:text-3xl">Notifications</h1>
        <Button variant="outline" className="border-tt-border" onClick={markAll}><Check className="h-4 w-4" /> Mark all read</Button>
      </div>
      {items.length === 0 ? (
        <div className="tt-glass rounded-2xl p-12 text-center text-tt-muted">
          <Bell className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>You're all caught up.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <div key={n.id} className={`tt-glass rounded-xl p-4 flex items-start justify-between gap-3 ${!n.read ? 'border-l-4 border-tt-primary' : ''}`}>
              <div>
                <div className="font-medium">{n.title}</div>
                {n.body && <div className="text-sm text-tt-muted mt-1">{n.body}</div>}
                <div className="text-xs text-tt-muted mt-2">{new Date(n.created_at).toLocaleString()}</div>
              </div>
              {!n.read && <Button size="sm" variant="ghost" onClick={() => markRead(n.id)}>Mark read</Button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() { return <AuthGate><TTLayout><Inner /></TTLayout></AuthGate>; }
