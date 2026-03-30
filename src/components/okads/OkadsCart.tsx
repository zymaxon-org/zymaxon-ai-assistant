import { Link } from 'react-router-dom';
import { useCart } from './shared/useCart';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OkadsCart() {
  const { cartItems, subtotal, updateQuantity, clearCart } = useCart();
  const deliveryFee = 2000;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-teal-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#134E4A] mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some fresh seafood to get started!</p>
        <Link to="/okads/shop">
          <Button className="bg-[#0D9488] hover:bg-[#134E4A] text-white gap-2">
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#134E4A]">Your Cart ({cartItems.length})</h2>
        <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear All</button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.product_id} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-teal-50">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center shrink-0 overflow-hidden">
                {item.product?.image_url ? (
                  <img src={item.product.image_url} alt={item.product?.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">🐟</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#134E4A] truncate">{item.product?.name || 'Product'}</h3>
                <p className="text-sm text-gray-500">{item.product?.weight_unit}</p>
                <p className="text-[#0D9488] font-bold mt-1">₦{(item.product?.price ?? 0).toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  {item.quantity === 1 ? <Trash2 className="w-4 h-4 text-red-400" /> : <Minus className="w-4 h-4" />}
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right font-bold text-[#134E4A] w-24">
                ₦{((item.product?.price ?? 0) * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-teal-50 h-fit sticky top-24 space-y-4">
          <h3 className="font-bold text-[#134E4A] text-lg">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery (Abuja)</span>
              <span className="font-medium">₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold text-[#134E4A]">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
          </div>

          <Link to="/okads/checkout">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2">
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link to="/okads/shop" className="block text-center text-sm text-[#0D9488] hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
