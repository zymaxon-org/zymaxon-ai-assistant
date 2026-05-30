import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { useTTAuth } from '@/components/trusttag/shared/useTTAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

function Inner() {
  const { user, roles } = useTTAuth();
  const [profile, setProfile] = useState<any>({ full_name: '', country: '' });
  const [manufacturer, setManufacturer] = useState<any>(null);
  const [mfForm, setMfForm] = useState({ company_name: '', website: '', description: '' });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase.from('tt_profiles').select('*').eq('user_id', user.id).maybeSingle();
      if (p) setProfile(p);
      const { data: m } = await supabase.from('tt_manufacturers').select('*').eq('user_id', user.id).maybeSingle();
      if (m) setManufacturer(m);
    })();
  }, [user]);

  const saveProfile = async () => {
    await supabase.from('tt_profiles').upsert({ user_id: user!.id, full_name: profile.full_name, country: profile.country }, { onConflict: 'user_id' });
    toast.success('Profile saved');
  };

  const applyBrand = async () => {
    const { error } = await supabase.from('tt_manufacturers').insert({ user_id: user!.id, ...mfForm });
    if (error) toast.error(error.message);
    else { toast.success('Application submitted — awaiting admin approval'); setManufacturer({ ...mfForm, verification_status: 'pending', verified: false }); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display font-bold text-2xl md:text-3xl">Profile</h1>
      <div className="tt-glass rounded-2xl p-6 space-y-3">
        <div><Label>Email</Label><Input value={user?.email ?? ''} disabled /></div>
        <div><Label>Full name</Label><Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
        <div><Label>Country</Label><Input value={profile.country ?? ''} onChange={(e) => setProfile({ ...profile, country: e.target.value })} /></div>
        <Button onClick={saveProfile} className="bg-tt-primary hover:bg-tt-primary/90 text-white">Save</Button>
      </div>

      <div className="tt-glass rounded-2xl p-6">
        <h2 className="font-display font-semibold mb-2">Manufacturer Access</h2>
        {roles.includes('manufacturer') ? (
          <p className="text-tt-primary text-sm">✓ You have manufacturer access. Visit the Brand Portal from the sidebar.</p>
        ) : manufacturer ? (
          <p className="text-tt-muted text-sm">Application status: <strong className="capitalize">{manufacturer.verification_status}</strong>. An admin will review shortly.</p>
        ) : (
          <div className="space-y-3 mt-3">
            <p className="text-sm text-tt-muted">Apply to issue QR codes for your products and get a verified badge.</p>
            <div><Label>Company name</Label><Input value={mfForm.company_name} onChange={(e) => setMfForm({ ...mfForm, company_name: e.target.value })} /></div>
            <div><Label>Website</Label><Input value={mfForm.website} onChange={(e) => setMfForm({ ...mfForm, website: e.target.value })} /></div>
            <div><Label>About your company</Label><Textarea value={mfForm.description} onChange={(e) => setMfForm({ ...mfForm, description: e.target.value })} /></div>
            <Button onClick={applyBrand} disabled={!mfForm.company_name} className="bg-tt-primary hover:bg-tt-primary/90 text-white">Apply</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() { return <AuthGate><TTLayout><Inner /></TTLayout></AuthGate>; }
