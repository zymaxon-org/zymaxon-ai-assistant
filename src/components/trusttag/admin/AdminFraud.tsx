import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, RoleGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

function Inner() {
  const [flags, setFlags] = useState<any[]>([]);
  const [sweeping, setSweeping] = useState(false);
  const load = async () => {
    const { data } = await supabase.from('tt_fraud_flags').select('*').order('created_at', { ascending: false });
    setFlags(data ?? []);
  };
  useEffect(() => { load(); }, []);
  const resolve = async (id: string) => { await supabase.from('tt_fraud_flags').update({ resolved: true }).eq('id', id); load(); };
  const runSweep = async () => {
    setSweeping(true);
    const { data, error } = await supabase.functions.invoke('tt-fraud-check', { body: { mode: 'full' } });
    setSweeping(false);
    if (error) toast.error(error.message);
    else toast.success(`Sweep complete · ${data?.flags_created ?? 0} flags evaluated`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display font-bold text-2xl md:text-3xl flex items-center gap-2"><AlertTriangle className="h-6 w-6 text-tt-warn" /> Fraud Alerts</h1>
        <Button onClick={runSweep} disabled={sweeping} className="bg-tt-primary text-white">
          <RefreshCw className={`h-4 w-4 mr-2 ${sweeping ? 'animate-spin' : ''}`} />
          {sweeping ? 'Running AI sweep…' : 'Run AI sweep'}
        </Button>
      </div>
      <div className="space-y-3">
        {flags.length === 0 ? <div className="tt-glass rounded-2xl p-12 text-center text-tt-muted">No fraud flags. The system is healthy. 🎉</div> : flags.map((f) => (
          <div key={f.id} className="tt-glass rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{f.reason}</div>
              <div className="text-xs text-tt-muted">{f.entity_type} · {f.entity_id} · severity {f.severity}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${f.resolved ? 'bg-tt-primary/10 text-tt-primary' : 'bg-tt-warn/20 text-tt-warn'}`}>{f.resolved ? 'resolved' : 'open'}</span>
              {!f.resolved && <Button size="sm" onClick={() => resolve(f.id)} className="bg-tt-primary text-white">Resolve</Button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminFraud() { return <AuthGate><RoleGate role="admin"><TTLayout><Inner /></TTLayout></RoleGate></AuthGate>; }
