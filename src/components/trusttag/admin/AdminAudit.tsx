import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, RoleGate, TTLayout } from '@/components/trusttag/shared/TTLayout';

function Inner() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('tt_audit_logs').select('*').order('created_at', { ascending: false }).limit(200)
      .then(({ data }) => setLogs(data ?? []));
  }, []);
  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl md:text-3xl">Audit Log</h1>
      <div className="tt-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-tt-glass text-tt-muted text-xs uppercase text-left">
            <tr><th className="p-3">Time</th><th className="p-3">Actor</th><th className="p-3">Action</th><th className="p-3">Target</th></tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t border-tt-border">
                <td className="p-3 text-tt-muted">{new Date(l.created_at).toLocaleString()}</td>
                <td className="p-3 font-mono text-xs">{l.actor_user_id?.slice(0, 8) ?? '—'}</td>
                <td className="p-3">{l.action}</td>
                <td className="p-3 text-tt-muted">{l.target_type} {l.target_id}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-tt-muted">No audit events yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminAudit() { return <AuthGate><RoleGate role="admin"><TTLayout><Inner /></TTLayout></RoleGate></AuthGate>; }
