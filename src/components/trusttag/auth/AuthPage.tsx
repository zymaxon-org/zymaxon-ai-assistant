import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTTAuth } from '@/components/trusttag/shared/useTTAuth';
import { toast } from 'sonner';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInGoogle, resetPassword, user } = useTTAuth();
  const nav = useNavigate();

  if (user) { nav('/trusttag/app'); return null; }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) toast.error(error.message); else nav('/trusttag/app');
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) toast.error(error.message);
        else toast.success('Account created! Check your email to verify.');
      } else {
        const { error } = await resetPassword(email);
        if (error) toast.error(error.message); else toast.success('Reset link sent to your email');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="trusttag min-h-screen bg-tt-bg text-tt-fg flex flex-col">
      <div className="p-4">
        <Link to="/trusttag" className="inline-flex items-center gap-2 text-tt-muted hover:text-tt-fg text-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md tt-glass rounded-2xl p-8">
          <div className="flex flex-col items-center mb-6">
            <ShieldCheck className="h-10 w-10 text-tt-primary mb-2" />
            <h1 className="font-display font-bold text-2xl">
              {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Reset password'}
            </h1>
            <p className="text-tt-muted text-sm mt-1">
              {mode === 'signin' ? 'Sign in to your TrustTag account' : mode === 'signup' ? 'Protect your valuables today' : 'We\'ll email you a reset link'}
            </p>
          </div>

          {mode !== 'forgot' && (
            <>
              <Button variant="outline" className="w-full mb-4 border-tt-border" onClick={signInGoogle}>
                <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </Button>
              <div className="flex items-center gap-3 my-4 text-xs text-tt-muted"><div className="h-px bg-tt-border flex-1" /> OR <div className="h-px bg-tt-border flex-1" /></div>
            </>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <Label htmlFor="name">Full name</Label>
                <div className="relative mt-1">
                  <UserIcon className="h-4 w-4 absolute left-3 top-3 text-tt-muted" />
                  <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-9" required />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="h-4 w-4 absolute left-3 top-3 text-tt-muted" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
              </div>
            </div>
            {mode !== 'forgot' && (
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="h-4 w-4 absolute left-3 top-3 text-tt-muted" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" minLength={6} required />
                </div>
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full bg-tt-primary hover:bg-tt-primary/90 text-white">
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-tt-muted space-y-2">
            {mode === 'signin' && (
              <>
                <button onClick={() => setMode('forgot')} className="hover:text-tt-fg">Forgot password?</button>
                <p>No account? <button onClick={() => setMode('signup')} className="text-tt-primary font-medium">Sign up</button></p>
              </>
            )}
            {mode === 'signup' && <p>Have an account? <button onClick={() => setMode('signin')} className="text-tt-primary font-medium">Sign in</button></p>}
            {mode === 'forgot' && <button onClick={() => setMode('signin')} className="text-tt-primary font-medium">Back to sign in</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
