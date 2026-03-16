import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from './shared/useLocalStorage';
import { Course } from './shared/types';
import { Plus, Trash2, BookOpen, Calendar } from 'lucide-react';

export default function AcademicManager() {
  const [courses, setCourses] = useLocalStorage<Course[]>('lifeos-courses', []);
  const [newCourse, setNewCourse] = useState('');
  const [newExamDate, setNewExamDate] = useState('');

  const addCourse = () => {
    if (!newCourse.trim()) return;
    setCourses(prev => [...prev, {
      id: crypto.randomUUID(),
      name: newCourse,
      weeklyProgress: Array(12).fill(false),
      examDate: newExamDate || undefined,
      revisionNotes: '',
      pastQuestions: [],
      studyHours: 0,
    }]);
    setNewCourse('');
    setNewExamDate('');
  };

  const toggleWeek = (courseId: string, weekIdx: number) => {
    setCourses(prev => prev.map(c =>
      c.id === courseId ? { ...c, weeklyProgress: c.weeklyProgress.map((v, i) => i === weekIdx ? !v : v) } : c
    ));
  };

  const deleteCourse = (id: string) => setCourses(prev => prev.filter(c => c.id !== id));

  const updateNotes = (id: string, notes: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, revisionNotes: notes } : c));
  };

  const addStudyHour = (id: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, studyHours: c.studyHours + 1 } : c));
  };

  const daysUntilExam = (date?: string) => {
    if (!date) return null;
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

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
        <Card className="bg-card border-border"><CardContent className="py-8 text-center text-muted-foreground">No courses added yet. Add up to 6 courses above.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {courses.map(course => {
            const completed = course.weeklyProgress.filter(Boolean).length;
            const progress = (completed / 12) * 100;
            const days = daysUntilExam(course.examDate);

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
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {days}d to exam
                        </span>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => deleteCourse(course.id)}>
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
                        {course.weeklyProgress.map((done, i) => (
                          <button
                            key={i}
                            onClick={() => toggleWeek(course.id, i)}
                            className={`h-10 rounded-md text-xs font-medium border transition-colors ${
                              done ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary/50'
                            }`}
                          >
                            W{i + 1}
                          </button>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="revision">
                      <Textarea
                        placeholder="Revision notes & past questions..."
                        value={course.revisionNotes}
                        onChange={e => updateNotes(course.id, e.target.value)}
                        className="min-h-[100px]"
                      />
                    </TabsContent>

                    <TabsContent value="study">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-foreground">{course.studyHours}h</span>
                        <Button size="sm" onClick={() => addStudyHour(course.id)}>+1 Hour</Button>
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
