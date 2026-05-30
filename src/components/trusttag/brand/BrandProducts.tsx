import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, RoleGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { useTTAuth } from '@/components/trusttag/shared/useTTAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';

function Inner() {
  const { user } = useTTAuth();
  const [mf, setMf] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', category: '', model: '', description: '', warranty_months: 12 });
  const [show, setShow] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data: m } = await supabase.from('tt_manufacturers').select('*').eq('user_id', user.id).maybeSingle();
    setMf(m);
    if (m) {
      const { data } = await supabase.from('tt_products').select('*').eq('manufacturer_id', m.id).order('created_at', { ascending: false });
      setProducts(data ?? []);
    }
  };
  useEffect(() => { load(); }, [user]);

  const create = async () => {
    if (!mf) return;
    const { error } = await supabase.from('tt_products').insert({ manufacturer_id: mf.id, ...form });
    if (error) toast.error(error.message);
    else { toast.success('Product added'); setShow(false); setForm({ name: '', category: '', model: '', description: '', warranty_months: 12 }); load(); }
  };

  const importCSV = (file: File) => {
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: async ({ data }) => {
        const rows = (data as any[]).map((r) => ({
          manufacturer_id: mf.id,
          name: r.name || '', category: r.category || '', model: r.model || '',
          description: r.description || '', warranty_months: Number(r.warranty_months) || 0,
        })).filter((r) => r.name);
        const { error } = await supabase.from('tt_products').insert(rows);
        if (error) toast.error(error.message);
        else { toast.success(`Imported ${rows.length} products`); load(); }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display font-bold text-2xl md:text-3xl">Products</h1>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && importCSV(e.target.files[0])} />
            <Button variant="outline" className="border-tt-border" asChild><span><Upload className="h-4 w-4" /> Import CSV</span></Button>
          </label>
          <Button onClick={() => setShow(!show)} className="bg-tt-primary text-white"><Plus className="h-4 w-4" /> New Product</Button>
        </div>
      </div>
      {show && (
        <div className="tt-glass rounded-2xl p-6 space-y-3">
          <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div><Label>Model</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
            <div><Label>Warranty (months)</Label><Input type="number" value={form.warranty_months} onChange={(e) => setForm({ ...form, warranty_months: Number(e.target.value) })} /></div>
          </div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <Button onClick={create} className="bg-tt-primary text-white">Create</Button>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="tt-glass rounded-2xl p-5">
            <h3 className="font-display font-semibold">{p.name}</h3>
            <p className="text-sm text-tt-muted">{p.category} · {p.model}</p>
            {p.warranty_months > 0 && <p className="text-xs text-tt-primary mt-2">{p.warranty_months} month warranty</p>}
          </div>
        ))}
      </div>
      {products.length === 0 && <div className="tt-glass rounded-2xl p-12 text-center text-tt-muted">No products yet. CSV columns: name, category, model, description, warranty_months</div>}
    </div>
  );
}

export default function BrandProducts() { return <AuthGate><RoleGate role="manufacturer"><TTLayout><Inner /></TTLayout></RoleGate></AuthGate>; }
