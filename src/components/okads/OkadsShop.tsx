import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useOkadsProducts, useOkadsCategories } from './shared/useOkadsProducts';
import OkadsProductCard from './OkadsProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OkadsShop() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';
  const [search, setSearch] = useState(qParam);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  const { data: categories } = useOkadsCategories();
  const { data: products, isLoading } = useOkadsProducts({
    categorySlug: category,
    search: search || undefined,
  });

  const sorted = [...(products || [])].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  const currentCategory = categories?.find(c => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0 space-y-4">
          <h3 className="font-bold text-[#134E4A] text-lg">Categories</h3>
          <div className="space-y-1">
            <Link
              to="/okads/shop"
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                !category ? 'bg-[#0D9488] text-white' : 'text-[#134E4A] hover:bg-teal-50'
              }`}
            >
              All Products
            </Link>
            {categories?.map(cat => (
              <Link
                key={cat.id}
                to={`/okads/shop/${cat.slug}`}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  category === cat.slug ? 'bg-[#0D9488] text-white' : 'text-[#134E4A] hover:bg-teal-50'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-[#134E4A]">
              {currentCategory?.name || 'All Products'}
            </h2>
            <div className="flex-1" />
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-5xl mb-4">🐠</p>
              <p className="text-lg">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map(p => (
                <OkadsProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
