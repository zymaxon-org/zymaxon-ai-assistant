import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, RoleGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { Users, Building2, AlertTriangle, Shield, FileText } from 'lucide-react';

function Inner() {
  const [stats, setStats] = useState({ users: 0, manufacturers: 0, items: 0, fraud: 0, scans: 0 });
  useEffect(() => {
    (async () => {
      const [profiles, mfs, items, fraud, scans] = await Promise.all([
        supabase.from('tt_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('tt_manufacturers').select('id', { count: 'exact', head: true }),
        supabase.from('tt_items').select('id', { count: 'exact', head: true }),
        supabase.from('tt_fraud_flags').select('id', { count: 'exact', head: true }).eq('resolved', false),
        supabase.from('tt_scans').select('id', { count: 'exact', head: true }),
      ]);
      setStats({ users: profiles.count ?? 0, manufacturers: mfs.count ?? 0, items: items.count ?? 0, fraud: fraud.count ?? 0, scans: scans.count ?? 0 });
    })();
  }, []);

  const cards = [
    { icon: Users, l: 'Users', v: stats.users, to: '/trusttag/admin/users' },
    { icon: Building2, l: 'Manufacturers', v: stats.manufacturers, to: '/trusttag/admin/manufacturers' },
    { icon: AlertTriangle, l: 'Fraud Alerts', v: stats.fraud, to: '/trusttag/admin/fraud' },
    { icon: FileText, l: 'Audit Log', v: '→', to: '/trusttag/admin/audit' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl flex items-center gap-2"><Shield className="h-6 w-6 text-tt-primary" /> Admin Console</h1>
        <p className="text-tt-muted text-sm mt-1">Platform-wide management & moderation.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.l} to={c.to} className="tt-glass rounded-2xl p-5 hover:tt-glow transition">
            <c.icon className="h-5 w-5 text-tt-primary mb-3" />
            <div className="text-2xl md:text-3xl font-display font-bold">{c.v}</div>
            <div className="text-xs text-tt-muted mt-1">{c.l}</div>
          </Link>
        ))}
      </div>
      <div className="tt-glass rounded-2xl p-6">
        <h2 className="font-display font-semibold mb-2">Platform snapshot</h2>
        <p className="text-sm text-tt-muted">Total items protected: <strong className="text-tt-fg">{stats.items}</strong> · Total scans: <strong className="text-tt-fg">{stats.scans}</strong></p>
      </div>
    </div>
  );
}

export default function AdminDashboard() { return <AuthGate><RoleGate role="admin"><TTLayout><Inner /></TTLayout></RoleGate></AuthGate>; }
