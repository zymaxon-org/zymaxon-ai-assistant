import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocalStorage } from './shared/useLocalStorage';
import { ForexTrade, ForexClass } from './shared/types';
import { Plus, Trash2, TrendingUp, TrendingDown, BarChart3, BookOpen, Bot } from 'lucide-react';

export default function ForexLearning() {
  const [classes, setClasses] = useLocalStorage<ForexClass[]>('lifeos-forex-classes', []);
  const [trades, setTrades] = useLocalStorage<ForexTrade[]>('lifeos-forex-trades', []);
  const [botNotes, setBotNotes] = useLocalStorage<string>('lifeos-forex-bot', '');
  const [newClass, setNewClass] = useState('');
  const [newTrade, setNewTrade] = useState({ pair: 'EUR/USD', type: 'buy' as const, entry: '', exit: '', notes: '' });

  const addClass = () => {
    if (!newClass.trim()) return;
    setClasses(prev => [...prev, { id: crypto.randomUUID(), title: newClass, completed: false, notes: '' }]);
    setNewClass('');
  };

  const addTrade = () => {
    if (!newTrade.entry) return;
    const entry = parseFloat(newTrade.entry);
    const exit = newTrade.exit ? parseFloat(newTrade.exit) : undefined;
    const pl = exit ? (newTrade.type === 'buy' ? exit - entry : entry - exit) * 10000 : undefined;
    setTrades(prev => [...prev, {
      id: crypto.randomUUID(), pair: newTrade.pair, type: newTrade.type,
      entryPrice: entry, exitPrice: exit, profitLoss: pl,
      date: new Date().toISOString().split('T')[0], notes: newTrade.notes,
    }]);
    setNewTrade({ pair: 'EUR/USD', type: 'buy', entry: '', exit: '', notes: '' });
  };

  const totalPL = trades.reduce((s, t) => s + (t.profitLoss || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Forex Learning</h1>
        <p className="text-muted-foreground mt-1">Classes, demo trading, and bot development</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div>
              <span className="text-sm text-muted-foreground">Demo P&L (pips)</span>
              <p className={`text-2xl font-bold ${totalPL >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {totalPL >= 0 ? '+' : ''}{totalPL.toFixed(1)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="classes">
        <TabsList>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="journal">Trade Journal</TabsTrigger>
          <TabsTrigger value="bot">Bot Development</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4 mt-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="flex gap-2">
                <Input placeholder="Class topic..." value={newClass} onChange={e => setNewClass(e.target.value)} onKeyDown={e => e.key === 'Enter' && addClass()} />
                <Button size="sm" onClick={addClass}><Plus className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
          {classes.map(c => (
            <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
              <Checkbox checked={c.completed} onCheckedChange={() => setClasses(prev => prev.map(x => x.id === c.id ? { ...x, completed: !x.completed } : x))} />
              <span className={`text-sm flex-1 ${c.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                <BookOpen className="h-3.5 w-3.5 inline mr-1" />{c.title}
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setClasses(prev => prev.filter(x => x.id !== c.id))}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="journal" className="space-y-4 mt-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-4 space-y-2">
              <div className="flex gap-2 flex-wrap">
                <Input placeholder="Pair" value={newTrade.pair} onChange={e => setNewTrade(p => ({ ...p, pair: e.target.value }))} className="w-28" />
                <Select value={newTrade.type} onValueChange={v => setNewTrade(p => ({ ...p, type: v as 'buy' | 'sell' }))}>
                  <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="Entry" value={newTrade.entry} onChange={e => setNewTrade(p => ({ ...p, entry: e.target.value }))} className="w-28" />
                <Input type="number" placeholder="Exit" value={newTrade.exit} onChange={e => setNewTrade(p => ({ ...p, exit: e.target.value }))} className="w-28" />
                <Button size="sm" onClick={addTrade}><Plus className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
          {trades.map(t => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2">
                {t.type === 'buy' ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                <span className="font-medium text-foreground">{t.pair}</span>
                <Badge variant="outline" className="text-xs capitalize">{t.type}</Badge>
                <span className="text-xs text-muted-foreground">{t.date}</span>
              </div>
              <div className="flex items-center gap-2">
                {t.profitLoss !== undefined && (
                  <span className={`font-bold text-sm ${t.profitLoss >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {t.profitLoss >= 0 ? '+' : ''}{t.profitLoss.toFixed(1)} pips
                  </span>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setTrades(prev => prev.filter(x => x.id !== t.id))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="bot" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm text-foreground flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" /> Bot Development Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={botNotes} onChange={e => setBotNotes(e.target.value)} placeholder="Track your forex bot development progress..." className="min-h-[200px]" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
