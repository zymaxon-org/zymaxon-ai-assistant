import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';

type TableName = 
  | 'tasks' | 'courses' | 'siwes_items' | 'fyp_sections'
  | 'learning_tools' | 'job_applications' | 'skill_courses' | 'growth_items'
  | 'expenses' | 'savings_goals' | 'wishlist_items'
  | 'forex_trades' | 'forex_classes' | 'social_posts' | 'social_metrics'
  | 'special_projects' | 'habits' | 'weekly_reviews';

export function useSupabaseData<T extends Record<string, any>>(
  table: TableName,
  options?: { orderBy?: string; orderAsc?: boolean }
) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const queryKey = ['lifeos', table, user?.id];

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase.from(table).select('*');
      if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: options.orderAsc ?? true });
      } else {
        query = query.order('created_at', { ascending: true });
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as T[];
    },
    enabled: !!user,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const insertMutation = useMutation({
    mutationFn: async (row: Partial<T>) => {
      const { error } = await supabase.from(table).insert({ ...row, user_id: user!.id } as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<T>) => {
      const { error } = await supabase.from(table).update(updates as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const upsertMutation = useMutation({
    mutationFn: async (row: Partial<T> & { id?: string }) => {
      const { error } = await supabase.from(table).upsert({ ...row, user_id: user!.id } as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  return {
    data: data as T[],
    isLoading,
    insert: insertMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    upsert: upsertMutation.mutateAsync,
    invalidate,
  };
}
