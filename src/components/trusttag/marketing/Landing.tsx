import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ShieldCheck, QrCode, Search, Building2, Users, ArrowRight, Check, Lock, Sparkles, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  useEffect(() => {
    document.title = 'TrustTag — Prove it. Protect it. Recover it.';
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', 'TrustTag verifies product authenticity, registers ownership of valuable items, and helps recover lost items through secure QR codes.');
    if (!meta.parentElement) document.head.appendChild(meta);
  }, []);

  return (
    <div className="trusttag min-h-screen bg-tt-bg text-tt-fg">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-tt-border bg-tt-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-16 items-center px-4 md:px-8">
          <Link to="/trusttag" className="flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-tt-primary" />
            <span className="font-display font-bold text-xl">TrustTag</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 ml-12 text-sm text-tt-muted">
            <a href="#features" className="hover:text-tt-fg transition">Features</a>
            <a href="#how" className="hover:text-tt-fg transition">How it works</a>
            <a href="#for-brands" className="hover:text-tt-fg transition">For Brands</a>
          </nav>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Link to="/trusttag/scan"><Button variant="ghost" size="sm">Scan QR</Button></Link>
            <Link to="/trusttag/auth"><Button size="sm" className="bg-tt-primary hover:bg-tt-primary/90 text-white">Get Started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-tt-primary/10 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full tt-glass text-xs font-medium mb-6 animate-fade-in">
            <Sparkles className="h-3 w-3 text-tt-primary" /> Trusted by people who refuse to lose things
          </div>
          <h1 className="font-display font-bold text-4xl md:text-7xl tracking-tight mb-6 animate-fade-in-up">
            Prove it. <span className="text-tt-primary">Protect it.</span> Recover it.
          </h1>
          <p className="text-lg md:text-xl text-tt-muted max-w-2xl mx-auto mb-10 animate-fade-in-up delay-100">
            TrustTag turns any valuable item into a verifiable, recoverable asset. Register it once, scan to verify, and bring it home if it's ever lost.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up delay-200">
            <Link to="/trusttag/auth">
              <Button size="lg" className="bg-tt-primary hover:bg-tt-primary/90 text-white tt-glow w-full sm:w-auto">
                Register an Item <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/trusttag/scan">
              <Button size="lg" variant="outline" className="border-tt-border w-full sm:w-auto">
                <QrCode className="h-4 w-4" /> Scan a QR Code
              </Button>
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto animate-fade-in delay-300">
            {[
              { v: '50K+', l: 'Items secured' },
              { v: '99.9%', l: 'Verification accuracy' },
              { v: '24/7', l: 'Recovery network' },
            ].map((s) => (
              <div key={s.l} className="tt-glass rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-display font-bold text-tt-primary">{s.v}</div>
                <div className="text-xs md:text-sm text-tt-muted mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">Everything you need to stay protected</h2>
          <p className="text-tt-muted max-w-xl mx-auto">From a single phone to a fleet of luxury inventory, TrustTag covers the entire ownership lifecycle.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: 'Instant Verification', body: 'Scan any TrustTag QR to confirm authenticity, ownership, and warranty in seconds.' },
            { icon: Search, title: 'Lost Item Recovery', body: 'Mark lost items, set a reward, and get notified the moment a finder scans the tag.' },
            { icon: Lock, title: 'Secure Messaging', body: 'Built-in chat between owners and finders — phone numbers and emails auto-blocked.' },
            { icon: Building2, title: 'Brand Authenticity', body: 'Manufacturers issue tamper-proof QR codes for every product they ship.' },
            { icon: Zap, title: 'Ownership Transfer', body: 'Sell or gift items with a verified, traceable handoff in two taps.' },
            { icon: Globe, title: 'Fraud Detection', body: 'Geo-anomaly and counterfeit pattern detection flags suspicious activity.' },
          ].map((f) => (
            <div key={f.title} className="tt-glass rounded-2xl p-6 hover:tt-glow transition-all">
              <div className="h-10 w-10 rounded-lg bg-tt-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-tt-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-tt-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-tt-glass border-y border-tt-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-center mb-16">How TrustTag works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: '01', t: 'Register your item', d: 'Add photos, serial number, and purchase details. We generate a unique QR code for you.' },
              { n: '02', t: 'Tag & forget', d: 'Print or stick the QR on your item. Verification works for life — no subscription needed.' },
              { n: '03', t: 'Verify or recover', d: 'Anyone scanning learns it\'s genuine. If lost, finders can message you instantly.' },
            ].map((s) => (
              <div key={s.n} className="relative">
                <div className="text-7xl font-display font-bold text-tt-primary/20">{s.n}</div>
                <h3 className="font-display font-semibold text-xl mt-2 mb-2">{s.t}</h3>
                <p className="text-tt-muted text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For brands */}
      <section id="for-brands" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="tt-glass rounded-3xl p-8 md:p-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tt-primary/10 text-tt-primary text-xs font-medium mb-4">
              <Building2 className="h-3 w-3" /> For Manufacturers
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Stop counterfeiters at the QR</h2>
            <p className="text-tt-muted mb-6">Issue thousands of cryptographically-unique QR codes for your products. Track every scan, detect counterfeits in real time, and give your customers the confidence they deserve.</p>
            <ul className="space-y-2 mb-6">
              {['Bulk QR generation via CSV', 'Real-time scan analytics', 'Geo-anomaly fraud alerts', 'Verified brand badge'].map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-tt-primary" /> {i}</li>
              ))}
            </ul>
            <Link to="/trusttag/auth"><Button className="bg-tt-primary hover:bg-tt-primary/90 text-white">Apply for Brand Account <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
          <div className="aspect-square bg-tt-primary/5 rounded-2xl flex items-center justify-center">
            <Users className="h-32 w-32 text-tt-primary/30" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
        <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">Ready to protect what matters?</h2>
        <p className="text-tt-muted mb-8">Free forever for personal use. No credit card required.</p>
        <Link to="/trusttag/auth"><Button size="lg" className="bg-tt-primary hover:bg-tt-primary/90 text-white tt-glow">Start Free <ArrowRight className="h-4 w-4" /></Button></Link>
      </section>

      <footer className="border-t border-tt-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-tt-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-tt-primary" />
            <span>© {new Date().getFullYear()} TrustTag. A Zymaxon product.</span>
          </div>
          <div className="flex gap-6">
            <Link to="/trusttag/scan" className="hover:text-tt-fg">Scan</Link>
            <Link to="/trusttag/auth" className="hover:text-tt-fg">Sign in</Link>
            <Link to="/" className="hover:text-tt-fg">Zymaxon</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
