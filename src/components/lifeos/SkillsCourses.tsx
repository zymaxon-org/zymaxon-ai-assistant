import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useLocalStorage } from './shared/useLocalStorage';
import { SkillCourse } from './shared/types';
import { Plus, Trash2, Code2, Calendar } from 'lucide-react';

const DEFAULTS: SkillCourse[] = [
  { id: '1', name: 'Linux', lessons: [], notes: '' },
  { id: '2', name: 'Kubernetes', deadline: '2025-05-12', lessons: [], notes: '' },
];

export default function SkillsCourses() {
  const [courses, setCourses] = useLocalStorage<SkillCourse[]>('lifeos-skills', DEFAULTS);
  const [newLesson, setNewLesson] = useState<Record<string, string>>({});

  const addLesson = (courseId: string) => {
    const title = newLesson[courseId]?.trim();
    if (!title) return;
    setCourses(prev => prev.map(c =>
      c.id === courseId ? { ...c, lessons: [...c.lessons, { id: crypto.randomUUID(), title, completed: false }] } : c
    ));
    setNewLesson(p => ({ ...p, [courseId]: '' }));
  };

  const toggleLesson = (courseId: string, lessonId: string) => {
    setCourses(prev => prev.map(c =>
      c.id === courseId ? { ...c, lessons: c.lessons.map(l => l.id === lessonId ? { ...l, completed: !l.completed } : l) } : c
    ));
  };

  const deleteLesson = (courseId: string, lessonId: string) => {
    setCourses(prev => prev.map(c =>
      c.id === courseId ? { ...c, lessons: c.lessons.filter(l => l.id !== lessonId) } : c
    ));
  };

  const updateNotes = (courseId: string, notes: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, notes } : c));
  };

  const addCourse = () => {
    setCourses(prev => [...prev, { id: crypto.randomUUID(), name: 'New Course', lessons: [], notes: '' }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Skills & Courses</h1>
          <p className="text-muted-foreground mt-1">Track your learning with lesson checklists</p>
        </div>
        <Button onClick={addCourse} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Course</Button>
      </div>

      <div className="space-y-4">
        {courses.map(course => {
          const done = course.lessons.filter(l => l.completed).length;
          const total = course.lessons.length;
          const pct = total > 0 ? (done / total) * 100 : 0;

          return (
            <Card key={course.id} className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground text-sm flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-primary" /> {course.name}
                  </CardTitle>
                  {course.deadline && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {course.deadline}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {total > 0 && (
                  <div>
                    <Progress value={pct} className="h-2 mb-1" />
                    <span className="text-xs text-muted-foreground">{done}/{total} lessons</span>
                  </div>
                )}
                <div className="space-y-1">
                  {course.lessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/50">
                      <Checkbox checked={lesson.completed} onCheckedChange={() => toggleLesson(course.id, lesson.id)} />
                      <span className={`text-sm flex-1 ${lesson.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{lesson.title}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteLesson(course.id, lesson.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add lesson..."
                    value={newLesson[course.id] || ''}
                    onChange={e => setNewLesson(p => ({ ...p, [course.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addLesson(course.id)}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={() => addLesson(course.id)}>Add</Button>
                </div>
                <Textarea placeholder="Notes..." value={course.notes} onChange={e => updateNotes(course.id, e.target.value)} className="min-h-[50px] text-sm" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
