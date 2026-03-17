import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabaseData } from './shared/useSupabaseData';
import { Plus, Trash2, BookOpen, Heart, PenLine, Church } from 'lucide-react';

const ICONS: Record<string, any> = { bible: BookOpen, sermon: Church, book: Heart, writing: PenLine };
const labels: Record<string, string> = { bible: 'Bible Study', sermon: 'Sermons', book: 'Spiritual Books', writing: 'Writing' };

export default function PersonalGrowth() {
  const { data: items, insert, update, remove, isLoading } = useSupabaseData<any>('growth_items');
  const [newTitle, setNewTitle] = useState('');
  const [activeTab, setActiveTab] = useState('bible');

  const add = async () => {
    if (!newTitle.trim()) return;
    await insert({ type: activeTab, title: newTitle, progress_percent: 0, notes: '' });
    setNewTitle('');
  };

  const filtered = items.filter((i: any) => i.type === activeTab);

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Personal Growth</h1>
        <p className="text-muted-foreground mt-1">Spiritual life, reading, and writing</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {Object.keys(labels).map(k => (
            <TabsTrigger key={k} value={k}>{labels[k]}</TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(labels).map(type => (
          <TabsContent key={type} value={type} className="space-y-4 mt-4">
            <Card className="bg-card border-border">
              <CardContent className="pt-4">
                <div className="flex gap-2">
                  <Input placeholder={`Add ${labels[type]}...`} value={newTitle} onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
                  <Button size="sm" onClick={add}><Plus className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>

            {filtered.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">No items yet.</p>
            ) : (
              filtered.map((item: any) => {
                const Icon = ICONS[item.type] || BookOpen;
                return (
                  <Card key={item.id} className="bg-card border-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-foreground flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" /> {item.title}
                        </CardTitle>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(item.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Slider value={[item.progress_percent]} onValueChange={([v]) => update({ id: item.id, progress_percent: v })} max={100} step={5} className="flex-1" />
                        <span className="text-sm font-bold text-foreground w-10 text-right">{item.progress_percent}%</span>
                      </div>
                      <Textarea placeholder="Notes..." value={item.notes} onChange={e => update({ id: item.id, notes: e.target.value })} className="min-h-[50px] text-sm" />
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
