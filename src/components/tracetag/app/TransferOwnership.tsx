import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowLeftRight } from 'lucide-react';
import { AppLayout } from '@/components/tracetag/shared/Layout';
import { useAuth, useDocTitle } from '@/components/tracetag/shared/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function TransferOwnership() {
  useDocTitle('Transfer ownership — TraceTag');
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ to_user_email: '', to_user_phone: '', sale_price: '', transfer_notes: '' });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    setSaving(true);
    const { error } = await supabase.from('tt_transfers').insert({
      item_id: id, from_user_id: user.id,
      to_user_email: form.to_user_email, to_user_phone: form.to_user_phone || null,
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      transfer_notes: form.transfer_notes,
      token: Math.random().toString(36).slice(2, 18),
    } as any);
    setSaving(false);
    if (error) { toast({ title: 'Failed', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Transfer request sent', description: 'The new owner will be notified.' });
    nav(`/tracetag/app/items/${id}`);
  };

  return (
    <AppLayout>
      <Link to={`/tracetag/app/items/${id}`} className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-tt-navy mb-3">
        <ArrowLeft className="h-4 w-4" /> Back to item
      </Link>
      <form onSubmit={submit} className="bg-white border border-tt-border rounded-2xl p-6 max-w-xl space-y-3">
        <div className="flex items-center gap-2 text-tt-navy mb-2"><ArrowLeftRight className="h-6 w-6" /><h1 className="text-xl font-bold">Transfer ownership</h1></div>
        <div><Label>New owner email *</Label><Input type="email" required value={form.to_user_email} onChange={e => setForm({...form, to_user_email: e.target.value})} /></div>
        <div><Label>New owner phone</Label><Input value={form.to_user_phone} onChange={e => setForm({...form, to_user_phone: e.target.value})} /></div>
        <div><Label>Sale price (₦)</Label><Input type="number" value={form.sale_price} onChange={e => setForm({...form, sale_price: e.target.value})} /></div>
        <div><Label>Notes</Label><Textarea value={form.transfer_notes} onChange={e => setForm({...form, transfer_notes: e.target.value})} /></div>
        <Button type="submit" disabled={saving} className="w-full bg-tt-navy text-white">{saving ? 'Sending…' : 'Send transfer request'}</Button>
      </form>
    </AppLayout>
  );
}
