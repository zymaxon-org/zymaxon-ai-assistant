import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { OkadsProduct, LocalCartItem } from './types';

const LOCAL_CART_KEY = 'okads_cart';

function getLocalCart(): LocalCartItem[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || '[]');
  } catch { return []; }
}

function setLocalCart(items: LocalCartItem[]) {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

export function useCart() {
  const [userId, setUserId] = useState<string | null>(null);
  const [localCart, setLocalCartState] = useState<LocalCartItem[]>(getLocalCart());
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user?.id ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Supabase cart for logged-in users
  const { data: dbCart = [], isLoading } = useQuery({
    queryKey: ['okads', 'cart', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okads_cart_items')
        .select('*, okads_products(*, okads_categories(*))')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!userId,
  });

  const invalidateCart = () => queryClient.invalidateQueries({ queryKey: ['okads', 'cart', userId] });

  const addToCart = useCallback(async (product: OkadsProduct, quantity = 1) => {
    if (userId) {
      const existing = dbCart.find((c: any) => c.product_id === product.id);
      if (existing) {
        await supabase.from('okads_cart_items').update({ quantity: existing.quantity + quantity }).eq('id', existing.id);
      } else {
        await supabase.from('okads_cart_items').insert({ user_id: userId, product_id: product.id, quantity });
      }
      invalidateCart();
    } else {
      const items = getLocalCart();
      const idx = items.findIndex(i => i.product_id === product.id);
      if (idx >= 0) {
        items[idx].quantity += quantity;
      } else {
        items.push({ product_id: product.id, quantity, product });
      }
      setLocalCart(items);
      setLocalCartState(items);
    }
  }, [userId, dbCart]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (userId) {
      if (quantity <= 0) {
        await supabase.from('okads_cart_items').delete().eq('product_id', productId).eq('user_id', userId);
      } else {
        await supabase.from('okads_cart_items').update({ quantity }).eq('product_id', productId).eq('user_id', userId);
      }
      invalidateCart();
    } else {
      let items = getLocalCart();
      if (quantity <= 0) {
        items = items.filter(i => i.product_id !== productId);
      } else {
        const idx = items.findIndex(i => i.product_id === productId);
        if (idx >= 0) items[idx].quantity = quantity;
      }
      setLocalCart(items);
      setLocalCartState(items);
    }
  }, [userId]);

  const clearCart = useCallback(async () => {
    if (userId) {
      await supabase.from('okads_cart_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      invalidateCart();
    } else {
      setLocalCart([]);
      setLocalCartState([]);
    }
  }, [userId]);

  // Normalize cart items
  const cartItems = userId
    ? dbCart.map((c: any) => ({
        product_id: c.product_id,
        quantity: c.quantity,
        product: c.okads_products as OkadsProduct,
      }))
    : localCart;

  const totalItems = cartItems.reduce((sum: number, i: LocalCartItem) => sum + i.quantity, 0);
  const subtotal = cartItems.reduce((sum: number, i: LocalCartItem) => sum + (i.product?.price ?? 0) * i.quantity, 0);

  return { cartItems, totalItems, subtotal, addToCart, updateQuantity, clearCart, isLoading, userId };
}
