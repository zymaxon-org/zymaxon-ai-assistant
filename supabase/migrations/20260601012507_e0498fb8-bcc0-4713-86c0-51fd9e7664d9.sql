
-- ============================================================
-- TRACETAG NIGERIA: replace TrustTag schema
-- ============================================================

-- Drop old TrustTag tables (cascade clears policies, triggers, FKs)
DROP TABLE IF EXISTS public.tt_chat_messages CASCADE;
DROP TABLE IF EXISTS public.tt_chat_threads CASCADE;
DROP TABLE IF EXISTS public.tt_found_reports CASCADE;
DROP TABLE IF EXISTS public.tt_lost_reports CASCADE;
DROP TABLE IF EXISTS public.tt_ownership_history CASCADE;
DROP TABLE IF EXISTS public.tt_scans CASCADE;
DROP TABLE IF EXISTS public.tt_qr_codes CASCADE;
DROP TABLE IF EXISTS public.tt_qr_batches CASCADE;
DROP TABLE IF EXISTS public.tt_products CASCADE;
DROP TABLE IF EXISTS public.tt_manufacturers CASCADE;
DROP TABLE IF EXISTS public.tt_transfers CASCADE;
DROP TABLE IF EXISTS public.tt_fraud_flags CASCADE;
DROP TABLE IF EXISTS public.tt_audit_logs CASCADE;
DROP TABLE IF EXISTS public.tt_notifications CASCADE;
DROP TABLE IF EXISTS public.tt_items CASCADE;
DROP TABLE IF EXISTS public.tt_user_roles CASCADE;
DROP TABLE IF EXISTS public.tt_profiles CASCADE;

DROP FUNCTION IF EXISTS public.tt_has_role(uuid, public.tt_role) CASCADE;
DROP FUNCTION IF EXISTS public.tt_verify_qr(text) CASCADE;
DROP FUNCTION IF EXISTS public.tt_handle_new_user() CASCADE;
DROP TYPE IF EXISTS public.tt_role CASCADE;

-- Enums
CREATE TYPE public.tt_role AS ENUM ('user','dealer','admin');
CREATE TYPE public.tt_account_type AS ENUM ('individual','dealer','business','admin');
CREATE TYPE public.tt_verification_status AS ENUM ('pending','verified','rejected');
CREATE TYPE public.tt_item_status AS ENUM ('clean','stolen','recovered','transferred');
CREATE TYPE public.tt_transfer_status AS ENUM ('pending','accepted','rejected','cancelled');
CREATE TYPE public.tt_tip_status AS ENUM ('new','investigating','resolved','dismissed');
CREATE TYPE public.tt_dealer_status AS ENUM ('pending','approved','rejected','suspended');

-- ============================================================
-- tt_profiles
-- ============================================================
CREATE TABLE public.tt_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone_number TEXT,
  profile_photo_url TEXT,
  account_type public.tt_account_type NOT NULL DEFAULT 'individual',
  verification_status public.tt_verification_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tt_profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.tt_profiles TO authenticated;
