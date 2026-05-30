import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success('Password updated'); nav('/trusttag/app'); }
  };

  return (
    <div className="trusttag min-h-screen bg-tt-bg text-tt-fg flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-md tt-glass rounded-2xl p-8">
        <ShieldCheck className="h-10 w-10 text-tt-primary mb-2" />
        <h1 className="font-display font-bold text-2xl mb-1">Set a new password</h1>
        <p className="text-tt-muted text-sm mb-6">Choose a strong password you don't use elsewhere.</p>
        <Label htmlFor="pw">New password</Label>
        <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required className="mb-4 mt-1" />
        <Button disabled={loading} className="w-full bg-tt-primary hover:bg-tt-primary/90 text-white">{loading ? 'Updating…' : 'Update password'}</Button>
      </form>
    </div>
  );
}
