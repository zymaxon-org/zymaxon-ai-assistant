import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, RoleGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function Inner() {
  const [mfs, setMfs] = useState<any[]>([]);
  const load = async () => {
    const { data } = await supabase.from('tt_manufacturers').select('*').order('created_at', { ascending: false });
    setMfs(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const approve = async (m: any) => {
    await supabase.from('tt_manufacturers').update({ verified: true, verification_status: 'approved' }).eq('id', m.id);
    // grant manufacturer role
    await supabase.from('tt_user_roles').insert({ user_id: m.user_id, role: 'manufacturer' }).select().maybeSingle();
    toast.success('Manufacturer approved');
    load();
  };
  const reject = async (m: any) => {
    await supabase.from('tt_manufacturers').update({ verified: false, verification_status: 'rejected' }).eq('id', m.id);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl md:text-3xl">Manufacturers</h1>
      <div className="space-y-3">
        {mfs.map((m) => (
          <div key={m.id} className="tt-glass rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-display font-semibold">{m.company_name} {m.verified && <span className="text-xs text-tt-primary">✓ verified</span>}</h3>
              <p className="text-sm text-tt-muted">{m.website || 'No website'} · Status: {m.verification_status}</p>
              {m.description && <p className="text-xs text-tt-muted mt-1">{m.description}</p>}
            </div>
            <div className="flex gap-2">
              {!m.verified && <Button size="sm" onClick={() => approve(m)} className="bg-tt-primary text-white">Approve</Button>}
              <Button size="sm" variant="outline" className="border-tt-border" onClick={() => reject(m)}>Reject</Button>
            </div>
          </div>
        ))}
        {mfs.length === 0 && <div className="text-center text-tt-muted py-8">No manufacturer applications yet.</div>}
      </div>
    </div>
  );
}

export default function AdminManufacturers() { return <AuthGate><RoleGate role="admin"><TTLayout><Inner /></TTLayout></RoleGate></AuthGate>; }
