
-- ============ ROLES ============
CREATE TYPE public.tt_role AS ENUM ('user', 'manufacturer', 'admin');

CREATE TABLE public.tt_user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role tt_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.tt_user_roles TO authenticated;
GRANT ALL ON public.tt_user_roles TO service_role;
ALTER TABLE public.tt_user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.tt_has_role(_user_id uuid, _role tt_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.tt_user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.tt_user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.tt_has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage roles" ON public.tt_user_roles FOR ALL TO authenticated USING (public.tt_has_role(auth.uid(),'admin')) WITH CHECK (public.tt_has_role(auth.uid(),'admin'));

-- ============ PROFILES ============
CREATE TABLE public.tt_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  avatar_url text,
  country text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tt_profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.tt_profiles TO authenticated;
GRANT ALL ON public.tt_profiles TO service_role;
ALTER TABLE public.tt_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles readable" ON public.tt_profiles FOR SELECT USING (true);
CREATE POLICY "Users manage own profile" ON public.tt_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-create profile + default role on signup
CREATE OR REPLACE FUNCTION public.tt_handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.tt_profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.tt_user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS tt_on_auth_user_created ON auth.users;
CREATE TRIGGER tt_on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.tt_handle_new_user();

-- ============ MANUFACTURERS ============
CREATE TABLE public.tt_manufacturers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  website text DEFAULT '',
  logo_url text,
  description text DEFAULT '',
  verified boolean NOT NULL DEFAULT false,
  verification_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tt_manufacturers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tt_manufacturers TO authenticated;
GRANT ALL ON public.tt_manufacturers TO service_role;
ALTER TABLE public.tt_manufacturers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read manufacturers" ON public.tt_manufacturers FOR SELECT USING (true);
CREATE POLICY "Owner manages manufacturer" ON public.tt_manufacturers FOR ALL TO authenticated USING (auth.uid() = user_id OR public.tt_has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.tt_has_role(auth.uid(),'admin'));

-- ============ PRODUCTS (brand catalog) ============
CREATE TABLE public.tt_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer_id uuid NOT NULL REFERENCES public.tt_manufacturers(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text DEFAULT '',
  model text DEFAULT '',
  description text DEFAULT '',
  image_url text,
  warranty_months integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tt_products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tt_products TO authenticated;
GRANT ALL ON public.tt_products TO service_role;
ALTER TABLE public.tt_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read products" ON public.tt_products FOR SELECT USING (true);
CREATE POLICY "Manufacturer manages products" ON public.tt_products FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tt_manufacturers m WHERE m.id = manufacturer_id AND m.user_id = auth.uid()) OR public.tt_has_role(auth.uid(),'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.tt_manufacturers m WHERE m.id = manufacturer_id AND m.user_id = auth.uid()) OR public.tt_has_role(auth.uid(),'admin'));

-- ============ ITEMS (user-registered) ============
CREATE TABLE public.tt_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.tt_products(id) ON DELETE SET NULL,
  name text NOT NULL,
  category text DEFAULT '',
  brand text DEFAULT '',
  model text DEFAULT '',
  serial_number text DEFAULT '',
  purchase_date date,
  description text DEFAULT '',
  photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tt_items TO authenticated;
GRANT ALL ON public.tt_items TO service_role;
ALTER TABLE public.tt_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages items" ON public.tt_items FOR ALL TO authenticated USING (auth.uid() = owner_id OR public.tt_has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = owner_id OR public.tt_has_role(auth.uid(),'admin'));

-- ============ QR BATCHES & CODES ============
CREATE TABLE public.tt_qr_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer_id uuid NOT NULL REFERENCES public.tt_manufacturers(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.tt_products(id) ON DELETE SET NULL,
  name text NOT NULL,
  size integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tt_qr_batches TO authenticated;
GRANT ALL ON public.tt_qr_batches TO service_role;
ALTER TABLE public.tt_qr_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manufacturer manages batches" ON public.tt_qr_batches FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tt_manufacturers m WHERE m.id = manufacturer_id AND m.user_id = auth.uid()) OR public.tt_has_role(auth.uid(),'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.tt_manufacturers m WHERE m.id = manufacturer_id AND m.user_id = auth.uid()) OR public.tt_has_role(auth.uid(),'admin'));

CREATE TABLE public.tt_qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  item_id uuid REFERENCES public.tt_items(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.tt_products(id) ON DELETE SET NULL,
  batch_id uuid REFERENCES public.tt_qr_batches(id) ON DELETE SET NULL,
  scan_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tt_qr_codes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tt_qr_codes TO authenticated;
GRANT ALL ON public.tt_qr_codes TO service_role;
ALTER TABLE public.tt_qr_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read qr_codes" ON public.tt_qr_codes FOR SELECT USING (true);
CREATE POLICY "Owners/manufacturers manage qr" ON public.tt_qr_codes FOR ALL TO authenticated
  USING (
    (item_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.tt_items i WHERE i.id = item_id AND i.owner_id = auth.uid()))
    OR (batch_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.tt_qr_batches b JOIN public.tt_manufacturers m ON m.id=b.manufacturer_id WHERE b.id = batch_id AND m.user_id = auth.uid()))
    OR public.tt_has_role(auth.uid(),'admin')
  )
  WITH CHECK (
    (item_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.tt_items i WHERE i.id = item_id AND i.owner_id = auth.uid()))
    OR (batch_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.tt_qr_batches b JOIN public.tt_manufacturers m ON m.id=b.manufacturer_id WHERE b.id = batch_id AND m.user_id = auth.uid()))
    OR public.tt_has_role(auth.uid(),'admin')
  );

