import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, TTLayout, RoleGate } from '@/components/trusttag/shared/TTLayout';
import { useTTAuth } from '@/components/trusttag/shared/useTTAuth';
import { Building2, Package, QrCode, BarChart3 } from 'lucide-react';

function Inner() {
  const { user } = useTTAuth();
  const [mf, setMf] = useState<any>(null);
  const [stats, setStats] = useState({ products: 0, qrs: 0, scans: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: m } = await supabase.from('tt_manufacturers').select('*').eq('user_id', user.id).maybeSingle();
      setMf(m);
      if (!m) return;
      const [p, b] = await Promise.all([
        supabase.from('tt_products').select('id', { count: 'exact', head: true }).eq('manufacturer_id', m.id),
        supabase.from('tt_qr_batches').select('size').eq('manufacturer_id', m.id),
      ]);
      const totalQr = (b.data ?? []).reduce((sum: number, x: any) => sum + x.size, 0);
      setStats({ products: p.count ?? 0, qrs: totalQr, scans: 0 });
    })();
  }, [user]);

  if (!mf) return <div className="tt-glass rounded-2xl p-12 text-center text-tt-muted">Set up your manufacturer profile from the Profile page first.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl flex items-center gap-3">
          {mf.company_name}
          {mf.verified && <span className="text-xs px-2 py-1 rounded-full bg-tt-primary/10 text-tt-primary">✓ Verified</span>}
        </h1>
        <p className="text-tt-muted text-sm mt-1">Brand portal</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[{ icon: Package, l: 'Products', v: stats.products, to: '/trusttag/brand/products' },
          { icon: QrCode, l: 'QR Codes', v: stats.qrs, to: '/trusttag/brand/qr' },
          { icon: BarChart3, l: 'Analytics', v: '→', to: '/trusttag/brand/analytics' }].map((c) => (
          <Link key={c.l} to={c.to} className="tt-glass rounded-2xl p-5 hover:tt-glow transition">
            <c.icon className="h-5 w-5 text-tt-primary mb-3" />
            <div className="text-2xl font-display font-bold">{c.v}</div>
            <div className="text-xs text-tt-muted mt-1">{c.l}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function BrandDashboard() { return <AuthGate><RoleGate role="manufacturer"><TTLayout><Inner /></TTLayout></RoleGate></AuthGate>; }
