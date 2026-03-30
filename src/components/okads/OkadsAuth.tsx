import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOkadsAuth } from './shared/useOkadsAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Fish, Loader2 } from 'lucide-react';

export default function OkadsAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useOkadsAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/okads';

  if (user) {
    navigate(redirect, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = isLogin ? await signIn(email, password) : await signUp(email, password);
      if (error) throw error;

      if (!isLogin) {
        toast({ title: 'Account created!', description: 'Please check your email to verify your account.' });
      } else {
        navigate(redirect, { replace: true });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-4">
            <Fish className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#134E4A]">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-[#0D9488] mt-1 text-sm">
            {isLogin ? 'Login to your Okads account' : 'Start ordering fresh seafood today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@email.com" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#0D9488] hover:bg-[#134E4A] text-white font-bold">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-500">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-[#0D9488] font-medium hover:underline">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
