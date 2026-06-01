import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AppLayout } from '@/components/tracetag/shared/Layout';
import { useAuth, useDocTitle } from '@/components/tracetag/shared/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ITEM_CATEGORIES } from '@/components/tracetag/shared/types';
import { toast } from '@/hooks/use-toast';
import { downloadCertificate, downloadQR } from '@/components/tracetag/shared/qr';

const FIELDS: Record<string, { key: string; label: string; hint?: string; type?: string }[]> = {
  phone: [
    { key: 'brand', label: 'Brand (Apple, Samsung, Tecno…)' },
    { key: 'model', label: 'Model' },
    { key: 'color', label: 'Color' },
    { key: 'imei_1', label: 'IMEI 1', hint: 'Dial *#06# to find your IMEI (15 digits)' },
    { key: 'imei_2', label: 'IMEI 2 (dual SIM)' },
    { key: 'serial_number', label: 'Serial number' },
  ],
  laptop: [
    { key: 'brand', label: 'Brand' }, { key: 'model', label: 'Model' }, { key: 'color', label: 'Color' },
    { key: 'serial_number', label: 'Serial number' }, { key: 'mac_address', label: 'MAC address' },
  ],
  car: [
    { key: 'brand', label: 'Brand (Toyota, Honda…)' }, { key: 'model', label: 'Model' },
    { key: 'color', label: 'Color' }, { key: 'plate_number', label: 'Plate number' },
    { key: 'vin', label: 'VIN' }, { key: 'engine_number', label: 'Engine number' },
    { key: 'chassis_number', label: 'Chassis number' },
  ],
  motorcycle: [
    { key: 'brand', label: 'Brand' }, { key: 'model', label: 'Model' }, { key: 'color', label: 'Color' },
    { key: 'plate_number', label: 'Plate number' }, { key: 'engine_number', label: 'Engine number' },
    { key: 'frame_number', label: 'Frame number' },
  ],
  generator: [
    { key: 'brand', label: 'Brand' }, { key: 'model', label: 'Model' },
    { key: 'serial_number', label: 'Serial number' }, { key: 'kva_rating', label: 'KVA rating' },
    { key: 'color', label: 'Color' },
  ],
  tv: [
    { key: 'brand', label: 'Brand' }, { key: 'model', label: 'Model' },
    { key: 'serial_number', label: 'Serial number' }, { key: 'screen_size', label: 'Screen size' },
  ],
  jewelry: [
    { key: 'model', label: 'Type (Ring, Necklace, Watch…)' },
    { key: 'brand', label: 'Material (Gold, Silver, Diamond…)' },
    { key: 'additional_identifiers', label: 'Distinguishing features' },
  ],
  other: [
    { key: 'serial_number', label: 'Serial / ID number' },
    { key: 'additional_identifiers', label: 'Distinguishing features' },
  ],
};

