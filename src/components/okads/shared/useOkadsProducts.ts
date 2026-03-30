import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { OkadsProduct, OkadsCategory } from './types';

export function useOkadsCategories() {
  return useQuery({
    queryKey: ['okads', 'categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okads_categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as unknown as OkadsCategory[];
    },
  });
}

export function useOkadsProducts(options?: { categorySlug?: string; featured?: boolean; search?: string }) {
  return useQuery({
    queryKey: ['okads', 'products', options],
    queryFn: async () => {
      let query = supabase
        .from('okads_products')
        .select('*, okads_categories(*)');

      if (options?.featured) {
        query = query.eq('featured', true);
      }
      if (options?.categorySlug) {
        // Filter via category slug join
        query = query.eq('okads_categories.slug', options.categorySlug);
      }
      if (options?.search) {
        query = query.ilike('name', `%${options.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      let results = data as unknown as OkadsProduct[];
      // If filtering by category slug, remove products without matching category
      if (options?.categorySlug) {
        results = results.filter(p => p.okads_categories?.slug === options.categorySlug);
      }
      return results;
    },
  });
}

export function useOkadsProduct(slug: string) {
  return useQuery({
    queryKey: ['okads', 'product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okads_products')
        .select('*, okads_categories(*)')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data as unknown as OkadsProduct;
    },
    enabled: !!slug,
  });
}
