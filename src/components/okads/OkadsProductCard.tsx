import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OkadsProduct } from './shared/types';
import { useCart } from './shared/useCart';
import { useToast } from '@/hooks/use-toast';

interface Props {
  product: OkadsProduct;
}

export default function OkadsProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product, 1);
    toast({ title: 'Added to cart!', description: `${product.name} × 1` });
  };

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <Link
      to={`/okads/product/${product.slug}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-teal-100"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-6xl">🐟</span>
        )}

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}

        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">Out of Stock</span>
          </div>
        )}

        {product.featured && (
          <span className="absolute top-3 right-3 bg-teal-500 text-white p-1.5 rounded-full">
            <Star className="w-3 h-3 fill-current" />
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-[#134E4A] group-hover:text-[#0D9488] transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500">{product.weight_unit}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-[#0D9488]">
              ₦{product.price.toLocaleString()}
            </span>
            {product.compare_price && (
              <span className="text-sm text-gray-400 line-through ml-2">
                ₦{product.compare_price.toLocaleString()}
              </span>
            )}
          </div>

          {product.in_stock && (
            <Button
              size="icon"
              onClick={handleAdd}
              className="bg-[#0D9488] hover:bg-[#134E4A] text-white rounded-full w-9 h-9"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}
