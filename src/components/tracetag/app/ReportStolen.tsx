import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { AppLayout } from '@/components/tracetag/shared/Layout';
import { useAuth, useDocTitle } from '@/components/tracetag/shared/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { NIGERIAN_STATES, CIRCUMSTANCES } from '@/components/tracetag/shared/types';
import { toast } from '@/hooks/use-toast';

export default function ReportStolen() {
  useDocTitle('Report stolen — TraceTag');
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState<any>({
    date_stolen: '', time_stolen: '', state_stolen: '', lga_stolen: '', location_stolen: '',
    circumstance: 'Armed robbery', additional_description: '',
    police_report_number: '', police_station: '', police_state: '',
    reward_offered: false, reward_amount: 0,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('This will immediately flag your item as STOLEN. Anyone who searches will see it as stolen. Continue?')) return;
    if (!user || !id) return;
    setSaving(true);
    const { error } = await supabase.from('tt_stolen_reports').insert({ ...form, item_id: id, reported_by: user.id });
    if (!error) await supabase.from('tt_items').update({ status: 'stolen' }).eq('id', id);
    setSaving(false);
    if (error) { toast({ title: 'Failed', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Item flagged as stolen', description: 'Anyone searching this item will now see it as stolen.' });
    nav(`/tracetag/app/items/${id}`);
  };

  return (
    <AppLayout>
      <Link to={`/tracetag/app/items/${id}`} className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-tt-navy mb-3">
        <ArrowLeft className="h-4 w-4" /> Back to item
      </Link>
      <form onSubmit={submit} className="bg-white border-2 border-tt-red rounded-2xl p-6 max-w-2xl space-y-3">
        <div className="flex items-center gap-2 text-tt-red mb-2">
          <AlertTriangle className="h-6 w-6" />
          <h1 className="text-xl font-bold">Report stolen</h1>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Date stolen *</Label><Input type="date" required value={form.date_stolen} onChange={e => setForm({...form, date_stolen: e.target.value})} /></div>
          <div><Label>Time</Label><Input value={form.time_stolen} onChange={e => setForm({...form, time_stolen: e.target.value})} placeholder="approx. 9pm" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>State *</Label>
            <Select value={form.state_stolen} onValueChange={v => setForm({...form, state_stolen: v})}>
              <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>{NIGERIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>LGA</Label><Input value={form.lga_stolen} onChange={e => setForm({...form, lga_stolen: e.target.value})} /></div>
        </div>
        <div><Label>Exact location</Label><Input value={form.location_stolen} onChange={e => setForm({...form, location_stolen: e.target.value})} /></div>
        <div><Label>How was it stolen *</Label>
          <Select value={form.circumstance} onValueChange={v => setForm({...form, circumstance: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CIRCUMSTANCES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Description</Label><Textarea value={form.additional_description} onChange={e => setForm({...form, additional_description: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Police report #</Label><Input value={form.police_report_number} onChange={e => setForm({...form, police_report_number: e.target.value})} /></div>
          <div><Label>Police station</Label><Input value={form.police_station} onChange={e => setForm({...form, police_station: e.target.value})} /></div>
        </div>
        <label className="flex items-center gap-2 text-sm pt-2">
          <input type="checkbox" checked={form.reward_offered} onChange={e => setForm({...form, reward_offered: e.target.checked})} />
          I'm offering a reward
        </label>
        {form.reward_offered && (
          <div><Label>Reward amount (₦)</Label><Input type="number" value={form.reward_amount} onChange={e => setForm({...form, reward_amount: Number(e.target.value)})} /></div>
        )}
        <Button type="submit" disabled={saving} className="w-full bg-tt-red hover:bg-tt-red/90 text-white mt-3">
          {saving ? 'Flagging…' : 'Flag as STOLEN'}
        </Button>
      </form>
    </AppLayout>
  );
}
