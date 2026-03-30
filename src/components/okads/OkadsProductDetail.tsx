import { useParams, Link } from 'react-router-dom';
import { useOkadsProduct } from './shared/useOkadsProducts';
import { useCart } from './shared/useCart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export default function OkadsProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading } = useOkadsProduct(slug || '');
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🐠</p>
        <p className="text-lg text-gray-500">Product not found.</p>
        <Link to="/okads/shop" className="text-[#0D9488] hover:underline mt-4 inline-block">← Back to Shop</Link>
      </div>
    );
  }

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAdd = async () => {
    await addToCart(product, qty);
    toast({ title: 'Added to cart!', description: `${product.name} × ${qty}` });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/okads/shop" className="inline-flex items-center gap-2 text-[#0D9488] hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-8xl">🐟</span>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {product.okads_categories && (
            <span className="text-sm bg-teal-100 text-[#0D9488] px-3 py-1 rounded-full">
              {product.okads_categories.name}
            </span>
          )}

          <h1 className="text-3xl font-bold text-[#134E4A]">{product.name}</h1>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#0D9488]">₦{product.price.toLocaleString()}</span>
            {product.compare_price && (
              <>
                <span className="text-xl text-gray-400 line-through">₦{product.compare_price.toLocaleString()}</span>
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">-{discount}%</span>
              </>
            )}
          </div>

          <p className="text-sm text-gray-500">Sold: {product.weight_unit}</p>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {product.in_stock ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#134E4A]">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-gray-100">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-gray-100">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <Button onClick={handleAdd} size="lg" className="w-full bg-[#0D9488] hover:bg-[#134E4A] text-white gap-2 font-bold">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart — ₦{(product.price * qty).toLocaleString()}
              </Button>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 font-medium">
              Currently out of stock
            </div>
          )}

          <div className="bg-teal-50 rounded-lg p-4 space-y-2 text-sm text-[#134E4A]">
            <p>🚚 Next day delivery in Abuja — ₦2,000</p>
            <p>💳 Secure online payment via Paystack</p>
            <p>📞 Questions? Call +234 701 436 6630</p>
          </div>
        </div>
      </div>
    </div>
  );
}
