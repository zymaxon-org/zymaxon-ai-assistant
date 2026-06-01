import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ShieldCheck, Search, AlertTriangle, ArrowRight, Smartphone, Laptop, Car, Bike, Zap, Tv, Gem, Package, CheckCircle2, Lock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicHeader, PublicFooter } from '@/components/tracetag/shared/Layout';
import { useDocTitle } from '@/components/tracetag/shared/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function Landing() {
  useDocTitle('TraceTag Nigeria — Protect what\'s yours. Verify before you buy.',
    'Nigeria\'s national item registry and stolen goods verification. Register phones, laptops, cars and more. Free public search by IMEI, plate number, or serial.');

  const [stats, setStats] = useState({ items: 0, stolen: 0, dealers: 0 });
  useEffect(() => {
    (async () => {
      const [a,b,c] = await Promise.all([
        supabase.from('tt_items').select('id', { count: 'exact', head: true }),
        supabase.from('tt_items').select('id', { count: 'exact', head: true }).eq('status','stolen'),
        supabase.from('tt_business_profiles').select('id', { count: 'exact', head: true }).eq('status','approved'),
      ]);
      setStats({ items: a.count ?? 0, stolen: b.count ?? 0, dealers: c.count ?? 0 });
    })();
  }, []);

  const categories = [
    { icon: Smartphone, label: 'Phones' }, { icon: Laptop, label: 'Laptops' },
    { icon: Car, label: 'Cars' }, { icon: Bike, label: 'Motorcycles' },
    { icon: Zap, label: 'Generators' }, { icon: Tv, label: 'TVs' },
    { icon: Gem, label: 'Jewelry' }, { icon: Package, label: 'Other' },
  ];

  return (
    <div className="tracetag bg-white min-h-screen">
      <PublicHeader />

      {/* HERO */}
      <section className="tt-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-28 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-6">
              <ShieldCheck className="h-3.5 w-3.5" />
              Nigeria's National Item Registry
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              Protect what's yours.<br/>
              <span className="text-white/80">Verify before you buy.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl">
              Register your phone, laptop, car or any valuable item. Flag it instantly if stolen.
              Anyone can verify before they buy. Free for everyone in Nigeria.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-white text-tt-navy hover:bg-white/90 font-semibold h-12 px-6">
                <Link to="/tracetag/auth?tab=signup">Register Your Items <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-tt-navy h-12 px-6">
                <Link to="/tracetag/search"><Search className="mr-2 h-4 w-4" /> Check if Item is Stolen</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/70">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Free to search</span>
              <span className="inline-flex items-center gap-2"><Lock className="h-4 w-4" /> Your data, encrypted</span>
              <span className="inline-flex items-center gap-2"><Eye className="h-4 w-4" /> Anonymous tip reporting</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-tt-border bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-3 gap-4 text-center">
          <div><div className="text-2xl md:text-4xl font-bold text-tt-navy">{stats.items.toLocaleString()}</div><div className="text-xs md:text-sm text-slate-600 mt-1">Items registered</div></div>
          <div><div className="text-2xl md:text-4xl font-bold text-tt-red">{stats.stolen.toLocaleString()}</div><div className="text-xs md:text-sm text-slate-600 mt-1">Stolen items flagged</div></div>
          <div><div className="text-2xl md:text-4xl font-bold text-tt-navy">{stats.dealers.toLocaleString()}</div><div className="text-xs md:text-sm text-slate-600 mt-1">Verified dealers</div></div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-tt-navy">How it works</h2>
          <p className="mt-3 text-slate-600">Three simple steps to protect what matters and verify what you buy.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: 1, icon: ShieldCheck, t: 'Register your item', d: 'Add your phone, laptop, car or any valuable. Get a unique TraceTag ID and printable QR code.' },
            { n: 2, icon: AlertTriangle, t: 'Flag if stolen', d: 'Lost or stolen? Report it instantly. Your item is flagged across the entire national database.' },
            { n: 3, icon: Search, t: 'Buyers verify', d: 'Anyone can check any item before buying. Clean or stolen — the answer is instant.' },
          ].map(s => (
            <div key={s.n} className="bg-white border border-tt-border rounded-2xl p-6 hover:shadow-lg transition">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-tt-navy text-white mb-4">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="text-xs font-bold text-tt-navy/60 mb-1">STEP {s.n}</div>
              <h3 className="text-xl font-bold text-tt-navy">{s.t}</h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-slate-50 border-y border-tt-border">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-tt-navy text-center mb-10">Register anything valuable</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {categories.map(c => (
              <div key={c.label} className="bg-white border border-tt-border rounded-xl p-4 text-center hover:border-tt-navy transition">
                <c.icon className="h-7 w-7 mx-auto text-tt-navy mb-2" />
                <div className="text-xs font-medium text-slate-700">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEALERS CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="bg-tt-navy text-white rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium mb-4">FOR BUSINESSES</div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">Dealer, marketplace, or reseller?</h2>
            <p className="mt-4 text-white/80">Integrate TraceTag verification into your platform. Run bulk checks. Earn the Verified Dealer badge and build trust with every customer.</p>
            <Button asChild size="lg" className="mt-6 bg-white text-tt-navy hover:bg-white/90">
              <Link to="/tracetag/auth?tab=dealer">Apply for Business Account</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {['Bulk CSV verification','Verified Dealer badge','API access','Verification history','PDF/CSV exports','White-label widget'].map(f => (
              <div key={f} className="bg-white/10 rounded-lg p-3 border border-white/10"><CheckCircle2 className="h-4 w-4 inline mr-2" />{f}</div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
