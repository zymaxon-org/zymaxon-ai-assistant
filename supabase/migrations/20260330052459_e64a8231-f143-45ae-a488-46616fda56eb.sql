
-- Okads Seafood E-Commerce Schema

-- Admin users table (role check)
CREATE TABLE public.okads_admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.okads_admin_users ENABLE ROW LEVEL SECURITY;

-- Security definer function for admin check
CREATE OR REPLACE FUNCTION public.is_okads_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.okads_admin_users WHERE user_id = _user_id
  )
$$;

-- Categories
CREATE TABLE public.okads_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.okads_categories ENABLE ROW LEVEL SECURITY;

-- Products
CREATE TABLE public.okads_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  compare_price numeric,
  image_url text,
  category_id uuid REFERENCES public.okads_categories(id) ON DELETE SET NULL,
  weight_unit text NOT NULL DEFAULT 'per kg',
  in_stock boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.okads_products ENABLE ROW LEVEL SECURITY;

-- Customers
CREATE TABLE public.okads_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT 'Abuja',
  state text NOT NULL DEFAULT 'FCT',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.okads_customers ENABLE ROW LEVEL SECURITY;

-- Orders
CREATE TABLE public.okads_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.okads_customers(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  total numeric NOT NULL DEFAULT 0,
  delivery_fee numeric NOT NULL DEFAULT 2000,
  delivery_address text NOT NULL DEFAULT '',
  payment_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.okads_orders ENABLE ROW LEVEL SECURITY;

-- Order items
CREATE TABLE public.okads_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.okads_orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.okads_products(id) ON DELETE SET NULL,
  product_name text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.okads_order_items ENABLE ROW LEVEL SECURITY;

-- Cart items
CREATE TABLE public.okads_cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.okads_products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);
ALTER TABLE public.okads_cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Admin users: only admins can see
CREATE POLICY "Admins can read admin_users" ON public.okads_admin_users FOR SELECT TO authenticated USING (public.is_okads_admin(auth.uid()));

-- Categories: public read, admin write
CREATE POLICY "Anyone can read categories" ON public.okads_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.okads_categories FOR ALL TO authenticated USING (public.is_okads_admin(auth.uid())) WITH CHECK (public.is_okads_admin(auth.uid()));

-- Products: public read, admin write
CREATE POLICY "Anyone can read products" ON public.okads_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.okads_products FOR ALL TO authenticated USING (public.is_okads_admin(auth.uid())) WITH CHECK (public.is_okads_admin(auth.uid()));
CREATE POLICY "Anyone can read okads_products" ON public.okads_products FOR SELECT USING (true);

-- Customers: users manage own
CREATE POLICY "Users manage own customer profile" ON public.okads_customers FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Orders: users see own, admins see all
CREATE POLICY "Users see own orders" ON public.okads_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own orders" ON public.okads_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage all orders" ON public.okads_orders FOR ALL TO authenticated USING (public.is_okads_admin(auth.uid())) WITH CHECK (public.is_okads_admin(auth.uid()));

-- Order items: users see own via order, admins see all
CREATE POLICY "Users see own order items" ON public.okads_order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.okads_orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "Users create own order items" ON public.okads_order_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.okads_orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "Admins manage all order items" ON public.okads_order_items FOR ALL TO authenticated USING (public.is_okads_admin(auth.uid())) WITH CHECK (public.is_okads_admin(auth.uid()));

-- Cart items: users manage own
CREATE POLICY "Users manage own cart" ON public.okads_cart_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Updated_at triggers
CREATE TRIGGER update_okads_categories_updated_at BEFORE UPDATE ON public.okads_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_okads_products_updated_at BEFORE UPDATE ON public.okads_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_okads_customers_updated_at BEFORE UPDATE ON public.okads_customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_okads_orders_updated_at BEFORE UPDATE ON public.okads_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_okads_cart_items_updated_at BEFORE UPDATE ON public.okads_cart_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('okads-products', 'okads-products', true);

-- Storage policies
CREATE POLICY "Anyone can read okads product images" ON storage.objects FOR SELECT USING (bucket_id = 'okads-products');
CREATE POLICY "Admins can upload okads product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'okads-products' AND public.is_okads_admin(auth.uid()));
CREATE POLICY "Admins can update okads product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'okads-products' AND public.is_okads_admin(auth.uid()));
CREATE POLICY "Admins can delete okads product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'okads-products' AND public.is_okads_admin(auth.uid()));