-- ============ SCANS ============
CREATE TABLE public.tt_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id uuid REFERENCES public.tt_qr_codes(id) ON DELETE SET NULL,
  token text,
  scanner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_country text DEFAULT '',
  ip_city text DEFAULT '',
  user_agent text DEFAULT '',
  result text NOT NULL DEFAULT 'verified',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tt_scans TO authenticated;
GRANT INSERT ON public.tt_scans TO anon, authenticated;
GRANT ALL ON public.tt_scans TO service_role;
ALTER TABLE public.tt_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone insert scans" ON public.tt_scans FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Owners read scans" ON public.tt_scans FOR SELECT TO authenticated USING (
  public.tt_has_role(auth.uid(),'admin')
  OR EXISTS (SELECT 1 FROM public.tt_qr_codes q JOIN public.tt_items i ON i.id=q.item_id WHERE q.id = qr_code_id AND i.owner_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.tt_qr_codes q JOIN public.tt_qr_batches b ON b.id=q.batch_id JOIN public.tt_manufacturers m ON m.id=b.manufacturer_id WHERE q.id = qr_code_id AND m.user_id = auth.uid())
);

-- ============ OWNERSHIP HISTORY ============
CREATE TABLE public.tt_ownership_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.tt_items(id) ON DELETE CASCADE,
  from_user uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  to_user uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reason text DEFAULT '',
  transferred_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tt_ownership_history TO authenticated;
GRANT INSERT ON public.tt_ownership_history TO authenticated;
GRANT ALL ON public.tt_ownership_history TO service_role;
ALTER TABLE public.tt_ownership_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties read history" ON public.tt_ownership_history FOR SELECT TO authenticated USING (
  auth.uid() = from_user OR auth.uid() = to_user OR public.tt_has_role(auth.uid(),'admin')
  OR EXISTS (SELECT 1 FROM public.tt_items i WHERE i.id = item_id AND i.owner_id = auth.uid())
);
CREATE POLICY "Owner inserts history" ON public.tt_ownership_history FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.tt_items i WHERE i.id = item_id AND i.owner_id = auth.uid())
);

-- ============ TRANSFERS ============
CREATE TABLE public.tt_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.tt_items(id) ON DELETE CASCADE,
  from_user uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_email text NOT NULL,
  to_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.tt_transfers TO authenticated;
