import { Link } from 'react-router-dom';
import { useOkadsCategories } from './shared/useOkadsProducts';
import { Skeleton } from '@/components/ui/skeleton';

const categoryEmojis: Record<string, string> = {
  'fresh-fish': '🐟',
  'seafood-delights': '🦐',
  'frozen-food': '🧊',
  'dry-foodstuffs': '🌶️',
  'wholesale-combos': '📦',
};

const categoryColors: Record<string, string> = {
  'fresh-fish': 'from-blue-400 to-blue-600',
  'seafood-delights': 'from-pink-400 to-red-500',
  'frozen-food': 'from-cyan-400 to-blue-500',
  'dry-foodstuffs': 'from-amber-400 to-orange-500',
  'wholesale-combos': 'from-emerald-400 to-teal-600',
};

export default function OkadsCategories() {
  const { data: categories, isLoading } = useOkadsCategories();

  return (
    <section className="py-16 bg-[#F0FDFA]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#134E4A]">Shop by Category</h2>
          <p className="text-[#0D9488] mt-2">Find exactly what you need for your next meal</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))
            : categories?.map(cat => (
                <Link
                  key={cat.id}
                  to={`/okads/shop/${cat.slug}`}
                  className="group text-center"
                >
                  <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${categoryColors[cat.slug] || 'from-teal-400 to-teal-600'} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {categoryEmojis[cat.slug] || '🐠'}
                  </div>
                  <h3 className="mt-3 font-semibold text-[#134E4A] group-hover:text-[#0D9488] transition-colors text-sm md:text-base">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#0D9488]/70 mt-1 hidden md:block">{cat.description}</p>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
