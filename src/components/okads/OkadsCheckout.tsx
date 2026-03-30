import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './shared/useCart';
import { useOkadsAuth } from './shared/useOkadsAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function OkadsCheckout() {
  const { cartItems, subtotal, clearCart, userId } = useCart();
  const { user } = useOkadsAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: 'Abuja',
    state: 'FCT',
  });

  const deliveryFee = 2000;
  const total = subtotal + deliveryFee;

  if (!user) {
    navigate('/okads/auth?redirect=/okads/checkout');
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/okads/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.phone || !form.address) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // Upsert customer profile
      await supabase.from('okads_customers').upsert({
        user_id: user.id,
        ...form,
      } as any, { onConflict: 'user_id' });

      // Create order
      const orderNumber = `OKD-${Date.now().toString(36).toUpperCase()}`;
      const { data: order, error: orderError } = await supabase
        .from('okads_orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total,
          delivery_fee: deliveryFee,
          delivery_address: `${form.address}, ${form.city}, ${form.state}`,
          status: 'pending',
        } as any)
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const items = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product?.name || '',
        quantity: item.quantity,
        unit_price: item.product?.price || 0,
      }));

      await supabase.from('okads_order_items').insert(items as any);

      // Clear cart
      await clearCart();

      toast({
        title: '✅ Order placed!',
        description: `Order ${orderNumber} created. We'll contact you for payment.`,
      });

      navigate('/okads/orders');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#134E4A] mb-8">Checkout</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-teal-50 space-y-4">
          <h3 className="font-bold text-[#134E4A]">Delivery Details</h3>

          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+234..." required />
          </div>

          <div className="space-y-2">
            <Label>Delivery Address</Label>
            <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Street address, area..." required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-teal-50 space-y-3">
          <h3 className="font-bold text-[#134E4A]">Order Summary</h3>
          {cartItems.map(item => (
            <div key={item.product_id} className="flex justify-between text-sm">
              <span>{item.product?.name} × {item.quantity}</span>
              <span>₦{((item.product?.price ?? 0) * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between text-sm">
            <span>Delivery</span>
            <span>₦{deliveryFee.toLocaleString()}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg text-[#134E4A]">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Place Order — ₦${total.toLocaleString()}`}
        </Button>

        <p className="text-xs text-center text-gray-400">
          Payment will be arranged via WhatsApp/call after order confirmation.
        </p>
      </form>
    </div>
  );
}