GRANT ALL ON public.tt_transfers TO service_role;
ALTER TABLE public.tt_transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties read transfers" ON public.tt_transfers FOR SELECT TO authenticated USING (
  auth.uid() = from_user OR auth.uid() = to_user_id OR public.tt_has_role(auth.uid(),'admin')
);
CREATE POLICY "Owner creates transfer" ON public.tt_transfers FOR INSERT TO authenticated WITH CHECK (auth.uid() = from_user);
CREATE POLICY "Parties update transfer" ON public.tt_transfers FOR UPDATE TO authenticated USING (
  auth.uid() = from_user OR auth.uid() = to_user_id OR public.tt_has_role(auth.uid(),'admin')
);

-- ============ LOST & FOUND ============
CREATE TABLE public.tt_lost_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.tt_items(id) ON DELETE CASCADE,
  reported_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_amount numeric DEFAULT 0,
  last_location text DEFAULT '',
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tt_lost_reports TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tt_lost_reports TO authenticated;
GRANT ALL ON public.tt_lost_reports TO service_role;
ALTER TABLE public.tt_lost_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read lost reports" ON public.tt_lost_reports FOR SELECT USING (true);
CREATE POLICY "Owner manages lost reports" ON public.tt_lost_reports FOR ALL TO authenticated USING (
  auth.uid() = reported_by OR public.tt_has_role(auth.uid(),'admin')
) WITH CHECK (auth.uid() = reported_by OR public.tt_has_role(auth.uid(),'admin'));

CREATE TABLE public.tt_found_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lost_report_id uuid NOT NULL REFERENCES public.tt_lost_reports(id) ON DELETE CASCADE,
  finder_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  finder_anon_token text,
  photo_url text,
  location text DEFAULT '',
  message text DEFAULT '',
  thread_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.tt_found_reports TO anon, authenticated;
GRANT ALL ON public.tt_found_reports TO service_role;
ALTER TABLE public.tt_found_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone create found report" ON public.tt_found_reports FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Parties read found reports" ON public.tt_found_reports FOR SELECT TO authenticated USING (
  auth.uid() = finder_user_id OR public.tt_has_role(auth.uid(),'admin')
  OR EXISTS (SELECT 1 FROM public.tt_lost_reports l WHERE l.id = lost_report_id AND l.reported_by = auth.uid())
);

-- ============ CHAT ============
CREATE TABLE public.tt_chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES public.tt_items(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  other_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  subject text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.tt_chat_threads TO authenticated;
GRANT ALL ON public.tt_chat_threads TO service_role;
ALTER TABLE public.tt_chat_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties read threads" ON public.tt_chat_threads FOR SELECT TO authenticated USING (
  auth.uid() = owner_id OR auth.uid() = other_user_id OR public.tt_has_role(auth.uid(),'admin')
);
CREATE POLICY "Parties create threads" ON public.tt_chat_threads FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = owner_id OR auth.uid() = other_user_id
);

CREATE TABLE public.tt_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.tt_chat_threads(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  body text NOT NULL,
  sanitized_body text NOT NULL DEFAULT '',
  flagged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.tt_chat_messages TO authenticated;
GRANT ALL ON public.tt_chat_messages TO service_role;
ALTER TABLE public.tt_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties read messages" ON public.tt_chat_messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.tt_chat_threads t WHERE t.id = thread_id AND (t.owner_id = auth.uid() OR t.other_user_id = auth.uid()))
  OR public.tt_has_role(auth.uid(),'admin')
);
CREATE POLICY "Parties send messages" ON public.tt_chat_messages FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (SELECT 1 FROM public.tt_chat_threads t WHERE t.id = thread_id AND (t.owner_id = auth.uid() OR t.other_user_id = auth.uid()))
);

-- ============ NOTIFICATIONS ============
CREATE TABLE public.tt_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  body text DEFAULT '',
  link text DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tt_notifications TO authenticated;
