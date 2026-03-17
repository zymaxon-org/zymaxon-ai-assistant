import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useSupabaseData } from './shared/useSupabaseData';
import { Plus, Trash2, Rocket } from 'lucide-react';

export default function SpecialProjects() {
  const { data: projects, insert, update, remove, isLoading } = useSupabaseData<any>('special_projects');
  const [newProject, setNewProject] = useState('');

  const addProject = async () => {
    if (!newProject.trim()) return;
    await insert({ title: newProject, description: '', progress_percent: 0, tasks: [] });
    setNewProject('');
  };

  const addTaskToProject = async (project: any, title: string) => {
    if (!title.trim()) return;
    const tasks = Array.isArray(project.tasks) ? project.tasks : [];
    await update({
      id: project.id,
      tasks: [...tasks, { id: crypto.randomUUID(), title, priority: 'important', progressPercent: 0, completed: false }],
    });
  };

  const toggleTask = async (project: any, taskId: string) => {
    const tasks = Array.isArray(project.tasks) ? project.tasks : [];
    await update({
      id: project.id,
      tasks: tasks.map((t: any) => t.id === taskId ? { ...t, completed: !t.completed } : t),
    });
  };

  const deleteTask = async (project: any, taskId: string) => {
    const tasks = Array.isArray(project.tasks) ? project.tasks : [];
    await update({ id: project.id, tasks: tasks.filter((t: any) => t.id !== taskId) });
  };

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>;

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

      {projects.map((project: any) => {
        const tasks = Array.isArray(project.tasks) ? project.tasks : [];
        return (
          <Card key={project.id} className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" /> {project.title}
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(project.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea placeholder="Description..." value={project.description} onChange={e => update({ id: project.id, description: e.target.value })} className="min-h-[50px] text-sm" />
              <div className="flex items-center gap-3">
                <Slider value={[project.progress_percent]} onValueChange={([v]) => update({ id: project.id, progress_percent: v })} max={100} step={5} className="flex-1" />
                <span className="text-sm font-bold text-foreground w-10 text-right">{project.progress_percent}%</span>
              </div>

              <div className="space-y-2">
                {tasks.map((task: any) => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg border bg-muted/50">
                    <input type="checkbox" checked={task.completed} onChange={() => toggleTask(project, task.id)} className="rounded" />
                    <span className={`text-sm flex-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteTask(project, task.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <TaskInput onAdd={(title) => addTaskToProject(project, title)} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function TaskInput({ onAdd }: { onAdd: (title: string) => void }) {
  const [val, setVal] = useState('');
  return (
    <div className="flex gap-2">
      <Input placeholder="Add task..." value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { onAdd(val); setVal(''); } }} className="text-sm" />
      <Button size="sm" onClick={() => { onAdd(val); setVal(''); }}>Add</Button>
    </div>
  );
}
