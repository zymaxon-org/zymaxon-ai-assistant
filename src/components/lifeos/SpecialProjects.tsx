import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useLocalStorage } from './shared/useLocalStorage';
import { SpecialProject, Task } from './shared/types';
import { TaskItem } from './shared/TaskItem';
import { Plus, Trash2, Rocket } from 'lucide-react';

export default function SpecialProjects() {
  const [projects, setProjects] = useLocalStorage<SpecialProject[]>('lifeos-special', [
    { id: '1', title: '72-Hour Coding Challenge', description: 'Build something awesome in 72 hours', progressPercent: 0, tasks: [] },
    { id: '2', title: 'Website Security Experiments', description: 'Learn and practice web security', progressPercent: 0, tasks: [] },
  ]);
  const [newProject, setNewProject] = useState('');
  const [newTask, setNewTask] = useState<Record<string, string>>({});

  const addProject = () => {
    if (!newProject.trim()) return;
    setProjects(prev => [...prev, { id: crypto.randomUUID(), title: newProject, description: '', progressPercent: 0, tasks: [] }]);
    setNewProject('');
  };

  const update = (id: string, field: Partial<SpecialProject>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...field } : p));
  };

  const addTaskToProject = (projectId: string) => {
    const title = newTask[projectId]?.trim();
    if (!title) return;
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p, tasks: [...p.tasks, { id: crypto.randomUUID(), title, priority: 'important', progressPercent: 0, completed: false }]
    } : p));
    setNewTask(prev => ({ ...prev, [projectId]: '' }));
  };

  const toggleTask = (projectId: string, taskId: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    } : p));
  };

  const deleteTask = (projectId: string, taskId: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p, tasks: p.tasks.filter(t => t.id !== taskId)
    } : p));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Special Projects</h1>
          <p className="text-muted-foreground mt-1">Personal experiments and challenges</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="New project..." value={newProject} onChange={e => setNewProject(e.target.value)} className="w-48" />
          <Button size="sm" onClick={addProject}><Plus className="h-4 w-4" /></Button>
        </div>
      </div>

      {projects.map(project => (
        <Card key={project.id} className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground flex items-center gap-2">
                <Rocket className="h-4 w-4 text-primary" /> {project.title}
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setProjects(prev => prev.filter(p => p.id !== project.id))}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea placeholder="Description..." value={project.description} onChange={e => update(project.id, { description: e.target.value })} className="min-h-[50px] text-sm" />
            <div className="flex items-center gap-3">
              <Slider value={[project.progressPercent]} onValueChange={([v]) => update(project.id, { progressPercent: v })} max={100} step={5} className="flex-1" />
              <span className="text-sm font-bold text-foreground w-10 text-right">{project.progressPercent}%</span>
            </div>

            <div className="space-y-2">
              {project.tasks.map(task => (
                <TaskItem key={task.id} task={task} onToggle={(id) => toggleTask(project.id, id)} onDelete={(id) => deleteTask(project.id, id)} />
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add task..."
                value={newTask[project.id] || ''}
                onChange={e => setNewTask(p => ({ ...p, [project.id]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addTaskToProject(project.id)}
                className="text-sm"
              />
              <Button size="sm" onClick={() => addTaskToProject(project.id)}>Add</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