GRANT ALL ON public.tt_profiles TO service_role;
ALTER TABLE public.tt_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles public readable" ON public.tt_profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON public.tt_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.tt_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- tt_user_roles
-- ============================================================
CREATE TABLE public.tt_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.tt_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.tt_user_roles TO authenticated;
GRANT ALL ON public.tt_user_roles TO service_role;
ALTER TABLE public.tt_user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.tt_has_role(_user_id uuid, _role public.tt_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.tt_user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.tt_user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.tt_has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage roles" ON public.tt_user_roles FOR ALL TO authenticated
  USING (public.tt_has_role(auth.uid(),'admin')) WITH CHECK (public.tt_has_role(auth.uid(),'admin'));

-- ============================================================
-- tt_business_profiles  (dealer / business accounts)
-- ============================================================
CREATE TABLE public.tt_business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  cac_number TEXT,
  business_type TEXT NOT NULL DEFAULT 'other',
  contact_person TEXT,
  business_email TEXT,
  business_phone TEXT,
  business_address TEXT,
  docs JSONB NOT NULL DEFAULT '[]'::jsonb,
  api_key TEXT UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free',
  status public.tt_dealer_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.tt_business_profiles TO authenticated;
GRANT ALL ON public.tt_business_profiles TO service_role;
ALTER TABLE public.tt_business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dealer reads own business" ON public.tt_business_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.tt_has_role(auth.uid(),'admin'));
CREATE POLICY "Dealer creates own business" ON public.tt_business_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Dealer/admin updates business" ON public.tt_business_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.tt_has_role(auth.uid(),'admin'));

-- ============================================================
-- tt_items  (the registry)
-- ============================================================
CREATE TABLE public.tt_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  item_category TEXT NOT NULL DEFAULT 'other',
  brand TEXT,
  model TEXT,
  color TEXT,
  serial_number TEXT,
  imei_1 TEXT,
  imei_2 TEXT,
  vin TEXT,
  plate_number TEXT,
  engine_number TEXT,
  frame_number TEXT,
  chassis_number TEXT,
  mac_address TEXT,
  kva_rating TEXT,
  screen_size TEXT,
  additional_identifiers TEXT,
  purchase_date DATE,
  purchase_price NUMERIC,
  purchase_location TEXT,
  item_photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  vivesa_asset_id TEXT UNIQUE,
  qr_url TEXT,
  status public.tt_item_status NOT NULL DEFAULT 'clean',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tt_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tt_items TO authenticated;
GRANT ALL ON public.tt_items TO service_role;
ALTER TABLE public.tt_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Items public read" ON public.tt_items FOR SELECT USING (true);
CREATE POLICY "Owner manages items" ON public.tt_items FOR ALL TO authenticated
  USING (auth.uid() = owner_id OR public.tt_has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = owner_id OR public.tt_has_role(auth.uid(),'admin'));

CREATE INDEX idx_tt_items_owner ON public.tt_items(owner_id);
CREATE INDEX idx_tt_items_status ON public.tt_items(status);
CREATE INDEX idx_tt_items_imei1 ON public.tt_items(imei_1) WHERE imei_1 IS NOT NULL;
CREATE INDEX idx_tt_items_imei2 ON public.tt_items(imei_2) WHERE imei_2 IS NOT NULL;
CREATE INDEX idx_tt_items_serial ON public.tt_items(serial_number) WHERE serial_number IS NOT NULL;
CREATE INDEX idx_tt_items_vin ON public.tt_items(vin) WHERE vin IS NOT NULL;
CREATE INDEX idx_tt_items_plate ON public.tt_items(plate_number) WHERE plate_number IS NOT NULL;

-- Asset ID generator
CREATE OR REPLACE FUNCTION public.tt_generate_asset_id()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_id TEXT; tries INT := 0;
BEGIN
  IF NEW.vivesa_asset_id IS NULL OR NEW.vivesa_asset_id = '' THEN
    LOOP
      new_id := 'TT-' || EXTRACT(YEAR FROM now())::TEXT || '-NG-' || lpad((floor(random()*100000))::int::text, 5, '0');
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.tt_items WHERE vivesa_asset_id = new_id);
      tries := tries + 1;
      IF tries > 10 THEN
        new_id := 'TT-' || EXTRACT(YEAR FROM now())::TEXT || '-NG-' || substr(md5(random()::text),1,5);
        EXIT;
      END IF;
    END LOOP;
    NEW.vivesa_asset_id := new_id;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER tt_items_set_asset_id BEFORE INSERT ON public.tt_items
  FOR EACH ROW EXECUTE FUNCTION public.tt_generate_asset_id();

CREATE TRIGGER tt_items_updated_at BEFORE UPDATE ON public.tt_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- tt_stolen_reports
-- ============================================================
CREATE TABLE public.tt_stolen_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL,
  reported_by UUID NOT NULL,
  date_stolen DATE,
  time_stolen TEXT,
  location_stolen TEXT,
  state_stolen TEXT,
  lga_stolen TEXT,
  circumstance TEXT,
  additional_description TEXT,
  police_report_number TEXT,
  police_station TEXT,
  police_state TEXT,
  police_doc_url TEXT,
  reward_offered BOOLEAN NOT NULL DEFAULT false,
  reward_amount NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tt_stolen_reports TO anon;
GRANT SELECT, INSERT, UPDATE ON public.tt_stolen_reports TO authenticated;
GRANT ALL ON public.tt_stolen_reports TO service_role;
ALTER TABLE public.tt_stolen_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stolen reports public read" ON public.tt_stolen_reports FOR SELECT USING (true);
CREATE POLICY "Owner creates stolen" ON public.tt_stolen_reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Owner/admin updates stolen" ON public.tt_stolen_reports FOR UPDATE TO authenticated
  USING (auth.uid() = reported_by OR public.tt_has_role(auth.uid(),'admin'));

