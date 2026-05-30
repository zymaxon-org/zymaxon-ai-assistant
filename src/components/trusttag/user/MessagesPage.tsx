import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate, TTLayout } from '@/components/trusttag/shared/TTLayout';
import { useTTAuth } from '@/components/trusttag/shared/useTTAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send } from 'lucide-react';
import { sanitizeMessage } from '@/components/trusttag/shared/sanitize';
import { toast } from 'sonner';

function Inner() {
  const { user } = useTTAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase.from('tt_chat_threads').select('*, tt_items(name)').or(`owner_id.eq.${user.id},other_user_id.eq.${user.id}`)
      .order('created_at', { ascending: false }).then(({ data }) => setThreads(data ?? []));
  }, [user]);

  useEffect(() => {
    if (!active) return;
    const load = async () => {
      const { data } = await supabase.from('tt_chat_messages').select('*').eq('thread_id', active.id).order('created_at');
      setMessages(data ?? []);
    };
    load();
    const ch = supabase.channel(`tt-thread-${active.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tt_chat_messages', filter: `thread_id=eq.${active.id}` }, (p) => {
      setMessages((m) => [...m, p.new]);
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [active]);

  const send = async () => {
    if (!draft.trim() || !active) return;
    const { sanitized, flagged } = sanitizeMessage(draft);
    if (flagged) toast.warning('Contact details were blocked from your message');
    const { error } = await supabase.from('tt_chat_messages').insert({
      thread_id: active.id, sender_id: user!.id, body: draft, sanitized_body: sanitized, flagged,
    });
    if (error) toast.error(error.message);
    setDraft('');
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl md:text-3xl">Messages</h1>
      <div className="grid md:grid-cols-3 gap-4 h-[600px]">
        <div className="tt-glass rounded-2xl p-3 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="text-center text-tt-muted p-8">
              <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : threads.map((t) => (
            <button key={t.id} onClick={() => setActive(t)} className={`w-full text-left p-3 rounded-lg ${active?.id === t.id ? 'bg-tt-primary/10' : 'hover:bg-tt-glass'}`}>
              <div className="font-medium text-sm">{t.subject || t.tt_items?.name || 'Conversation'}</div>
              <div className="text-xs text-tt-muted">{new Date(t.created_at).toLocaleDateString()}</div>
            </button>
          ))}
        </div>
        <div className="md:col-span-2 tt-glass rounded-2xl flex flex-col">
          {!active ? (
            <div className="flex-1 flex items-center justify-center text-tt-muted">Select a conversation</div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.sender_id === user?.id ? 'bg-tt-primary text-white' : 'bg-tt-glass'}`}>
                      {m.sanitized_body || m.body}
                      {m.flagged && <div className="text-xs opacity-70 mt-1">⚠ Contact details blocked</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-tt-border flex gap-2">
                <Input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type a message…" />
                <Button onClick={send} className="bg-tt-primary text-white"><Send className="h-4 w-4" /></Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() { return <AuthGate><TTLayout><Inner /></TTLayout></AuthGate>; }
