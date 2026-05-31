import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ShieldCheck, AlertTriangle, XCircle, Calendar, Package, Building2, Award, MapPin, DollarSign, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function VerifyPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [finderLocation, setFinderLocation] = useState('');
  const [finderMessage, setFinderMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const { data: result } = await supabase.rpc('tt_verify_qr', { _token: token });
      setData(result);
      // Log the scan
      const qrId = (result as any)?.qr_id;
      const isLost = !!(result as any)?.lost_report;
      await supabase.from('tt_scans').insert({
        qr_code_id: qrId ?? null,
        token,
        result: !(result as any)?.found ? 'invalid' : isLost ? 'lost' : 'verified',
        user_agent: navigator.userAgent.slice(0, 200),
      });
      if (qrId) {
        supabase.functions.invoke('tt-fraud-check', { body: { mode: 'scan', qr_code_id: qrId } }).catch(() => {});
      }
      setLoading(false);
    })();
  }, [token]);

  const submitFound = async () => {
    if (!data?.lost_report?.id) return;
    setSubmitting(true);
    const { error } = await supabase.from('tt_found_reports').insert({
      lost_report_id: data.lost_report.id,
      location: finderLocation,
      message: finderMessage,
    });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else { setSubmitted(true); toast.success('Owner has been notified'); }
  };

  if (loading) {
    return <div className="trusttag min-h-screen bg-tt-bg text-tt-fg flex items-center justify-center">Verifying…</div>;
  }

  const found = data?.found;
  const lost = data?.lost_report;
  const item = data?.item;
  const product = data?.product;

  return (
    <div className="trusttag min-h-screen bg-tt-bg text-tt-fg">
      <div className="p-4">
        <Link to="/trusttag" className="inline-flex items-center gap-2 text-tt-muted hover:text-tt-fg text-sm">
          <ArrowLeft className="h-4 w-4" /> TrustTag
        </Link>
      </div>
      <div className="max-w-xl mx-auto px-4 pb-12">
        {!found ? (
          <div className="tt-glass rounded-2xl p-8 text-center border-2 border-tt-danger/30">
            <XCircle className="h-16 w-16 mx-auto text-tt-danger mb-4" />
            <h1 className="font-display font-bold text-2xl mb-2">Product Not Found</h1>
            <p className="text-tt-muted">This QR code is not registered with TrustTag. It may be counterfeit or invalid.</p>
          </div>
        ) : lost ? (
          <div className="space-y-4">
            <div className="tt-glass rounded-2xl p-8 text-center border-2 border-tt-warn/40">
              <AlertTriangle className="h-16 w-16 mx-auto text-tt-warn mb-4" />
              <h1 className="font-display font-bold text-2xl mb-2">Item Reported Lost</h1>
              <p className="text-tt-muted mb-4">The owner is looking for this {item?.category?.toLowerCase() || 'item'}. Help them get it back.</p>
              {lost.reward > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tt-primary/10 text-tt-primary font-semibold">
                  <DollarSign className="h-4 w-4" /> Reward: ₦{Number(lost.reward).toLocaleString()}
                </div>
              )}
              {lost.last_location && <p className="mt-3 text-sm text-tt-muted">Last seen: {lost.last_location}</p>}
              {lost.description && <p className="mt-2 text-sm">{lost.description}</p>}
            </div>
            {!submitted ? (
              <div className="tt-glass rounded-2xl p-6">
                <h2 className="font-display font-semibold text-lg mb-3">I found this item</h2>
                <p className="text-xs text-tt-muted mb-4">⚠️ For your safety, do not share phone numbers or emails — use the in-app chat after submitting.</p>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="loc">Where did you find it?</Label>
                    <Input id="loc" value={finderLocation} onChange={(e) => setFinderLocation(e.target.value)} placeholder="e.g. Wuse Market, Abuja" />
                  </div>
                  <div>
                    <Label htmlFor="msg">Message to owner</Label>
                    <Textarea id="msg" value={finderMessage} onChange={(e) => setFinderMessage(e.target.value)} placeholder="Where can they meet you?" rows={3} />
                  </div>
                  <Button onClick={submitFound} disabled={submitting || !finderLocation} className="w-full bg-tt-primary hover:bg-tt-primary/90 text-white">
                    {submitting ? 'Submitting…' : 'Notify Owner'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="tt-glass rounded-2xl p-8 text-center">
                <ShieldCheck className="h-12 w-12 mx-auto text-tt-primary mb-3" />
                <p className="font-medium">Owner notified. Thank you! 🙌</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="tt-glass rounded-2xl p-8 text-center border-2 border-tt-primary/30 tt-glow">
              <div className="h-16 w-16 mx-auto rounded-full bg-tt-primary flex items-center justify-center mb-4">
                <ShieldCheck className="h-9 w-9 text-white" />
              </div>
              <h1 className="font-display font-bold text-2xl mb-1 text-tt-primary">Verified Genuine</h1>
              <p className="text-tt-muted text-sm">This product is authentic and registered with TrustTag</p>
            </div>
            <div className="tt-glass rounded-2xl p-6 space-y-3">
              {item && (
                <>
                  <Row icon={Package} label="Item" value={item.name} />
                  {item.brand && <Row label="Brand" value={item.brand} />}
                  {item.model && <Row label="Model" value={item.model} />}
                  <Row icon={Calendar} label="Registered" value={new Date(item.registered_at).toLocaleDateString()} />
                  <Row label="Status" value={<span className="capitalize">{item.status}</span>} />
                  {item.owner_name && <Row label="Owner" value={item.owner_name} />}
                </>
              )}
              {product && (
                <>
                  <div className="border-t border-tt-border my-3" />
                  <Row icon={Building2} label="Manufacturer" value={
                    <span className="flex items-center gap-2">{product.manufacturer}
                      {product.manufacturer_verified && <span className="text-tt-primary text-xs">✓ Verified</span>}
                    </span>
                  } />
                  {product.warranty_months > 0 && <Row icon={Award} label="Warranty" value={`${product.warranty_months} months`} />}
                </>
              )}
            </div>
            <Link to="/trusttag/auth"><Button variant="outline" className="w-full border-tt-border">Protect your own items with TrustTag</Button></Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon?: any; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 text-tt-muted">{Icon && <Icon className="h-4 w-4" />}{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
