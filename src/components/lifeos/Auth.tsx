import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus, KeyRound } from 'lucide-react';

type Mode = 'login' | 'signup' | 'reset';

export default function Auth() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/lifeos', { replace: true });
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + '/lifeos' },
        });
        if (error) throw error;
        toast({ title: 'Check your email', description: 'We sent you a confirmation link.' });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/lifeos/auth',
        });
        if (error) throw error;
        toast({ title: 'Check your email', description: 'Password reset link sent.' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const titles = { login: 'Sign In', signup: 'Create Account', reset: 'Reset Password' };
  const icons = { login: LogIn, signup: UserPlus, reset: KeyRound };
  const Icon = icons[mode];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display text-foreground">LifeOS</CardTitle>
          <p className="text-sm text-muted-foreground">{titles[mode]}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {mode !== 'reset' && (
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : titles[mode]}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            {mode === 'login' && (
              <>
                <button onClick={() => setMode('signup')} className="text-sm text-primary hover:underline block mx-auto">
                  Don't have an account? Sign up
                </button>
                <button onClick={() => setMode('reset')} className="text-sm text-muted-foreground hover:underline block mx-auto">
                  Forgot password?
                </button>
              </>
            )}
            {mode !== 'login' && (
              <button onClick={() => setMode('login')} className="text-sm text-primary hover:underline block mx-auto">
                Back to sign in
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
