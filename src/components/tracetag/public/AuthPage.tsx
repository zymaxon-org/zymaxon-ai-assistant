import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck } from 'lucide-react';
import { PublicHeader, PublicFooter } from '@/components/tracetag/shared/Layout';
import { useAuth, useDocTitle } from '@/components/tracetag/shared/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function AuthPage() {
  useDocTitle('Sign in or register — TraceTag Nigeria');
  const [params] = useSearchParams();
  const initial = params.get('tab') ?? 'login';
  const [tab, setTab] = useState<'login'|'signup'|'dealer'>(initial as any);
  return (
    <div className="tracetag bg-slate-50 min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-tt-navy text-white mb-3">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-tt-navy">TraceTag Nigeria</h1>
            <p className="text-sm text-slate-600 mt-1">Protect what's yours. Verify before you buy.</p>
          </div>

          <div className="bg-white rounded-2xl border border-tt-border shadow-sm p-2">
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
              {(['login','signup','dealer'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`py-2 text-xs font-semibold rounded-md transition ${tab === t ? 'bg-white text-tt-navy shadow' : 'text-slate-600'}`}>
                  {t === 'login' ? 'Log in' : t === 'signup' ? 'Individual' : 'Dealer'}
                </button>
              ))}
            </div>
            <div className="p-4">
              {tab === 'login' && <LoginForm />}
              {tab === 'signup' && <SignupForm />}
              {tab === 'dealer' && <DealerForm />}
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">
            By continuing you agree to our <Link to="/tracetag/terms" className="underline">Terms</Link> and <Link to="/tracetag/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

function LoginForm() {
  const { signIn, signInGoogle } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await signIn(email, password); setLoading(false);
    if (error) toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    else nav('/tracetag/app');
  };
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div><Label>Email</Label><Input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
      <div><Label>Password</Label><Input type="password" required value={password} onChange={e => setPassword(e.target.value)} /></div>
      <Button disabled={loading} className="w-full bg-tt-navy hover:bg-tt-navy/90 text-white">{loading ? 'Signing in…' : 'Sign in'}</Button>
      <Button type="button" variant="outline" className="w-full" onClick={signInGoogle}>Continue with Google</Button>
    </form>
  );
}

function SignupForm() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await signUp(form.email, form.password, form.fullName);
    if (error) { toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' }); setLoading(false); return; }
    // store phone on profile (after auto-created)
    setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await supabase.from('tt_profiles').update({ phone_number: form.phone }).eq('user_id', user.id);
    }, 1500);
    setLoading(false);
    toast({ title: 'Account created', description: 'Check your email to verify, then start registering items.' });
    nav('/tracetag/app');
  };
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div><Label>Full name</Label><Input required value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} /></div>
      <div><Label>Email</Label><Input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
      <div><Label>Phone number</Label><Input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="0801 234 5678" /></div>
      <div><Label>Password</Label><Input type="password" required minLength={6} value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
      <Button disabled={loading} className="w-full bg-tt-navy hover:bg-tt-navy/90 text-white">{loading ? 'Creating…' : 'Create account'}</Button>
    </form>
  );
}

function DealerForm() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    businessName: '', cacNumber: '', businessType: 'other', contactPerson: '',
    email: '', phone: '', address: '', password: '',
  });
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await signUp(form.email, form.password, form.contactPerson);
    if (error) { toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' }); setLoading(false); return; }
    setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('tt_profiles').update({ phone_number: form.phone, account_type: 'dealer' }).eq('user_id', user.id);
      await supabase.from('tt_business_profiles').insert({
        user_id: user.id, business_name: form.businessName, cac_number: form.cacNumber,
        business_type: form.businessType, contact_person: form.contactPerson,
        business_email: form.email, business_phone: form.phone, business_address: form.address,
        api_key: 'tt_' + Math.random().toString(36).slice(2, 18),
      });
    }, 1500);
    setLoading(false);
    toast({ title: 'Application submitted', description: 'We will review your business and email you within 1-2 business days.' });
    nav('/tracetag/app');
  };
  return (
    <form onSubmit={onSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
      <div><Label>Business name</Label><Input required value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} /></div>
      <div><Label>CAC number</Label><Input required value={form.cacNumber} onChange={e => setForm({...form, cacNumber: e.target.value})} /></div>
      <div><Label>Business type</Label>
        <Select value={form.businessType} onValueChange={v => setForm({...form, businessType: v})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="marketplace">Marketplace</SelectItem>
            <SelectItem value="phone_dealer">Phone Dealer</SelectItem>
            <SelectItem value="car_dealer">Car Dealer</SelectItem>
            <SelectItem value="electronics">Electronics Shop</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label>Contact person</Label><Input required value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})} /></div>
      <div><Label>Email</Label><Input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
      <div><Label>Phone</Label><Input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
      <div><Label>Business address</Label><Textarea required value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
      <div><Label>Password</Label><Input type="password" required minLength={6} value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
      <Button disabled={loading} className="w-full bg-tt-navy hover:bg-tt-navy/90 text-white">{loading ? 'Submitting…' : 'Apply for Business Account'}</Button>
    </form>
  );
}
