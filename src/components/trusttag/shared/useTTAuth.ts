import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { TTRole } from './types';

export function useTTAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<TTRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      if (data.session?.user) await loadRoles(data.session.user.id);
      setLoading(false);
    };
    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) await loadRoles(session.user.id);
      else setRoles([]);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadRoles = async (uid: string) => {
    const { data } = await supabase.from('tt_user_roles').select('role').eq('user_id', uid);
    setRoles((data ?? []).map((r: any) => r.role as TTRole));
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/trusttag/app`, data: { full_name: fullName } },
    });
    return { error };
  };
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };
  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/trusttag/app` },
    });
  };
  const signOut = async () => { await supabase.auth.signOut(); };
  const resetPassword = async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/trusttag/auth/reset` });
  };

  const hasRole = (r: TTRole) => roles.includes(r);

  return { user, roles, loading, hasRole, signUp, signIn, signInGoogle, signOut, resetPassword };
}
