import { useEffect, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/tracetag/shared/Layout';
import { useAuth, useDocTitle } from '@/components/tracetag/shared/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function NotificationsPage() {
  useDocTitle('Notifications — TraceTag');
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('tt_notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, [user]);

  const markAll = async () => {
    if (!user) return;
    await supabase.from('tt_notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
    load();
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-tt-navy">Notifications</h1>
        <Button variant="outline" size="sm" onClick={markAll}><Check className="h-4 w-4 mr-1" />Mark all read</Button>
      </div>
      <div className="bg-white border border-tt-border rounded-2xl divide-y divide-slate-100">
        {items.length === 0 && <div className="p-12 text-center text-slate-500"><Bell className="h-10 w-10 mx-auto mb-2 text-slate-300" />No notifications yet.</div>}
        {items.map(n => (
          <div key={n.id} className={`p-4 ${!n.is_read ? 'bg-tt-navy/5' : ''}`}>
            <div className="flex items-start gap-3">
              <Bell className={`h-5 w-5 ${!n.is_read ? 'text-tt-navy' : 'text-slate-400'}`} />
              <div className="flex-1">
                <div className="text-sm font-medium">{n.message}</div>
                <div className="text-xs text-slate-500 mt-0.5">{new Date(n.created_at).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
