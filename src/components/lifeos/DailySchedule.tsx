import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from './shared/useSupabaseData';
import { TIME_BLOCKS } from './shared/types';
import { Plus, Sun, CloudSun, Sunset, Moon, Stars, Clock, Trash2 } from 'lucide-react';

const BLOCK_ICONS: Record<string, any> = { morning: Sun, midday: CloudSun, afternoon: Sunset, evening: Moon, night: Stars };

const PRIORITY_BG: Record<string, string> = {
  critical: 'bg-destructive/10 border-destructive/30',
  important: 'bg-primary/10 border-primary/30',
  optional: 'bg-muted border-border',
};

export default function DailySchedule() {
  const today = new Date().toISOString().split('T')[0];
  const { data: tasks, insert, update, remove, isLoading } = useSupabaseData<any>('tasks');
  const [newTask, setNewTask] = useState({ title: '', block: 'morning', priority: 'important', deadline: today, minutes: '' });

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    await insert({
      title: newTask.title, time_block: newTask.block, priority: newTask.priority,
      deadline: newTask.deadline, estimated_minutes: newTask.minutes ? parseInt(newTask.minutes) : null,
      progress_percent: 0, completed: false, category: 'daily',
    });
    setNewTask({ title: '', block: 'morning', priority: 'important', deadline: today, minutes: '' });
  };

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Daily Schedule</h1>
        <p className="text-muted-foreground mt-1">Plan your day in time blocks</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="pt-4 space-y-2">
          <div className="flex gap-2 flex-wrap">
            <Input placeholder="Task..." value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} className="flex-1 min-w-[150px]" />
            <Select value={newTask.block} onValueChange={v => setNewTask(p => ({ ...p, block: v }))}>
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIME_BLOCKS.map(b => <SelectItem key={b.key} value={b.key}>{b.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={newTask.priority} onValueChange={v => setNewTask(p => ({ ...p, priority: v }))}>
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['critical', 'important', 'optional'].map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Min" value={newTask.minutes} onChange={e => setNewTask(p => ({ ...p, minutes: e.target.value }))} className="w-20" />
            <Button size="sm" onClick={addTask}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {TIME_BLOCKS.map(block => {
        const Icon = BLOCK_ICONS[block.key];
        const blockTasks = tasks.filter((t: any) => t.time_block === block.key);
        return (
          <Card key={block.key} className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground text-sm flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                {block.label}
                <span className="text-xs text-muted-foreground font-normal">{block.time}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {blockTasks.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No tasks scheduled.</p>
              ) : (
                <div className="space-y-2">
                  {blockTasks.map((task: any) => (
                    <div key={task.id} className={`flex items-center gap-3 p-3 rounded-lg border ${PRIORITY_BG[task.priority] || ''} ${task.completed ? 'opacity-60' : ''}`}>
                      <Checkbox checked={task.completed} onCheckedChange={() => update({ id: task.id, completed: !task.completed })} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</span>
                          <Badge variant="outline" className="text-[10px] capitalize">{task.priority}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          {task.deadline && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />{new Date(task.deadline).toLocaleDateString()}
                            </span>
                          )}
                          {task.estimated_minutes && <span className="text-xs text-muted-foreground">{task.estimated_minutes}min</span>}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => remove(task.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
