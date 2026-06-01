import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { PublicHeader, PublicFooter } from '@/components/tracetag/shared/Layout';
import { useDocTitle } from '@/components/tracetag/shared/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SELLER_PLATFORMS } from '@/components/tracetag/shared/types';
import { toast } from '@/hooks/use-toast';

export default function TipPage() {
  useDocTitle('Submit anonymous tip — TraceTag');
  const [params] = useSearchParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    item_id: params.get('item') || '',
    search_query: params.get('q') || '',
    seller_platform: '', seller_location: '', seller_contact: '', tip_description: '',
  });
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.from('tt_tips').insert(form as any);
    setSaving(false);
    if (error) { toast({ title: 'Failed', description: error.message, variant: 'destructive' }); return; }
    setDone(true);
  };

  return (
    <div className="tracetag bg-slate-50 min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 max-w-xl mx-auto px-4 py-10 w-full">
        <Link to="/tracetag/search" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-tt-navy mb-3"><ArrowLeft className="h-4 w-4" />Back</Link>
        {done ? (
          <div className="bg-white border-2 border-tt-green rounded-2xl p-8 text-center">
            <ShieldCheck className="h-14 w-14 mx-auto text-tt-green mb-3" />
            <h2 className="text-xl font-bold">Thank you</h2>
            <p className="text-sm text-slate-600 mt-2">Your tip has been submitted. The item owner and our team have been notified.</p>
            <Button onClick={() => nav('/tracetag/search')} className="mt-4 bg-tt-navy text-white">Check another item</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white border border-tt-border rounded-2xl p-6 space-y-3">
            <h1 className="text-xl font-bold text-tt-navy">Submit anonymous tip</h1>
            <p className="text-xs text-slate-500">Your identity is not shared. Help return this item to its owner.</p>
            <div><Label>Item searched</Label><Input value={form.search_query} disabled /></div>
            <div><Label>Where are you seeing this item being sold? *</Label>
              <Select value={form.seller_platform} onValueChange={v => setForm({...form, seller_platform: v})}>
                <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                <SelectContent>{SELLER_PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Seller's location / address *</Label><Input required value={form.seller_location} onChange={e => setForm({...form, seller_location: e.target.value})} /></div>
            <div><Label>Seller's contact (phone, social handle — optional)</Label><Input value={form.seller_contact} onChange={e => setForm({...form, seller_contact: e.target.value})} /></div>
            <div><Label>What did you see? *</Label><Textarea required rows={4} value={form.tip_description} onChange={e => setForm({...form, tip_description: e.target.value})} /></div>
            <Button type="submit" disabled={saving} className="w-full bg-tt-navy text-white">{saving ? 'Submitting…' : 'Submit tip'}</Button>
          </form>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
