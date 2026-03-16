import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from './shared/useLocalStorage';
import { Task, TIME_BLOCKS, Priority } from './shared/types';
import { TaskItem } from './shared/TaskItem';
import { Plus, CalendarDays, Sun, CloudSun, Sunset, Moon, Stars } from 'lucide-react';

const BLOCK_ICONS = { morning: Sun, midday: CloudSun, afternoon: Sunset, evening: Moon, night: Stars };

export default function DailySchedule() {
  const today = new Date().toISOString().split('T')[0];
  const [tasks, setTasks] = useLocalStorage<Task[]>('lifeos-daily-tasks', []);
  const [newTask, setNewTask] = useState({ title: '', block: 'morning' as Task['timeBlock'], priority: 'important' as Priority, deadline: today, minutes: '' });

  const addTask = () => {
    if (!newTask.title.trim()) return;
    setTasks(prev => [...prev, {
      id: crypto.randomUUID(),
      title: newTask.title,
      timeBlock: newTask.block,
      priority: newTask.priority,
      deadline: newTask.deadline,
      estimatedMinutes: newTask.minutes ? parseInt(newTask.minutes) : undefined,
      progressPercent: 0,
      completed: false,
    }]);
    setNewTask({ title: '', block: 'morning', priority: 'important', deadline: today, minutes: '' });
  };

  const toggle = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const remove = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

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
            <Select value={newTask.block} onValueChange={v => setNewTask(p => ({ ...p, block: v as Task['timeBlock'] }))}>
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIME_BLOCKS.map(b => <SelectItem key={b.key} value={b.key}>{b.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={newTask.priority} onValueChange={v => setNewTask(p => ({ ...p, priority: v as Priority }))}>
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
        const blockTasks = tasks.filter(t => t.timeBlock === block.key);
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
                  {blockTasks.map(task => (
                    <TaskItem key={task.id} task={task} onToggle={toggle} onDelete={remove} />
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
