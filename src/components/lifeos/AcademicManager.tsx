import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseData } from './shared/useSupabaseData';
import { Plus, Trash2, BookOpen, Calendar } from 'lucide-react';

export default function AcademicManager() {
  const { data: courses, insert, update, remove, isLoading } = useSupabaseData<any>('courses');
  const [newCourse, setNewCourse] = useState('');
  const [newExamDate, setNewExamDate] = useState('');

  const addCourse = async () => {
    if (!newCourse.trim()) return;
    await insert({
      name: newCourse,
      weekly_progress: Array(12).fill(false),
      exam_date: newExamDate || null,
      revision_notes: '',
      past_questions: [],
      study_hours: 0,
    });
    setNewCourse('');
    setNewExamDate('');
  };

  const toggleWeek = async (course: any, weekIdx: number) => {
    const wp = Array.isArray(course.weekly_progress) ? [...course.weekly_progress] : Array(12).fill(false);
    wp[weekIdx] = !wp[weekIdx];
    await update({ id: course.id, weekly_progress: wp });
  };

  const updateNotes = async (id: string, revision_notes: string) => {
    await update({ id, revision_notes });
  };

  const addStudyHour = async (course: any) => {
    await update({ id: course.id, study_hours: Number(course.study_hours) + 1 });
  };

  const daysUntilExam = (date?: string | null) => {
    if (!date) return null;
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Academic Manager</h1>
        <p className="text-muted-foreground mt-1">Track your 6 courses across 12 weeks</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <Input placeholder="Course name" value={newCourse} onChange={e => setNewCourse(e.target.value)} className="flex-1" />
            <Input type="date" value={newExamDate} onChange={e => setNewExamDate(e.target.value)} className="w-40" />
            <Button onClick={addCourse} size="sm"><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </div>
        </CardContent>
      </Card>

      {courses.length === 0 ? (
        <Card className="bg-card border-border"><CardContent className="py-8 text-center text-muted-foreground">No courses added yet.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {courses.map((course: any) => {
            const wp = Array.isArray(course.weekly_progress) ? course.weekly_progress : Array(12).fill(false);
            const completed = wp.filter(Boolean).length;
            const progress = (completed / 12) * 100;
            const days = daysUntilExam(course.exam_date);

            return (
              <Card key={course.id} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      {course.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {days !== null && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-md ${days <= 7 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                          <Calendar className="h-3 w-3 inline mr-1" />{days}d to exam
                        </span>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => remove(course.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="weeks">
                    <TabsList className="mb-3">
                      <TabsTrigger value="weeks">Weeks</TabsTrigger>
                      <TabsTrigger value="revision">Revision</TabsTrigger>
                      <TabsTrigger value="study">Study Log</TabsTrigger>
                    </TabsList>
                    <TabsContent value="weeks">
                      <div className="mb-2">
                        <Progress value={progress} className="h-2" />
                        <span className="text-xs text-muted-foreground">{completed}/12 weeks completed</span>
                      </div>
                      <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                        {wp.map((done: boolean, i: number) => (
                          <button key={i} onClick={() => toggleWeek(course, i)}
                            className={`h-10 rounded-md text-xs font-medium border transition-colors ${done ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary/50'}`}>
                            W{i + 1}
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="revision">
                      <Textarea placeholder="Revision notes..." value={course.revision_notes} onChange={e => updateNotes(course.id, e.target.value)} className="min-h-[100px]" />
                    </TabsContent>
                    <TabsContent value="study">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-foreground">{course.study_hours}h</span>
                        <Button size="sm" onClick={() => addStudyHour(course)}>+1 Hour</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
