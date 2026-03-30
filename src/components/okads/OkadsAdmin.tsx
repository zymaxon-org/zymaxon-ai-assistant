import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOkadsAuth } from './shared/useOkadsAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, Edit, Package, ShieldCheck } from 'lucide-react';

export default function OkadsAdmin() {
  const { user, loading: authLoading } = useOkadsAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin
  const { data: isAdmin, isLoading: adminLoading } = useQuery({
    queryKey: ['okads', 'isAdmin', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('okads_admin_users').select('id').eq('user_id', user!.id).maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!authLoading && !user) navigate('/okads/auth?redirect=/okads/admin');
  }, [user, authLoading]);

  // Products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['okads', 'admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('okads_products').select('*, okads_categories(name)').order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: isAdmin === true,
  });

  // Orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['okads', 'admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('okads_orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: isAdmin === true,
  });

  // Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['okads', 'categories'],
    queryFn: async () => {
      const { data } = await supabase.from('okads_categories').select('*').order('sort_order');
      return data || [];
    },
    enabled: isAdmin === true,
  });

  const [newProduct, setNewProduct] = useState({
    name: '', slug: '', description: '', price: '', compare_price: '', category_id: '', weight_unit: 'per kg', featured: false,
  });

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast({ title: 'Name and price required', variant: 'destructive' });
      return;
    }
    const slug = newProduct.slug || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { error } = await supabase.from('okads_products').insert({
      name: newProduct.name,
      slug,
      description: newProduct.description,
      price: Number(newProduct.price),
      compare_price: newProduct.compare_price ? Number(newProduct.compare_price) : null,
      category_id: newProduct.category_id || null,
      weight_unit: newProduct.weight_unit,
      featured: newProduct.featured,
    } as any);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Product added!' });
    setNewProduct({ name: '', slug: '', description: '', price: '', compare_price: '', category_id: '', weight_unit: 'per kg', featured: false });
    queryClient.invalidateQueries({ queryKey: ['okads', 'admin-products'] });
  };

  const deleteProduct = async (id: string) => {
    await supabase.from('okads_products').delete().eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['okads', 'admin-products'] });
    toast({ title: 'Product deleted' });
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('okads_orders').update({ status } as any).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['okads', 'admin-orders'] });
    toast({ title: `Order updated to ${status}` });
  };

  if (authLoading || adminLoading) {
    return <div className="max-w-5xl mx-auto px-4 py-8"><Skeleton className="h-40 rounded-xl" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <ShieldCheck className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#134E4A] mb-2">Access Denied</h2>
        <p className="text-gray-500">You are not authorized to access the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#134E4A] mb-6">Admin Dashboard</h2>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6 mt-6">
          {/* Add product form */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-teal-50 space-y-4">
            <h3 className="font-bold text-[#134E4A] flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Name*</Label>
                <Input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} placeholder="Catfish Whole" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Price (₦)*</Label>
                <Input type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} placeholder="5000" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Compare Price</Label>
                <Input type="number" value={newProduct.compare_price} onChange={e => setNewProduct(p => ({ ...p, compare_price: e.target.value }))} placeholder="Optional" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <select value={newProduct.category_id} onChange={e => setNewProduct(p => ({ ...p, category_id: e.target.value }))} className="w-full border rounded-md px-3 py-2 text-sm">
                  <option value="">Select category</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Weight Unit</Label>
                <Input value={newProduct.weight_unit} onChange={e => setNewProduct(p => ({ ...p, weight_unit: e.target.value }))} />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Description</Label>
                <Input value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} placeholder="Product description..." />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={newProduct.featured} onChange={e => setNewProduct(p => ({ ...p, featured: e.target.checked }))} />
                Featured product
              </label>
              <Button onClick={addProduct} className="bg-[#0D9488] hover:bg-[#134E4A] text-white">Add Product</Button>
            </div>
          </div>

          {/* Product list */}
          <div className="space-y-2">
            {products.map((p: any) => (
              <div key={p.id} className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm border border-teal-50">
                <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center text-2xl shrink-0">🐟</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#134E4A] truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.okads_categories?.name || 'No category'} · {p.weight_unit}</p>
                </div>
                <span className="font-bold text-[#0D9488]">₦{Number(p.price).toLocaleString()}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {p.in_stock ? 'In Stock' : 'Out'}
                </span>
                <button onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4 mt-6">
          {orders.length === 0 ? (
            <p className="text-center py-12 text-gray-400">No orders yet</p>
          ) : (
            orders.map((o: any) => (
              <div key={o.id} className="bg-white rounded-xl p-5 shadow-sm border border-teal-50">
                <div className="flex items-center gap-4">
                  <Package className="w-6 h-6 text-[#0D9488]" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#134E4A]">{o.order_number}</p>
                    <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString('en-NG')}</p>
                    <p className="text-xs text-gray-400 mt-1">{o.delivery_address}</p>
                  </div>
                  <p className="font-bold text-[#0D9488]">₦{Number(o.total).toLocaleString()}</p>
                  <select
                    value={o.status}
                    onChange={e => updateOrderStatus(o.id, e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