-- Seed categories
INSERT INTO public.okads_categories (name, slug, description, sort_order) VALUES
  ('Fresh Fish', 'fresh-fish', 'Premium fresh fish sold per kilogram', 1),
  ('Seafood Delights', 'seafood-delights', 'Crabs, prawns, snails and more', 2),
  ('Frozen Food', 'frozen-food', 'Frozen cartons and packs for bulk buying', 3),
  ('Dry Foodstuffs', 'dry-foodstuffs', 'Crayfish, stockfish, dry pepper and local ingredients', 4),
  ('Wholesale & Combos', 'wholesale-combos', 'Bundle deals and wholesale pricing', 5);

-- Seed products
INSERT INTO public.okads_products (name, slug, description, price, compare_price, category_id, weight_unit, featured) VALUES
  ('Barracuda Steak', 'barracuda-steak', 'Fresh barracuda cut into premium steaks. Firm, white flesh perfect for grilling or frying.', 12000, 15000, (SELECT id FROM public.okads_categories WHERE slug='fresh-fish'), 'per kg', true),
  ('Catfish (Whole)', 'catfish-whole', 'Live or freshly killed catfish. A Nigerian kitchen staple.', 5000, NULL, (SELECT id FROM public.okads_categories WHERE slug='fresh-fish'), 'per kg', true),
  ('Tilapia', 'tilapia', 'Fresh tilapia, cleaned and ready to cook.', 4500, NULL, (SELECT id FROM public.okads_categories WHERE slug='fresh-fish'), 'per kg', false),
  ('Croaker Fish', 'croaker-fish', 'Atlantic croaker — great for pepper soup and frying.', 8000, 9500, (SELECT id FROM public.okads_categories WHERE slug='fresh-fish'), 'per kg', true),
  ('River Crab', 'river-crab', 'Jumbo river crabs, perfect for seafood okra and stews.', 10000, NULL, (SELECT id FROM public.okads_categories WHERE slug='seafood-delights'), 'per kg', true),
  ('Tiger Prawns', 'tiger-prawns', 'Large tiger prawns, deveined and ready for cooking.', 18000, 22000, (SELECT id FROM public.okads_categories WHERE slug='seafood-delights'), 'per kg', true),
  ('Giant Snails', 'giant-snails', 'Fresh African giant snails. Rich in protein.', 8000, NULL, (SELECT id FROM public.okads_categories WHERE slug='seafood-delights'), 'per piece', false),
  ('Frozen Mackerel Carton', 'frozen-mackerel-carton', 'Full carton of frozen mackerel (Titus). 20kg carton.', 35000, 40000, (SELECT id FROM public.okads_categories WHERE slug='frozen-food'), 'per carton', true),
  ('Frozen Chicken (Full)', 'frozen-chicken-full', 'Whole frozen chicken, premium quality.', 7500, NULL, (SELECT id FROM public.okads_categories WHERE slug='frozen-food'), 'per pack', false),
  ('Frozen Turkey', 'frozen-turkey', 'Full frozen turkey for special occasions.', 25000, 28000, (SELECT id FROM public.okads_categories WHERE slug='frozen-food'), 'per piece', false),
  ('Dried Crayfish', 'dried-crayfish', 'Premium ground crayfish for soups and stews.', 5000, NULL, (SELECT id FROM public.okads_categories WHERE slug='dry-foodstuffs'), 'per cup (500g)', true),
  ('Stockfish (Okporoko)', 'stockfish-okporoko', 'Whole dried stockfish. A must-have for Nigerian soups.', 15000, NULL, (SELECT id FROM public.okads_categories WHERE slug='dry-foodstuffs'), 'per piece', false),
  ('Dry Pepper (Ata Gigun)', 'dry-pepper', 'Premium dry pepper blend for all your cooking needs.', 3000, NULL, (SELECT id FROM public.okads_categories WHERE slug='dry-foodstuffs'), 'per bag', false),
  ('Family Seafood Bundle', 'family-seafood-bundle', 'Assorted fish + prawns + crab combo for the whole family. Perfect weekend package.', 45000, 55000, (SELECT id FROM public.okads_categories WHERE slug='wholesale-combos'), 'per bundle', true),
  ('Party Combo Pack', 'party-combo-pack', 'Bulk fish and chicken combo for events and parties.', 80000, 95000, (SELECT id FROM public.okads_categories WHERE slug='wholesale-combos'), 'per pack', false);
