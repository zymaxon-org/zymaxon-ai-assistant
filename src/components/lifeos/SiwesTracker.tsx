import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseData } from './shared/useSupabaseData';
import { ProgressCard } from './shared/ProgressCard';
import { BookOpen, FileText, Presentation, Shield } from 'lucide-react';
import { useEffect } from 'react';

const SIWES_DEFAULTS = [
  { title: 'Logbook Completion', type: 'logbook', progress_percent: 0, notes: '' },
  { title: 'Report Writing', type: 'report', progress_percent: 0, notes: '' },
  { title: 'Presentation Slides', type: 'slides', progress_percent: 0, notes: '' },
  { title: 'Defence Preparation', type: 'defence', progress_percent: 0, notes: '' },
];

const ICONS: Record<string, any> = { logbook: BookOpen, report: FileText, slides: Presentation, defence: Shield };

export default function SiwesTracker() {
  const { data: items, insert, update, isLoading } = useSupabaseData<any>('siwes_items');

  useEffect(() => {
    if (!isLoading && items.length === 0) {
      SIWES_DEFAULTS.forEach(item => insert(item));
    }
  }, [isLoading, items.length]);

  const overall = items.length > 0 ? items.reduce((s: number, i: any) => s + i.progress_percent, 0) / items.length : 0;

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">SIWES Tracker</h1>
        <p className="text-muted-foreground mt-1">Track your industrial training deliverables</p>
      </div>

      <ProgressCard title="Overall SIWES Progress" progress={overall} />

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item: any) => {
          const Icon = ICONS[item.type] || FileText;
          return (
            <Card key={item.id} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-sm flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Slider value={[item.progress_percent]} onValueChange={([val]) => update({ id: item.id, progress_percent: val })} max={100} step={5} className="flex-1" />
                  <span className="text-sm font-bold text-foreground w-10 text-right">{item.progress_percent}%</span>
                </div>
                <Textarea placeholder="Notes..." value={item.notes} onChange={e => update({ id: item.id, notes: e.target.value })} className="min-h-[60px] text-sm" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