export default function RegisterItem() {
  useDocTitle('Register new item — TraceTag');
  const { user } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<string>('');
  const [form, setForm] = useState<any>({ item_name: '', purchase_date: '', purchase_price: '', purchase_location: '' });
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<any>(null);

  const submit = async () => {
    if (!user) return;
    setSaving(true);
    const payload: any = { owner_id: user.id, item_category: category, item_photos: [] };
    Object.keys(form).forEach(k => { if (form[k] !== '') payload[k] = form[k]; });
    if (payload.purchase_price) payload.purchase_price = Number(payload.purchase_price);
    const { data, error } = await supabase.from('tt_items').insert(payload).select().single();
    setSaving(false);
    if (error) { toast({ title: 'Failed', description: error.message, variant: 'destructive' }); return; }
    setCreated(data); setStep(4);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-tt-navy mb-1">Register new item</h1>
        <p className="text-sm text-slate-500 mb-6">Step {step} of 4</p>

        {step === 1 && (
          <div className="bg-white border border-tt-border rounded-2xl p-6">
            <h2 className="font-bold mb-4">Select category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ITEM_CATEGORIES.map(c => (
                <button key={c.id} onClick={() => { setCategory(c.id); setStep(2); }}
                  className={`p-4 border-2 rounded-xl text-center transition ${category === c.id ? 'border-tt-navy bg-tt-navy/5' : 'border-tt-border hover:border-tt-navy'}`}>
                  <div className="text-3xl mb-1">{c.emoji}</div>
                  <div className="text-sm font-medium">{c.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white border border-tt-border rounded-2xl p-6 space-y-3">
            <h2 className="font-bold mb-2">Item details</h2>
            <div><Label>Item name *</Label>
              <Input required value={form.item_name} onChange={e => setForm({...form, item_name: e.target.value})} placeholder="e.g. iPhone 14 Pro Max" /></div>
            {FIELDS[category]?.map(f => (
              <div key={f.key}>
                <Label>{f.label}</Label>
                <Input value={form[f.key] ?? ''} onChange={e => setForm({...form, [f.key]: e.target.value})} />
                {f.hint && <p className="text-xs text-slate-500 mt-1">{f.hint}</p>}
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Purchase date</Label><Input type="date" value={form.purchase_date} onChange={e => setForm({...form, purchase_date: e.target.value})} /></div>
              <div><Label>Purchase price (₦)</Label><Input type="number" value={form.purchase_price} onChange={e => setForm({...form, purchase_price: e.target.value})} /></div>
            </div>
            <div><Label>Where purchased</Label><Input value={form.purchase_location} onChange={e => setForm({...form, purchase_location: e.target.value})} /></div>
            <div className="flex justify-between pt-3">
              <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>
              <Button onClick={() => setStep(3)} disabled={!form.item_name} className="bg-tt-navy text-white">Review <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white border border-tt-border rounded-2xl p-6">
            <h2 className="font-bold mb-3">Review & confirm</h2>
            <div className="space-y-1 text-sm border-t pt-3">
              <Row k="Category" v={category} />
              <Row k="Name" v={form.item_name} />
              {FIELDS[category]?.map(f => form[f.key] && <Row key={f.key} k={f.label} v={form[f.key]} />)}
              {form.purchase_date && <Row k="Purchase date" v={form.purchase_date} />}
              {form.purchase_price && <Row k="Price" v={`₦${Number(form.purchase_price).toLocaleString()}`} />}
            </div>
            <p className="text-xs text-slate-500 mt-4">By registering, I confirm I am the legal owner of this item.</p>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={submit} disabled={saving} className="bg-tt-navy text-white">{saving ? 'Registering…' : 'Register item'}</Button>
            </div>
          </div>
        )}

        {step === 4 && created && (
          <div className="bg-white border-2 border-tt-green rounded-2xl p-8 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto text-tt-green mb-3" />
            <h2 className="text-2xl font-bold text-tt-navy">Item registered!</h2>
            <p className="text-slate-600 mt-1">Your TraceTag Asset ID:</p>
            <div className="text-2xl font-mono font-bold text-tt-navy my-3 bg-slate-50 inline-block px-4 py-2 rounded-lg">{created.vivesa_asset_id}</div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button onClick={() => downloadCertificate({
                ownerName: user?.email ?? 'Owner', assetId: created.vivesa_asset_id,
                itemName: created.item_name, brand: created.brand, model: created.model,
                serial: created.serial_number, identifier: created.imei_1 ?? created.plate_number ?? created.vin ?? created.serial_number,
                registeredAt: created.created_at,
              })} className="bg-tt-navy text-white flex-1">Download certificate</Button>
              <Button variant="outline" onClick={() => downloadQR(created.vivesa_asset_id)} className="flex-1">Download QR code</Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="ghost" onClick={() => { setStep(1); setCategory(''); setForm({ item_name: '', purchase_date: '', purchase_price: '', purchase_location: '' }); setCreated(null); }} className="flex-1">Register another</Button>
              <Button variant="ghost" onClick={() => nav('/tracetag/app/items')} className="flex-1">View my items</Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

const Row = ({ k, v }: { k: string; v: any }) => (
  <div className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
    <span className="text-slate-500">{k}</span><span className="font-medium">{String(v)}</span>
  </div>
);
