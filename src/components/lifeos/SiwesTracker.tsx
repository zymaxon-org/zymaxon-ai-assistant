import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from './shared/useLocalStorage';
import { SiwesItem } from './shared/types';
import { ProgressCard } from './shared/ProgressCard';
import { BookOpen, FileText, Presentation, Shield } from 'lucide-react';

const SIWES_DEFAULTS: SiwesItem[] = [
  { id: '1', title: 'Logbook Completion', type: 'logbook', progressPercent: 0, notes: '' },
  { id: '2', title: 'Report Writing', type: 'report', progressPercent: 0, notes: '' },
  { id: '3', title: 'Presentation Slides', type: 'slides', progressPercent: 0, notes: '' },
  { id: '4', title: 'Defence Preparation', type: 'defence', progressPercent: 0, notes: '' },
];

const ICONS = { logbook: BookOpen, report: FileText, slides: Presentation, defence: Shield };

export default function SiwesTracker() {
  const [items, setItems] = useLocalStorage<SiwesItem[]>('lifeos-siwes', SIWES_DEFAULTS);

  const updateProgress = (id: string, val: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, progressPercent: val } : i));
  };

  const updateNotes = (id: string, notes: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, notes } : i));
  };

  const overall = items.reduce((s, i) => s + i.progressPercent, 0) / items.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">SIWES Tracker</h1>
        <p className="text-muted-foreground mt-1">Track your industrial training deliverables</p>
      </div>

      <ProgressCard title="Overall SIWES Progress" progress={overall} />

      <div className="grid md:grid-cols-2 gap-4">
        {items.map(item => {
          const Icon = ICONS[item.type];
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
                  <Slider
                    value={[item.progressPercent]}
                    onValueChange={([val]) => updateProgress(item.id, val)}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm font-bold text-foreground w-10 text-right">{item.progressPercent}%</span>
                </div>
                <Textarea
                  placeholder="Notes..."
                  value={item.notes}
                  onChange={e => updateNotes(item.id, e.target.value)}
                  className="min-h-[60px] text-sm"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
