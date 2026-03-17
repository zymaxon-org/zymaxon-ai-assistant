import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseData } from './shared/useSupabaseData';
import { ProgressCard } from './shared/ProgressCard';
import { FileText, Presentation, BookOpen, Shield } from 'lucide-react';
import { useEffect } from 'react';

const FYP_DEFAULTS = [
  { title: 'Chapter 1 - Introduction', progress_percent: 0, notes: '' },
  { title: 'Chapter 2 - Literature Review', progress_percent: 0, notes: '' },
  { title: 'Chapter 3 - Methodology', progress_percent: 0, notes: '' },
  { title: 'Slides', progress_percent: 0, notes: '' },
  { title: 'Report', progress_percent: 0, notes: '' },
  { title: 'Defence', progress_percent: 0, notes: '' },
];

const ICONS = [FileText, BookOpen, FileText, Presentation, FileText, Shield];

export default function FYPManager() {
  const { data: sections, insert, update, isLoading } = useSupabaseData<any>('fyp_sections');

  useEffect(() => {
    if (!isLoading && sections.length === 0) {
      FYP_DEFAULTS.forEach(item => insert(item));
    }
  }, [isLoading, sections.length]);

  const overall = sections.length > 0 ? sections.reduce((s: number, i: any) => s + i.progress_percent, 0) / sections.length : 0;

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Final Year Project</h1>
        <p className="text-muted-foreground mt-1">Track chapters, slides, report and defence</p>
      </div>

      <ProgressCard title="Overall FYP Progress" progress={overall} />

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((section: any, idx: number) => {
          const Icon = ICONS[idx] || FileText;
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
                  <Slider value={[section.progress_percent]} onValueChange={([v]) => update({ id: section.id, progress_percent: v })} max={100} step={5} className="flex-1" />
                  <span className="text-sm font-bold text-foreground w-10 text-right">{section.progress_percent}%</span>
                </div>
                <Input type="date" value={section.deadline || ''} onChange={e => update({ id: section.id, deadline: e.target.value || null })} placeholder="Deadline" />
                <Textarea placeholder="Notes..." value={section.notes} onChange={e => update({ id: section.id, notes: e.target.value })} className="min-h-[60px] text-sm" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
