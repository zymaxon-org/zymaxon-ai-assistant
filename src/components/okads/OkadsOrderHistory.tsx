import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOkadsAuth } from './shared/useOkadsAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Clock, CheckCircle2, Truck } from 'lucide-react';

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: 'text-yellow-500', label: 'Pending' },
  processing: { icon: Package, color: 'text-blue-500', label: 'Processing' },
  delivered: { icon: CheckCircle2, color: 'text-green-500', label: 'Delivered' },
  cancelled: { icon: Clock, color: 'text-red-500', label: 'Cancelled' },
};

export default function OkadsOrderHistory() {
  const { user, loading: authLoading } = useOkadsAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate('/okads/auth?redirect=/okads/orders');
  }, [user, authLoading]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['okads', 'orders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okads_orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user,
  });

  if (authLoading || isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#134E4A] mb-8">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Truck className="w-16 h-16 text-teal-200 mx-auto mb-4" />
          <p className="text-gray-500">No orders yet. Start shopping!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const cfg = statusConfig[order.status] || statusConfig.pending;
            const Icon = cfg.icon;
            return (
              <div key={order.id} className="bg-white rounded-xl p-5 shadow-sm border border-teal-50 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${cfg.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#134E4A]">{order.order_number}</p>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#0D9488]">₦{Number(order.total).toLocaleString()}</p>
                  <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
