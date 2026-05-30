import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, RoleGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function Inner() {
  const [users, setUsers] = useState<any[]>([]);
  const load = async () => {
    const { data: profiles } = await supabase.from('tt_profiles').select('*').order('created_at', { ascending: false });
    const { data: roles } = await supabase.from('tt_user_roles').select('user_id, role');
    const byUser: Record<string, string[]> = {};
    (roles ?? []).forEach((r: any) => { (byUser[r.user_id] = byUser[r.user_id] || []).push(r.role); });
    setUsers((profiles ?? []).map((p: any) => ({ ...p, roles: byUser[p.user_id] || [] })));
  };
  useEffect(() => { load(); }, []);

  const toggleRole = async (uid: string, role: 'manufacturer' | 'admin', has: boolean) => {
    if (has) {
      await supabase.from('tt_user_roles').delete().eq('user_id', uid).eq('role', role);
    } else {
      await supabase.from('tt_user_roles').insert({ user_id: uid, role });
    }
    toast.success('Role updated');
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl md:text-3xl">Users</h1>
      <div className="tt-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-tt-glass text-tt-muted text-left text-xs uppercase">
            <tr><th className="p-3">Name</th><th className="p-3">Roles</th><th className="p-3">Joined</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-tt-border">
                <td className="p-3">{u.full_name || <span className="text-tt-muted">—</span>}</td>
                <td className="p-3"><div className="flex gap-1 flex-wrap">{u.roles.map((r: string) => <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-tt-primary/10 text-tt-primary">{r}</span>)}</div></td>
                <td className="p-3 text-tt-muted">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="border-tt-border" onClick={() => toggleRole(u.user_id, 'manufacturer', u.roles.includes('manufacturer'))}>
                    {u.roles.includes('manufacturer') ? 'Remove' : 'Grant'} manufacturer
                  </Button>
                  <Button size="sm" variant="outline" className="border-tt-border" onClick={() => toggleRole(u.user_id, 'admin', u.roles.includes('admin'))}>
                    {u.roles.includes('admin') ? 'Remove' : 'Grant'} admin
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminUsers() { return <AuthGate><RoleGate role="admin"><TTLayout><Inner /></TTLayout></RoleGate></AuthGate>; }
