import { Link } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicHeader, PublicFooter } from '@/components/tracetag/shared/Layout';
import { useDocTitle } from '@/components/tracetag/shared/useAuth';

const TIERS = [
  { name: 'Free', price: '₦0', period: 'forever', cta: 'Get started', highlight: false,
    features: ['Up to 3 items', '1 active stolen report', 'Basic certificate', 'QR code download'] },
  { name: 'Individual Pro', price: '₦2,000', period: '/month', cta: 'Coming soon', highlight: true,
    features: ['Unlimited items', 'Priority stolen flagging', 'PDF certificates', 'Search alerts with location', 'Recovery tracking'] },
  { name: 'Business / Dealer', price: '₦25,000', period: '/month', cta: 'Coming soon', highlight: false,
    features: ['Unlimited verifications', 'Bulk CSV checking', 'API access', 'Verified Dealer badge', 'White-label widget', 'Monthly reports'] },
];

export default function Pricing() {
  useDocTitle('Pricing — TraceTag Nigeria');
  return (
    <div className="tracetag bg-slate-50 min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-tt-navy">Simple, transparent pricing</h1>
          <p className="mt-2 text-slate-600">Public search is always free. Pay only for what you protect.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {TIERS.map(t => (
            <div key={t.name} className={`bg-white rounded-2xl border p-6 flex flex-col ${t.highlight ? 'border-tt-navy ring-2 ring-tt-navy/20' : 'border-tt-border'}`}>
              {t.highlight && <div className="text-xs font-bold text-tt-navy mb-2">MOST POPULAR</div>}
              <div className="text-lg font-bold text-tt-navy">{t.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{t.price}</span>
                <span className="text-sm text-slate-500">{t.period}</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-slate-700 flex-1">
                {t.features.map(f => <li key={f} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-tt-green mt-0.5 shrink-0" />{f}</li>)}
              </ul>
              <Button disabled={t.cta === 'Coming soon'} asChild={t.cta !== 'Coming soon'}
                className={`mt-5 w-full ${t.highlight ? 'bg-tt-navy hover:bg-tt-navy/90 text-white' : ''}`}
                variant={t.highlight ? 'default' : 'outline'}>
                {t.cta === 'Coming soon' ? <span>Coming soon — Paystack integration pending</span> :
                  <Link to="/tracetag/auth?tab=signup">{t.cta}</Link>}
              </Button>
            </div>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