-- ============================================================
-- tt_transfers
-- ============================================================
CREATE TABLE public.tt_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL,
  from_user_id UUID NOT NULL,
  to_user_id UUID,
  to_user_email TEXT,
  to_user_phone TEXT,
  sale_price NUMERIC,
  transfer_notes TEXT,
  status public.tt_transfer_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.tt_transfers TO authenticated;
GRANT ALL ON public.tt_transfers TO service_role;
ALTER TABLE public.tt_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parties read transfers" ON public.tt_transfers FOR SELECT TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id OR public.tt_has_role(auth.uid(),'admin'));
CREATE POLICY "Owner creates transfer" ON public.tt_transfers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Parties update transfer" ON public.tt_transfers FOR UPDATE TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id OR public.tt_has_role(auth.uid(),'admin'));

-- ============================================================
-- tt_tips  (anonymous tips on stolen items)
-- ============================================================
CREATE TABLE public.tt_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID,
  search_query TEXT,
  tip_description TEXT NOT NULL,
  seller_platform TEXT,
  seller_location TEXT,
  seller_contact TEXT,
  photo_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  submitted_by UUID,
  submitter_ip TEXT,
  status public.tt_tip_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.tt_tips TO anon, authenticated;
GRANT SELECT, UPDATE ON public.tt_tips TO authenticated;
GRANT ALL ON public.tt_tips TO service_role;
ALTER TABLE public.tt_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone submits tip" ON public.tt_tips FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "Item owner / admin reads tips" ON public.tt_tips FOR SELECT TO authenticated
  USING (
    public.tt_has_role(auth.uid(),'admin')
    OR auth.uid() = submitted_by
    OR EXISTS (SELECT 1 FROM public.tt_items i WHERE i.id = tt_tips.item_id AND i.owner_id = auth.uid())
  );
CREATE POLICY "Admin updates tips" ON public.tt_tips FOR UPDATE TO authenticated
  USING (public.tt_has_role(auth.uid(),'admin'));

-- ============================================================
-- tt_search_logs
-- ============================================================
CREATE TABLE public.tt_search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query TEXT NOT NULL,
  searcher_ip TEXT,
  searcher_user_id UUID,
  item_id UUID,
  item_found BOOLEAN NOT NULL DEFAULT false,
  item_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.tt_search_logs TO anon, authenticated;
GRANT SELECT ON public.tt_search_logs TO authenticated;
GRANT ALL ON public.tt_search_logs TO service_role;
ALTER TABLE public.tt_search_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone log search" ON public.tt_search_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin/owner reads logs" ON public.tt_search_logs FOR SELECT TO authenticated
  USING (
    public.tt_has_role(auth.uid(),'admin')
    OR EXISTS (SELECT 1 FROM public.tt_items i WHERE i.id = tt_search_logs.item_id AND i.owner_id = auth.uid())
  );

-- ============================================================
-- tt_verification_checks  (dealer bulk-check audit)
-- ============================================================
CREATE TABLE public.tt_verification_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checked_by UUID NOT NULL,
  item_identifier TEXT NOT NULL,
  result TEXT NOT NULL,
  item_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.tt_verification_checks TO authenticated;
GRANT ALL ON public.tt_verification_checks TO service_role;
ALTER TABLE public.tt_verification_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dealer reads own checks" ON public.tt_verification_checks FOR SELECT TO authenticated
  USING (auth.uid() = checked_by OR public.tt_has_role(auth.uid(),'admin'));
CREATE POLICY "Dealer logs own checks" ON public.tt_verification_checks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = checked_by);

-- ============================================================
-- tt_notifications
-- ============================================================
CREATE TABLE public.tt_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.tt_notifications TO authenticated;
GRANT ALL ON public.tt_notifications TO service_role;
ALTER TABLE public.tt_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own notifications" ON public.tt_notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.tt_has_role(auth.uid(),'admin'));
CREATE POLICY "Users update own notifications" ON public.tt_notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- tt_audit_logs
-- ============================================================
CREATE TABLE public.tt_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.tt_audit_logs TO authenticated;
GRANT ALL ON public.tt_audit_logs TO service_role;
ALTER TABLE public.tt_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read audit" ON public.tt_audit_logs FOR SELECT TO authenticated
  USING (public.tt_has_role(auth.uid(),'admin'));
