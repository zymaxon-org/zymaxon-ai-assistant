import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from './shared/useLocalStorage';
import { GrowthItem } from './shared/types';
import { Plus, Trash2, BookOpen, Heart, PenLine, Church } from 'lucide-react';

const ICONS = { bible: BookOpen, sermon: Church, book: Heart, writing: PenLine };

export default function PersonalGrowth() {
  const [items, setItems] = useLocalStorage<GrowthItem[]>('lifeos-growth', []);
  const [newTitle, setNewTitle] = useState('');
  const [activeTab, setActiveTab] = useState<GrowthItem['type']>('bible');

  const add = () => {
    if (!newTitle.trim()) return;
    setItems(prev => [...prev, { id: crypto.randomUUID(), type: activeTab, title: newTitle, progressPercent: 0, notes: '' }]);
    setNewTitle('');
  };

  const update = (id: string, field: Partial<GrowthItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...field } : i));
  };

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const filtered = items.filter(i => i.type === activeTab);

  const labels = { bible: 'Bible Study', sermon: 'Sermons', book: 'Spiritual Books', writing: 'Writing' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Personal Growth</h1>
        <p className="text-muted-foreground mt-1">Spiritual life, reading, and writing</p>
      </div>

      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as GrowthItem['type'])}>
        <TabsList>
          {(Object.keys(labels) as GrowthItem['type'][]).map(k => (
            <TabsTrigger key={k} value={k}>{labels[k]}</TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(labels) as GrowthItem['type'][]).map(type => (
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
              filtered.map(item => {
                const Icon = ICONS[item.type];
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
                        <Slider value={[item.progressPercent]} onValueChange={([v]) => update(item.id, { progressPercent: v })} max={100} step={5} className="flex-1" />
                        <span className="text-sm font-bold text-foreground w-10 text-right">{item.progressPercent}%</span>
                      </div>
                      <Textarea placeholder="Notes..." value={item.notes} onChange={e => update(item.id, { notes: e.target.value })} className="min-h-[50px] text-sm" />
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
