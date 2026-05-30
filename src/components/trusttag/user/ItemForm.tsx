import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { useTTAuth } from '@/components/trusttag/shared/useTTAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ITEM_CATEGORIES } from '@/components/trusttag/shared/types';
import { toast } from 'sonner';

function Inner() {
  const { user } = useTTAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', category: 'Phone', brand: '', model: '', serial_number: '', purchase_date: '', description: '' });
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      let photos: string[] = [];
      if (photo) {
        const path = `${user.id}/${nanoid()}-${photo.name}`;
        const { error: upErr } = await supabase.storage.from('trusttag-items').upload(path, photo);
        if (!upErr) {
          const { data } = supabase.storage.from('trusttag-items').getPublicUrl(path);
          photos = [data.publicUrl];
        }
      }
      const { data: item, error } = await supabase.from('tt_items').insert({
        owner_id: user.id, ...form, purchase_date: form.purchase_date || null, photos,
      }).select().single();
      if (error) throw error;
      // generate QR
      const token = nanoid(24);
      await supabase.from('tt_qr_codes').insert({ item_id: item.id, token });
      // ownership history
      await supabase.from('tt_ownership_history').insert({ item_id: item.id, to_user: user.id, reason: 'initial registration' });
      toast.success('Item registered with QR code');
      nav(`/trusttag/app/items/${item.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-bold text-2xl md:text-3xl mb-6">Register an Item</h1>
      <form onSubmit={submit} className="tt-glass rounded-2xl p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Item name *</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Category *</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ITEM_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label htmlFor="brand">Brand</Label><Input id="brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
          <div><Label htmlFor="model">Model</Label><Input id="model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
          <div><Label htmlFor="sn">Serial Number</Label><Input id="sn" value={form.serial_number} onChange={(e) => setForm({ ...form, serial_number: e.target.value })} /></div>
          <div><Label htmlFor="pd">Purchase Date</Label><Input id="pd" type="date" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} /></div>
        </div>
        <div><Label htmlFor="desc">Description</Label><Textarea id="desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div><Label htmlFor="photo">Photo</Label><Input id="photo" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} /></div>
        <Button disabled={loading} className="bg-tt-primary hover:bg-tt-primary/90 text-white w-full">{loading ? 'Registering…' : 'Register & Generate QR'}</Button>
      </form>
    </div>
  );
}

export default function ItemForm() { return <AuthGate><TTLayout><Inner /></TTLayout></AuthGate>; }