CREATE POLICY "Authenticated insert audit" ON public.tt_audit_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = actor_user_id);

-- ============================================================
-- New user trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.tt_handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.tt_profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''), NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.tt_user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created_tt ON auth.users;
CREATE TRIGGER on_auth_user_created_tt
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.tt_handle_new_user();

-- ============================================================
-- Public verify search RPC
-- ============================================================
CREATE OR REPLACE FUNCTION public.tt_verify_search(_query text, _ip text DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  q TEXT := upper(trim(_query));
  rec RECORD;
  owner_name TEXT;
  stolen RECORD;
  result JSONB;
BEGIN
  IF q IS NULL OR length(q) < 4 THEN
    RETURN jsonb_build_object('status','invalid');
  END IF;

  SELECT i.* INTO rec FROM public.tt_items i
  WHERE upper(i.vivesa_asset_id) = q
     OR upper(i.imei_1) = q OR upper(i.imei_2) = q
     OR upper(i.serial_number) = q OR upper(i.vin) = q
     OR upper(i.plate_number) = q OR upper(i.engine_number) = q
     OR upper(i.frame_number) = q OR upper(i.chassis_number) = q
     OR upper(i.mac_address) = q
  LIMIT 1;

  IF rec.id IS NULL THEN
    INSERT INTO public.tt_search_logs(search_query, searcher_ip, searcher_user_id, item_found, item_status)
    VALUES (_query, _ip, auth.uid(), false, 'not_found');
    RETURN jsonb_build_object('status','not_found');
  END IF;

  SELECT full_name INTO owner_name FROM public.tt_profiles WHERE user_id = rec.owner_id;
  IF owner_name IS NULL OR owner_name = '' THEN owner_name := 'Owner'; END IF;

  INSERT INTO public.tt_search_logs(search_query, searcher_ip, searcher_user_id, item_id, item_found, item_status)
  VALUES (_query, _ip, auth.uid(), rec.id, true, rec.status::text);

  IF rec.status = 'stolen' THEN
    INSERT INTO public.tt_notifications(user_id, message, type, link)
    VALUES (rec.owner_id,
      'Someone searched your stolen item: ' || rec.item_name,
      'search_alert',
      '/tracetag/app/items/' || rec.id);

    SELECT * INTO stolen FROM public.tt_stolen_reports WHERE item_id = rec.id ORDER BY created_at DESC LIMIT 1;

    result := jsonb_build_object(
      'status','stolen',
      'item_id', rec.id,
      'asset_id', rec.vivesa_asset_id,
      'item_name', rec.item_name,
      'item_category', rec.item_category,
      'brand', rec.brand,
      'model', rec.model,
      'owner_display', split_part(owner_name,' ',1) || ' ' || left(coalesce(split_part(owner_name,' ',2),''),1) || '.',
      'date_stolen', stolen.date_stolen,
      'state_stolen', stolen.state_stolen,
      'lga_stolen', stolen.lga_stolen,
      'police_report_number', stolen.police_report_number,
      'reward_offered', stolen.reward_offered,
      'reward_amount', stolen.reward_amount
    );
  ELSE
    result := jsonb_build_object(
      'status', rec.status::text,
      'item_id', rec.id,
      'asset_id', rec.vivesa_asset_id,
      'item_name', rec.item_name,
      'item_category', rec.item_category,
      'brand', rec.brand,
      'model', rec.model,
      'registered_at', rec.created_at,
      'owner_display', split_part(owner_name,' ',1) || ' ' || left(coalesce(split_part(owner_name,' ',2),''),1) || '.'
    );
  END IF;

  RETURN result;
END; $$;

GRANT EXECUTE ON FUNCTION public.tt_verify_search(text, text) TO anon, authenticated;

-- ============================================================
-- Storage buckets
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('tracetag-docs','tracetag-docs', false)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('tracetag-tips','tracetag-tips', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users upload own docs" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'tracetag-docs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users read own docs" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'tracetag-docs' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.tt_has_role(auth.uid(),'admin')));

CREATE POLICY "Anyone upload tip evidence" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'tracetag-tips');
CREATE POLICY "Admin read tip evidence" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'tracetag-tips' AND public.tt_has_role(auth.uid(),'admin'));
