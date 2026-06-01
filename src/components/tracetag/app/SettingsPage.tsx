import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppLayout } from '@/components/tracetag/shared/Layout';
import { useAuth, useDocTitle } from '@/components/tracetag/shared/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function SettingsPage() {
  useDocTitle('Settings — TraceTag');
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>({ full_name: '', phone_number: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('tt_profiles').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => data && setProfile(data));
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('tt_profiles').update({
      full_name: profile.full_name, phone_number: profile.phone_number,
    }).eq('user_id', user.id);
    setSaving(false);
    toast({ title: error ? 'Failed' : 'Saved', description: error?.message, variant: error ? 'destructive' : 'default' });
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-tt-navy mb-4">Settings</h1>
      <form onSubmit={save} className="bg-white border border-tt-border rounded-2xl p-6 max-w-xl space-y-3">
        <div><Label>Email</Label><Input value={user?.email ?? ''} disabled /></div>
        <div><Label>Full name</Label><Input value={profile.full_name ?? ''} onChange={e => setProfile({...profile, full_name: e.target.value})} /></div>
        <div><Label>Phone number</Label><Input value={profile.phone_number ?? ''} onChange={e => setProfile({...profile, phone_number: e.target.value})} /></div>
        <Button type="submit" disabled={saving} className="bg-tt-navy text-white">{saving ? 'Saving…' : 'Save changes'}</Button>
      </form>
    </AppLayout>
  );
}