GRANT ALL ON public.tt_notifications TO service_role;
ALTER TABLE public.tt_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notifications" ON public.tt_notifications FOR ALL TO authenticated USING (auth.uid() = user_id OR public.tt_has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.tt_has_role(auth.uid(),'admin'));

-- ============ AUDIT LOG ============
CREATE TABLE public.tt_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text DEFAULT '',
  target_id text DEFAULT '',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.tt_audit_logs TO authenticated;
GRANT ALL ON public.tt_audit_logs TO service_role;
ALTER TABLE public.tt_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit" ON public.tt_audit_logs FOR SELECT TO authenticated USING (public.tt_has_role(auth.uid(),'admin'));
CREATE POLICY "Anyone insert audit (server)" ON public.tt_audit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_user_id);

-- ============ FRAUD FLAGS ============
CREATE TABLE public.tt_fraud_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid,
  reason text NOT NULL,
  severity text NOT NULL DEFAULT 'low',
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.tt_fraud_flags TO authenticated;
GRANT ALL ON public.tt_fraud_flags TO service_role;
ALTER TABLE public.tt_fraud_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage fraud flags" ON public.tt_fraud_flags FOR ALL TO authenticated USING (public.tt_has_role(auth.uid(),'admin')) WITH CHECK (public.tt_has_role(auth.uid(),'admin'));

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES ('trusttag-items', 'trusttag-items', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('trusttag-brand', 'trusttag-brand', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read tt items" ON storage.objects FOR SELECT USING (bucket_id IN ('trusttag-items','trusttag-brand'));
CREATE POLICY "Authed upload tt items" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('trusttag-items','trusttag-brand') AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Authed update own tt files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('trusttag-items','trusttag-brand') AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Authed delete own tt files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('trusttag-items','trusttag-brand') AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============ updated_at triggers ============
CREATE TRIGGER tt_profiles_uat BEFORE UPDATE ON public.tt_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tt_manuf_uat BEFORE UPDATE ON public.tt_manufacturers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tt_products_uat BEFORE UPDATE ON public.tt_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tt_items_uat BEFORE UPDATE ON public.tt_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tt_transfers_uat BEFORE UPDATE ON public.tt_transfers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tt_lost_uat BEFORE UPDATE ON public.tt_lost_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ VERIFY RPC (public) ============
CREATE OR REPLACE FUNCTION public.tt_verify_qr(_token text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'found', true,
    'qr_id', q.id,
    'item', CASE WHEN i.id IS NOT NULL THEN jsonb_build_object(
      'id', i.id, 'name', i.name, 'brand', i.brand, 'model', i.model, 'category', i.category,
      'status', i.status, 'registered_at', i.created_at,
      'owner_name', COALESCE(p.full_name,'')
    ) END,
    'product', CASE WHEN pr.id IS NOT NULL THEN jsonb_build_object(
      'id', pr.id, 'name', pr.name, 'model', pr.model, 'warranty_months', pr.warranty_months,
      'manufacturer', m.company_name, 'manufacturer_verified', m.verified
    ) END,
    'lost_report', (
      SELECT jsonb_build_object('id', lr.id, 'reward', lr.reward_amount, 'last_location', lr.last_location, 'description', lr.description)
      FROM public.tt_lost_reports lr WHERE lr.item_id = i.id AND lr.status = 'open' LIMIT 1
    )
  ) INTO result
  FROM public.tt_qr_codes q
  LEFT JOIN public.tt_items i ON i.id = q.item_id
  LEFT JOIN public.tt_profiles p ON p.user_id = i.owner_id
  LEFT JOIN public.tt_products pr ON pr.id = COALESCE(q.product_id, i.product_id)
  LEFT JOIN public.tt_manufacturers m ON m.id = pr.manufacturer_id
  WHERE q.token = _token
  LIMIT 1;
  RETURN COALESCE(result, jsonb_build_object('found', false));
END; $$;

GRANT EXECUTE ON FUNCTION public.tt_verify_qr(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.tt_has_role(uuid, tt_role) TO anon, authenticated;

-- Enable realtime for notifications + chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.tt_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tt_chat_messages;
