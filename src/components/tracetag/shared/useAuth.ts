import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { TTRole } from './types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<TTRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadRoles = async (uid: string) => {
      const { data } = await supabase.from('tt_user_roles').select('role').eq('user_id', uid);
      if (mounted) setRoles((data ?? []).map((r: any) => r.role as TTRole));
    };
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      if (data.session?.user) loadRoles(data.session.user.id);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadRoles(session.user.id);
      else setRoles([]);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  return {
    user, roles, loading,
    hasRole: (r: TTRole) => roles.includes(r),
    signUp: (email: string, password: string, fullName: string) =>
      supabase.auth.signUp({ email, password, options: {
        emailRedirectTo: `${window.location.origin}/tracetag/app`,
        data: { full_name: fullName },
      }}),
    signIn: (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),
    signInGoogle: () => supabase.auth.signInWithOAuth({
      provider: 'google', options: { redirectTo: `${window.location.origin}/tracetag/app` },
    }),
    signOut: () => supabase.auth.signOut(),
  };
}

export function useDocTitle(title: string, desc?: string) {
  useEffect(() => {
    document.title = title;
    if (desc) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) { m = document.createElement('meta'); m.setAttribute('name','description'); document.head.appendChild(m); }
      m.setAttribute('content', desc);
    }
  }, [title, desc]);
}
