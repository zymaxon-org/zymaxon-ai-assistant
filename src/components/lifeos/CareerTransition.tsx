import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from './shared/useSupabaseData';
import { Plus, Trash2, Briefcase, BookOpen } from 'lucide-react';

const DEFAULT_TOOLS = [
  { name: 'Excel', lessons_completed: 0, total_lessons: 30, notes: '' },
  { name: 'SQL', lessons_completed: 0, total_lessons: 40, notes: '' },
  { name: 'Power BI', lessons_completed: 0, total_lessons: 25, notes: '' },
  { name: 'Python', lessons_completed: 0, total_lessons: 50, notes: '' },
];

const STATUS_COLORS: Record<string, string> = {
  applied: 'bg-primary/10 text-primary',
  interview: 'bg-accent text-accent-foreground',
  offer: 'bg-primary/20 text-primary',
  rejected: 'bg-destructive/10 text-destructive',
  pending: 'bg-muted text-muted-foreground',
};

export default function CareerTransition() {
  const { data: tools, insert: insertTool, update: updateTool, isLoading: loadingTools } = useSupabaseData<any>('learning_tools');
  const { data: jobs, insert: insertJob, update: updateJob, remove: removeJob, isLoading: loadingJobs } = useSupabaseData<any>('job_applications');
  const [newJob, setNewJob] = useState({ company: '', role: '', platform: 'Indeed' });

  useEffect(() => {
    if (!loadingTools && tools.length === 0) {
      DEFAULT_TOOLS.forEach(t => insertTool(t));
    }
  }, [loadingTools, tools.length]);

  const updateToolProgress = async (id: string, inc: number, tool: any) => {
    const val = Math.max(0, Math.min(tool.total_lessons, tool.lessons_completed + inc));
    await updateTool({ id, lessons_completed: val });
  };

  const addJob = async () => {
    if (!newJob.company.trim() || !newJob.role.trim()) return;
    await insertJob({
      company: newJob.company, role: newJob.role, platform: newJob.platform,
      status: 'applied', date_applied: new Date().toISOString().split('T')[0], notes: '',
    });
    setNewJob({ company: '', role: '', platform: 'Indeed' });
  };

  if (loadingTools || loadingJobs) return <div className="text-muted-foreground">Loading...</div>;

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
            {tools.map((tool: any) => {
              const pct = tool.total_lessons > 0 ? (tool.lessons_completed / tool.total_lessons) * 100 : 0;
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
                      <span className="text-xs text-muted-foreground">{tool.lessons_completed}/{tool.total_lessons} lessons</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => updateToolProgress(tool.id, -1, tool)}>-1</Button>
                        <Button size="sm" className="h-6 text-xs" onClick={() => updateToolProgress(tool.id, 1, tool)}>+1</Button>
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
              {jobs.map((job: any) => (
                <Card key={job.id} className="bg-card border-border">
                  <CardContent className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">{job.company}</span>
                          <span className="text-sm text-muted-foreground">— {job.role}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{job.date_applied} · {job.platform}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={job.status} onValueChange={(v) => updateJob({ id: job.id, status: v })}>
                          <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {['applied', 'interview', 'offer', 'rejected', 'pending'].map(s => (
                              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeJob(job.id)}>
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
