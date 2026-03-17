import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useSupabaseData } from './shared/useSupabaseData';
import { Plus, Trash2, Wallet, PiggyBank, Star } from 'lucide-react';

export default function Finance() {
  const { data: expenses, insert: insertExpense, remove: removeExpense, isLoading: le } = useSupabaseData<any>('expenses');
  const { data: savings, insert: insertSaving, update: updateSaving, isLoading: ls } = useSupabaseData<any>('savings_goals');
  const { data: wishlist, insert: insertWish, update: updateWish, remove: removeWish, isLoading: lw } = useSupabaseData<any>('wishlist_items');
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: '' });
  const [newSaving, setNewSaving] = useState({ title: '', target: '' });
  const [newWish, setNewWish] = useState({ title: '', cost: '' });

  const addExpense = async () => {
    if (!newExpense.description || !newExpense.amount) return;
    await insertExpense({
      description: newExpense.description, amount: parseFloat(newExpense.amount),
      category: newExpense.category || 'General', date: new Date().toISOString().split('T')[0],
    });
    setNewExpense({ description: '', amount: '', category: '' });
  };

  const addSaving = async () => {
    if (!newSaving.title || !newSaving.target) return;
    await insertSaving({ title: newSaving.title, target_amount: parseFloat(newSaving.target), current_amount: 0 });
    setNewSaving({ title: '', target: '' });
  };

  const addToSaving = async (s: any, amount: number) => {
    await updateSaving({ id: s.id, current_amount: Math.min(Number(s.target_amount), Number(s.current_amount) + amount) });
  };

  const addWish = async () => {
    if (!newWish.title) return;
    await insertWish({ title: newWish.title, estimated_cost: parseFloat(newWish.cost) || 0, purchased: false });
    setNewWish({ title: '', cost: '' });
  };

  const total = expenses.reduce((s: number, e: any) => s + Number(e.amount), 0);

  if (le || ls || lw) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Finance</h1>
        <p className="text-muted-foreground mt-1">Track expenses, savings, and wishlist in ₦</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Expenses:</span>
            <span className="text-2xl font-bold text-foreground">₦{total.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="expenses">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4 mt-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="flex gap-2 flex-wrap">
                <Input placeholder="Description" value={newExpense.description} onChange={e => setNewExpense(p => ({ ...p, description: e.target.value }))} className="flex-1 min-w-[120px]" />
                <Input type="number" placeholder="Amount (₦)" value={newExpense.amount} onChange={e => setNewExpense(p => ({ ...p, amount: e.target.value }))} className="w-32" />
                <Input placeholder="Category" value={newExpense.category} onChange={e => setNewExpense(p => ({ ...p, category: e.target.value }))} className="w-28" />
                <Button size="sm" onClick={addExpense}><Plus className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-2">
            {expenses.map((e: any) => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                <div>
                  <span className="text-sm font-medium text-foreground">{e.description}</span>
                  <span className="text-xs text-muted-foreground ml-2">{e.category} · {e.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">₦{Number(e.amount).toLocaleString()}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeExpense(e.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="savings" className="space-y-4 mt-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="flex gap-2">
                <Input placeholder="Goal name" value={newSaving.title} onChange={e => setNewSaving(p => ({ ...p, title: e.target.value }))} className="flex-1" />
                <Input type="number" placeholder="Target (₦)" value={newSaving.target} onChange={e => setNewSaving(p => ({ ...p, target: e.target.value }))} className="w-32" />
                <Button size="sm" onClick={addSaving}><Plus className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
          {savings.map((s: any) => (
            <Card key={s.id} className="bg-card border-border">
              <CardContent className="pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground flex items-center gap-2"><PiggyBank className="h-4 w-4 text-primary" />{s.title}</span>
                  <span className="text-sm text-muted-foreground">₦{Number(s.current_amount).toLocaleString()} / ₦{Number(s.target_amount).toLocaleString()}</span>
                </div>
                <Progress value={Number(s.target_amount) > 0 ? (Number(s.current_amount) / Number(s.target_amount)) * 100 : 0} className="h-2" />
                <div className="flex gap-1">
                  {[500, 1000, 5000].map(amt => (
                    <Button key={amt} size="sm" variant="outline" className="text-xs h-7" onClick={() => addToSaving(s, amt)}>+₦{amt.toLocaleString()}</Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-4 mt-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="flex gap-2">
                <Input placeholder="Item" value={newWish.title} onChange={e => setNewWish(p => ({ ...p, title: e.target.value }))} className="flex-1" />
                <Input type="number" placeholder="Est. cost (₦)" value={newWish.cost} onChange={e => setNewWish(p => ({ ...p, cost: e.target.value }))} className="w-32" />
                <Button size="sm" onClick={addWish}><Plus className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
          {wishlist.map((w: any) => (
            <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2">
                <Star className={`h-4 w-4 ${w.purchased ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm ${w.purchased ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{w.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">₦{Number(w.estimated_cost).toLocaleString()}</span>
                <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => updateWish({ id: w.id, purchased: !w.purchased })}>
                  {w.purchased ? 'Undo' : 'Bought'}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeWish(w.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
