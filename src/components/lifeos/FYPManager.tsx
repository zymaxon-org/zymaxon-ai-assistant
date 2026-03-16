import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from './shared/useLocalStorage';
import { FYPSection } from './shared/types';
import { ProgressCard } from './shared/ProgressCard';
import { FileText, Presentation, BookOpen, Shield } from 'lucide-react';

const FYP_DEFAULTS: FYPSection[] = [
  { id: '1', title: 'Chapter 1 - Introduction', progressPercent: 0, notes: '' },
  { id: '2', title: 'Chapter 2 - Literature Review', progressPercent: 0, notes: '' },
  { id: '3', title: 'Chapter 3 - Methodology', progressPercent: 0, notes: '' },
  { id: '4', title: 'Slides', progressPercent: 0, notes: '' },
  { id: '5', title: 'Report', progressPercent: 0, notes: '' },
  { id: '6', title: 'Defence', progressPercent: 0, notes: '' },
];

const ICONS = [FileText, BookOpen, FileText, Presentation, FileText, Shield];

export default function FYPManager() {
  const [sections, setSections] = useLocalStorage<FYPSection[]>('lifeos-fyp', FYP_DEFAULTS);

  const update = (id: string, field: Partial<FYPSection>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...field } : s));
  };

  const overall = sections.reduce((s, i) => s + i.progressPercent, 0) / sections.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Final Year Project</h1>
        <p className="text-muted-foreground mt-1">Track chapters, slides, report and defence</p>
      </div>

      <ProgressCard title="Overall FYP Progress" progress={overall} />

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((section, idx) => {
          const Icon = ICONS[idx];
          return (
            <Card key={section.id} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-sm flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Slider value={[section.progressPercent]} onValueChange={([v]) => update(section.id, { progressPercent: v })} max={100} step={5} className="flex-1" />
                  <span className="text-sm font-bold text-foreground w-10 text-right">{section.progressPercent}%</span>
                </div>
                <Input type="date" value={section.deadline || ''} onChange={e => update(section.id, { deadline: e.target.value })} placeholder="Deadline" />
                <Textarea placeholder="Notes..." value={section.notes} onChange={e => update(section.id, { notes: e.target.value })} className="min-h-[60px] text-sm" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
