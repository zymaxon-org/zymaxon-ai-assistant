import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabaseData } from './shared/useSupabaseData';
import { Plus, Trash2, Instagram, Linkedin, Facebook, Share2 } from 'lucide-react';

const PLATFORMS = ['instagram', 'tiktok', 'facebook', 'linkedin'] as const;
const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  tiktok: <Share2 className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
};

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  scheduled: 'bg-primary/10 text-primary',
  published: 'bg-accent text-accent-foreground',
};

export default function SocialMediaManager() {
  const { data: posts, insert: insertPost, update: updatePost, remove: removePost, isLoading: lp } = useSupabaseData<any>('social_posts');
  const { data: metrics, insert: insertMetric, isLoading: lm } = useSupabaseData<any>('social_metrics');
  const [newPost, setNewPost] = useState({ platform: 'instagram', content: '', date: '' });
  const [newMetric, setNewMetric] = useState({ platform: 'instagram', followers: '', engagement: '' });

  const addPost = async () => {
    if (!newPost.content.trim()) return;
    await insertPost({
      platform: newPost.platform, content: newPost.content,
      scheduled_date: newPost.date || new Date().toISOString().split('T')[0],
      status: newPost.date ? 'scheduled' : 'draft',
    });
    setNewPost({ platform: 'instagram', content: '', date: '' });
  };

  const addMetric = async () => {
    if (!newMetric.followers) return;
    await insertMetric({
      platform: newMetric.platform, followers: parseInt(newMetric.followers),
      engagement: parseFloat(newMetric.engagement) || 0, date: new Date().toISOString().split('T')[0],
    });
    setNewMetric({ platform: 'instagram', followers: '', engagement: '' });
  };

  if (lp || lm) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Social Media</h1>
        <p className="text-muted-foreground mt-1">Content calendar, scheduling, and growth tracking</p>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Content Calendar</TabsTrigger>
          <TabsTrigger value="growth">Growth Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4 mt-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-4 space-y-2">
              <div className="flex gap-2 flex-wrap">
                <Select value={newPost.platform} onValueChange={v => setNewPost(p => ({ ...p, platform: v }))}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="date" value={newPost.date} onChange={e => setNewPost(p => ({ ...p, date: e.target.value }))} className="w-40" />
                <Button size="sm" onClick={addPost}><Plus className="h-4 w-4" /></Button>
              </div>
              <Textarea placeholder="Post content..." value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} className="min-h-[60px]" />
            </CardContent>
          </Card>

          {posts.map((post: any) => (
            <Card key={post.id} className="bg-card border-border">
              <CardContent className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {PLATFORM_ICONS[post.platform]}
                      <span className="capitalize text-sm font-medium text-foreground">{post.platform}</span>
                      <Badge className={`text-[10px] ${STATUS_STYLES[post.status]}`}>{post.status}</Badge>
                      <span className="text-xs text-muted-foreground">{post.scheduled_date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{post.content}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Select value={post.status} onValueChange={v => updatePost({ id: post.id, status: v })}>
                      <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['draft', 'scheduled', 'published'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removePost(post.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="growth" className="space-y-4 mt-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="flex gap-2 flex-wrap">
                <Select value={newMetric.platform} onValueChange={v => setNewMetric(p => ({ ...p, platform: v }))}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="Followers" value={newMetric.followers} onChange={e => setNewMetric(p => ({ ...p, followers: e.target.value }))} className="w-28" />
                <Input type="number" placeholder="Engagement %" value={newMetric.engagement} onChange={e => setNewMetric(p => ({ ...p, engagement: e.target.value }))} className="w-28" />
                <Button size="sm" onClick={addMetric}><Plus className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
          {PLATFORMS.map(platform => {
            const pm = metrics.filter((m: any) => m.platform === platform);
            const latest = pm[pm.length - 1];
            return (
              <Card key={platform} className="bg-card border-border">
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {PLATFORM_ICONS[platform]}
                      <span className="capitalize font-medium text-foreground">{platform}</span>
                    </div>
                    {latest ? (
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{Number(latest.followers).toLocaleString()} followers</p>
                        <p className="text-xs text-muted-foreground">{latest.engagement}% engagement</p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No data yet</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
