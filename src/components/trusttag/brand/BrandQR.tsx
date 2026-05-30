import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, RoleGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { useTTAuth } from '@/components/trusttag/shared/useTTAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

function Inner() {
  const { user } = useTTAuth();
  const [mf, setMf] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [batchName, setBatchName] = useState('');
  const [productId, setProductId] = useState('');
  const [size, setSize] = useState(50);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data: m } = await supabase.from('tt_manufacturers').select('*').eq('user_id', user.id).maybeSingle();
    setMf(m);
    if (m) {
      const [pr, b] = await Promise.all([
        supabase.from('tt_products').select('id, name').eq('manufacturer_id', m.id),
        supabase.from('tt_qr_batches').select('*, tt_products(name)').eq('manufacturer_id', m.id).order('created_at', { ascending: false }),
      ]);
      setProducts(pr.data ?? []);
      setBatches(b.data ?? []);
    }
  };
  useEffect(() => { load(); }, [user]);

  const generate = async () => {
    if (!mf || !batchName || !size) return;
    setLoading(true);
    const { data: batch, error } = await supabase.from('tt_qr_batches').insert({
      manufacturer_id: mf.id, name: batchName, size, product_id: productId || null,
    }).select().single();
    if (error) { toast.error(error.message); setLoading(false); return; }
    const rows = Array.from({ length: size }, () => ({
      token: nanoid(24), batch_id: batch.id, product_id: productId || null,
    }));
    await supabase.from('tt_qr_codes').insert(rows);
    toast.success(`Generated ${size} QR codes`);
    setLoading(false); load();
  };

  const downloadBatch = async (batchId: string, name: string) => {
    const { data } = await supabase.from('tt_qr_codes').select('token').eq('batch_id', batchId);
    if (!data) return;
    // Build HTML page with all QR codes for print
    const pages = await Promise.all(data.map(async (q) => {
      const url = `${window.location.origin}/trusttag/verify/${q.token}`;
      const img = await QRCode.toDataURL(url, { margin: 1, width: 250, color: { dark: '#064E3B' } });
      return `<div style="display:inline-block;text-align:center;padding:10px;page-break-inside:avoid"><img src="${img}"/><div style="font-family:monospace;font-size:10px">${q.token}</div></div>`;
    }));
    const html = `<html><head><title>${name}</title></head><body>${pages.join('')}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${name}.html`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl md:text-3xl">QR Code Batches</h1>
      <div className="tt-glass rounded-2xl p-6 space-y-3">
        <h2 className="font-display font-semibold">Generate new batch</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <div><Label>Batch name</Label><Input value={batchName} onChange={(e) => setBatchName(e.target.value)} /></div>
          <div>
            <Label>Product (optional)</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Quantity</Label><Input type="number" min={1} max={5000} value={size} onChange={(e) => setSize(Number(e.target.value))} /></div>
        </div>
        <Button onClick={generate} disabled={loading} className="bg-tt-primary text-white">{loading ? 'Generating…' : 'Generate'}</Button>
      </div>
      <div className="space-y-2">
        {batches.map((b) => (
          <div key={b.id} className="tt-glass rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{b.name}</div>
              <div className="text-xs text-tt-muted">{b.size} codes · {b.tt_products?.name || 'No product'} · {new Date(b.created_at).toLocaleDateString()}</div>
            </div>
            <Button size="sm" variant="outline" className="border-tt-border" onClick={() => downloadBatch(b.id, b.name)}><Download className="h-4 w-4" /> Download</Button>
          </div>
        ))}
        {batches.length === 0 && <div className="text-center text-tt-muted py-8">No batches yet.</div>}
      </div>
    </div>
  );
}

export default function BrandQR() { return <AuthGate><RoleGate role="manufacturer"><TTLayout><Inner /></TTLayout></RoleGate></AuthGate>; }
