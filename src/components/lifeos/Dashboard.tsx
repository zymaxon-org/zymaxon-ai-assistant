import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseData } from './shared/useSupabaseData';
import { BookOpen, Briefcase, Wallet, Target, Clock, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const { data: tasks, isLoading: loadingTasks } = useSupabaseData<any>('tasks');
  const { data: habits, isLoading: loadingHabits } = useSupabaseData<any>('habits');
  const { data: expenses, isLoading: loadingExpenses } = useSupabaseData<any>('expenses');
  const { data: jobs, isLoading: loadingJobs } = useSupabaseData<any>('job_applications');

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t: any) => t.deadline === today || !t.deadline);
  const completedToday = todayTasks.filter((t: any) => t.completed).length;
  const totalExpenses = expenses.reduce((s: number, e: any) => s + Number(e.amount), 0);
  const activeHabits = habits.filter((h: any) => {
    const dates = Array.isArray(h.completed_dates) ? h.completed_dates : [];
    return dates.includes(today);
  }).length;

  const upcomingDeadlines = tasks
    .filter((t: any) => t.deadline && !t.completed && new Date(t.deadline) >= new Date())
    .sort((a: any, b: any) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const isLoading = loadingTasks || loadingHabits || loadingExpenses || loadingJobs;

  if (isLoading) return <div className="text-muted-foreground">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Tasks Today</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{completedToday}/{todayTasks.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Habits Today</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{activeHabits}/{habits.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Spent</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₦{totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Job Apps</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{jobs.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" /> Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
            ) : (
              <div className="space-y-2">
                {upcomingDeadlines.map((t: any) => (
                  <div key={t.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                    <span className="text-sm text-foreground">{t.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(t.deadline).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Add data across sections to see stats here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
