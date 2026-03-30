import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOkadsProducts } from './shared/useOkadsProducts';
import { Skeleton } from '@/components/ui/skeleton';
import OkadsProductCard from './OkadsProductCard';

export default function OkadsFeaturedProducts() {
  const { data: products, isLoading } = useOkadsProducts({ featured: true });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#134E4A]">🔥 Hot Deals</h2>
            <p className="text-[#0D9488] mt-1">Our most popular products this week</p>
          </div>
          <Link to="/okads/shop">
            <Button variant="outline" className="border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488] hover:text-white gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))
            : products?.slice(0, 8).map(p => (
                <OkadsProductCard key={p.id} product={p} />
              ))}
        </div>
      </div>
    </section>
  );
}
