import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { useTTAuth } from '@/components/trusttag/shared/useTTAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, AlertTriangle, ArrowLeftRight, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';

function Inner() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useTTAuth();
  const [item, setItem] = useState<any>(null);
  const [qr, setQr] = useState<any>(null);
  const [qrImg, setQrImg] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [scans, setScans] = useState<any[]>([]);
  const [showLost, setShowLost] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [reward, setReward] = useState('');
  const [lastLocation, setLastLocation] = useState('');
  const [lostDesc, setLostDesc] = useState('');
  const [transferEmail, setTransferEmail] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: itm } = await supabase.from('tt_items').select('*').eq('id', id).single();
      setItem(itm);
      const { data: q } = await supabase.from('tt_qr_codes').select('*').eq('item_id', id).single();
      setQr(q);
      if (q) {
        const url = `${window.location.origin}/trusttag/verify/${q.token}`;
        const img = await QRCode.toDataURL(url, { margin: 1, width: 400, color: { dark: '#064E3B', light: '#FFFFFF' } });
        setQrImg(img);
      }
      const { data: h } = await supabase.from('tt_ownership_history').select('*').eq('item_id', id).order('transferred_at', { ascending: false });
      setHistory(h ?? []);
      if (q) {
        const { data: s } = await supabase.from('tt_scans').select('*').eq('qr_code_id', q.id).order('created_at', { ascending: false }).limit(10);
        setScans(s ?? []);
      }
    })();
  }, [id]);

  const markLost = async () => {
    if (!item) return;
    await supabase.from('tt_lost_reports').insert({
      item_id: item.id, reported_by: user!.id,
      reward_amount: Number(reward) || 0, last_location: lastLocation, description: lostDesc,
    });
    await supabase.from('tt_items').update({ status: 'lost' }).eq('id', item.id);
    toast.success('Item marked as lost');
    setShowLost(false);
    setItem({ ...item, status: 'lost' });
  };

  const markRecovered = async () => {
    await supabase.from('tt_lost_reports').update({ status: 'recovered' }).eq('item_id', item.id).eq('status', 'open');
    await supabase.from('tt_items').update({ status: 'active' }).eq('id', item.id);
    toast.success('Item marked as recovered');
    setItem({ ...item, status: 'active' });
  };

  const initiateTransfer = async () => {
    if (!transferEmail) return;
    const token = crypto.randomUUID();
    const { data: existing } = await supabase.from('tt_profiles').select('user_id').ilike('full_name', transferEmail).maybeSingle();
    await supabase.from('tt_transfers').insert({
      item_id: item.id, from_user: user!.id, to_user_email: transferEmail,
      to_user_id: existing?.user_id ?? null, token,
    });
    toast.success('Transfer request created');
    setShowTransfer(false);
    setTransferEmail('');
  };

  const deleteItem = async () => {
    if (!confirm('Delete this item permanently?')) return;
    await supabase.from('tt_items').delete().eq('id', item.id);
    nav('/trusttag/app/items');
  };

  const downloadQR = () => {
    const a = document.createElement('a');
    a.href = qrImg;
    a.download = `trusttag-${item.name.replace(/\s+/g, '-')}.png`;
    a.click();
  };

  if (!item) return <div className="text-tt-muted">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">{item.name}</h1>
          <p className="text-tt-muted text-sm">{item.brand} {item.model}</p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full ${item.status === 'lost' ? 'bg-tt-warn/20 text-tt-warn' : 'bg-tt-primary/10 text-tt-primary'}`}>{item.status}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="tt-glass rounded-2xl p-6">
          <h2 className="font-display font-semibold mb-4">QR Code</h2>
          {qrImg ? (
            <>
              <img src={qrImg} alt="QR" className="w-full max-w-xs mx-auto rounded-xl" />
              <Button onClick={downloadQR} className="w-full mt-4 bg-tt-primary hover:bg-tt-primary/90 text-white"><Download className="h-4 w-4" /> Download QR</Button>
              <p className="text-xs text-tt-muted mt-3 text-center break-all">Token: {qr?.token}</p>
            </>
          ) : <p className="text-tt-muted">No QR code yet.</p>}
        </div>

        <div className="space-y-4">
          <div className="tt-glass rounded-2xl p-6">
            <h2 className="font-display font-semibold mb-3">Details</h2>
            <dl className="space-y-2 text-sm">
              {item.serial_number && <div className="flex justify-between"><dt className="text-tt-muted">Serial</dt><dd className="font-mono">{item.serial_number}</dd></div>}
              {item.purchase_date && <div className="flex justify-between"><dt className="text-tt-muted">Purchased</dt><dd>{new Date(item.purchase_date).toLocaleDateString()}</dd></div>}
              {item.description && <div><dt className="text-tt-muted mb-1">Description</dt><dd>{item.description}</dd></div>}
            </dl>
          </div>

          <div className="tt-glass rounded-2xl p-6 space-y-2">
            <h2 className="font-display font-semibold mb-3">Actions</h2>
            {item.status === 'lost' ? (
              <Button onClick={markRecovered} className="w-full bg-tt-primary hover:bg-tt-primary/90 text-white"><Check className="h-4 w-4" /> Mark Recovered</Button>
            ) : (
              <Button onClick={() => setShowLost(!showLost)} variant="outline" className="w-full border-tt-warn text-tt-warn hover:bg-tt-warn/10"><AlertTriangle className="h-4 w-4" /> Report Lost</Button>
            )}
            <Button onClick={() => setShowTransfer(!showTransfer)} variant="outline" className="w-full border-tt-border"><ArrowLeftRight className="h-4 w-4" /> Transfer Ownership</Button>
            <Button onClick={deleteItem} variant="outline" className="w-full border-tt-border text-tt-danger"><Trash2 className="h-4 w-4" /> Delete</Button>
          </div>

          {showLost && (
            <div className="tt-glass rounded-2xl p-6 space-y-3">
              <h3 className="font-display font-semibold">Report Lost</h3>
              <div><Label>Reward (₦)</Label><Input type="number" value={reward} onChange={(e) => setReward(e.target.value)} /></div>
              <div><Label>Last Known Location</Label><Input value={lastLocation} onChange={(e) => setLastLocation(e.target.value)} /></div>
              <div><Label>Description</Label><Textarea value={lostDesc} onChange={(e) => setLostDesc(e.target.value)} /></div>
              <Button onClick={markLost} className="w-full bg-tt-warn text-white hover:opacity-90">Submit Lost Report</Button>
            </div>
          )}
          {showTransfer && (
            <div className="tt-glass rounded-2xl p-6 space-y-3">
              <h3 className="font-display font-semibold">Transfer Ownership</h3>
              <div><Label>New owner email</Label><Input type="email" value={transferEmail} onChange={(e) => setTransferEmail(e.target.value)} /></div>
              <Button onClick={initiateTransfer} className="w-full bg-tt-primary hover:bg-tt-primary/90 text-white">Send Transfer Request</Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="tt-glass rounded-2xl p-6">
          <h2 className="font-display font-semibold mb-3">Ownership History</h2>
          {history.length === 0 ? <p className="text-tt-muted text-sm">No history yet.</p> : (
            <ul className="space-y-2 text-sm">
              {history.map((h) => (
                <li key={h.id} className="flex justify-between border-b border-tt-border pb-2">
                  <span>{h.reason || 'transfer'}</span>
                  <span className="text-tt-muted">{new Date(h.transferred_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="tt-glass rounded-2xl p-6">
          <h2 className="font-display font-semibold mb-3">Recent Scans</h2>
          {scans.length === 0 ? <p className="text-tt-muted text-sm">No scans yet.</p> : (
            <ul className="space-y-2 text-sm">
              {scans.map((s) => (
                <li key={s.id} className="flex justify-between border-b border-tt-border pb-2">
                  <span className="capitalize">{s.result}</span>
                  <span className="text-tt-muted">{new Date(s.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ItemDetail() { return <AuthGate><TTLayout><Inner /></TTLayout></AuthGate>; }
