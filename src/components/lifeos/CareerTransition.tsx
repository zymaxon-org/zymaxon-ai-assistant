import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from './shared/useLocalStorage';
import { LearningTool, JobApplication } from './shared/types';
import { Plus, Trash2, Briefcase, BookOpen } from 'lucide-react';

const DEFAULT_TOOLS: LearningTool[] = [
  { id: '1', name: 'Excel', lessonsCompleted: 0, totalLessons: 30, notes: '' },
  { id: '2', name: 'SQL', lessonsCompleted: 0, totalLessons: 40, notes: '' },
  { id: '3', name: 'Power BI', lessonsCompleted: 0, totalLessons: 25, notes: '' },
  { id: '4', name: 'Python', lessonsCompleted: 0, totalLessons: 50, notes: '' },
];

const STATUS_COLORS: Record<string, string> = {
  applied: 'bg-primary/10 text-primary',
  interview: 'bg-accent text-accent-foreground',
  offer: 'bg-primary/20 text-primary',
  rejected: 'bg-destructive/10 text-destructive',
  pending: 'bg-muted text-muted-foreground',
};

export default function CareerTransition() {
  const [tools, setTools] = useLocalStorage<LearningTool[]>('lifeos-career-tools', DEFAULT_TOOLS);
  const [jobs, setJobs] = useLocalStorage<JobApplication[]>('lifeos-jobs', []);
  const [newJob, setNewJob] = useState({ company: '', role: '', platform: 'Indeed' });

  const updateTool = (id: string, inc: number) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, lessonsCompleted: Math.max(0, Math.min(t.totalLessons, t.lessonsCompleted + inc)) } : t));
  };

  const addJob = () => {
    if (!newJob.company.trim() || !newJob.role.trim()) return;
    setJobs(prev => [...prev, {
      id: crypto.randomUUID(),
      ...newJob,
      status: 'applied',
      dateApplied: new Date().toISOString().split('T')[0],
      notes: '',
    }]);
    setNewJob({ company: '', role: '', platform: 'Indeed' });
  };

  const updateJobStatus = (id: string, status: JobApplication['status']) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
  };

  const deleteJob = (id: string) => setJobs(prev => prev.filter(j => j.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Data Analysis Career</h1>
        <p className="text-muted-foreground mt-1">Track your learning path and job applications</p>
      </div>

      <Tabs defaultValue="learning">
        <TabsList>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="jobs">Job Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="learning" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {tools.map(tool => {
              const pct = (tool.lessonsCompleted / tool.totalLessons) * 100;
              return (
                <Card key={tool.id} className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-foreground flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" /> {tool.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={pct} className="h-2 mb-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{tool.lessonsCompleted}/{tool.totalLessons} lessons</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => updateTool(tool.id, -1)}>-1</Button>
                        <Button size="sm" className="h-6 text-xs" onClick={() => updateTool(tool.id, 1)}>+1</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4 mt-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="flex gap-2 flex-wrap">
                <Input placeholder="Company" value={newJob.company} onChange={e => setNewJob(p => ({ ...p, company: e.target.value }))} className="flex-1 min-w-[120px]" />
                <Input placeholder="Role" value={newJob.role} onChange={e => setNewJob(p => ({ ...p, role: e.target.value }))} className="flex-1 min-w-[120px]" />
                <Button onClick={addJob} size="sm"><Plus className="h-4 w-4 mr-1" /> Add</Button>
              </div>
            </CardContent>
          </Card>

          {jobs.length === 0 ? (
            <Card className="bg-card border-border"><CardContent className="py-8 text-center text-muted-foreground">No applications yet.</CardContent></Card>
          ) : (
            <div className="space-y-2">
              {jobs.map(job => (
                <Card key={job.id} className="bg-card border-border">
                  <CardContent className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">{job.company}</span>
                          <span className="text-sm text-muted-foreground">— {job.role}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{job.dateApplied} · {job.platform}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={job.status} onValueChange={(v) => updateJobStatus(job.id, v as JobApplication['status'])}>
                          <SelectTrigger className="w-28 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['applied', 'interview', 'offer', 'rejected', 'pending'].map(s => (
                              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteJob(job.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
