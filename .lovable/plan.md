
## Goal

Replace the existing TrustTag module with **TraceTag Nigeria** — a Nigeria-focused national item registry and stolen goods verification platform mounted at `/tracetag/*` (with `/trusttag/*` redirecting). 22 pages, dealer tools, admin console, QR + PDF certificates, anonymous tips, search-alert system. SMS and Paystack are stubbed (no live keys this pass). NIN/BVN skipped for now.

## Brand & UX

- Colors: Deep Navy `#1A3C6E`, White, Alert Red `#D32F2F`, success Green for "Clean".
- Font: Inter (already loaded).
- Logo: bold "TraceTag" wordmark in navy + shield icon (Lucide `ShieldCheck`).
- Mobile-first: bottom sheet navigation on mobile, sidebar on desktop. All forms single-column on mobile.
- Scoped CSS namespace `.tracetag` (mirrors how `.trusttag` is scoped in `index.css`) so tokens don't leak into the rest of Zymaxon.

## Database (single migration, replaces tt_* tables)

Drop the `tt_*` schema and create:

- `tt_profiles` (full_name, email, phone, account_type enum, verification_status enum, profile_photo_url, created_at). No NIN/BVN columns this pass.
- `tt_business_profiles` (business_name, cac_number, business_type, contact_person, address, docs jsonb, api_key, plan, plan_renews_at).
- `tt_user_roles` (id, user_id, role enum: user|dealer|admin) — same security-definer `tt_has_role` pattern as today.
- `tt_items` — adds Nigeria-specific identifier columns: imei_1, imei_2, vin, plate_number, engine_number, frame_number, mac_address, chassis_number, kva_rating, screen_size, color, purchase_location, purchase_price, vivesa_asset_id (unique, format `TT-YYYY-NG-#####`), qr_url, status enum (clean|stolen|recovered|transferred).
- `tt_stolen_reports` — date/time/state/lga/circumstance enum, police_report_number, police_station, police_state, reward fields, police_doc_url.
- `tt_transfers` — to_user_email/phone, sale_price, transfer_notes, status enum.
- `tt_tips` — item_id nullable, search_query, tip_description, seller_platform enum, seller_location, seller_contact, photo_urls, submitted_by nullable (anonymous allowed), status enum (new|investigating|resolved).
- `tt_search_logs` — search_query, searcher_ip, searcher_user_id nullable, item_found bool, item_status, searched_at. Powers the "someone searched your item" alerts.
- `tt_verification_checks` — dealer bulk-check audit trail.
- `tt_notifications` — same shape as today.
- `tt_audit_logs` — kept; admin actions logged.

Every new public-schema table gets explicit GRANTs (anon for fully-public reads like `tt_items` status-page projection, authenticated for owner CRUD, service_role for edge functions). RLS policies follow existing patterns: owner-only writes, admin via `tt_has_role`, public read for the minimum status-page projection only.

Database function `tt_generate_asset_id()` (SECURITY DEFINER) returns the next `TT-YYYY-NG-#####` id, called from a BEFORE INSERT trigger on `tt_items`. `tt_verify_search(_query text)` (SECURITY DEFINER) returns a sanitized public projection for the search page in a single roundtrip (matches across imei_1/imei_2/serial_number/vin/plate_number/vivesa_asset_id) and logs to `tt_search_logs`.

Storage buckets: keep `trusttag-items` for item photos, add `tracetag-docs` (private) for police reports + dealer CAC docs, add `tracetag-tips` (private) for tip photos.

## Routes (all under `/tracetag/*`, plus a redirect from `/trusttag/*`)

Public:
- `/` Landing
- `/search` Public search
- `/item/:assetId` Public item status page (QR target)
- `/auth` Login + Signup tabs (Individual / Dealer)
- `/pricing`, `/about`, `/how-it-works`, `/contact`, `/privacy`, `/terms`

User app (`/tracetag/app/*`, AuthGate):
- `/app` Dashboard
- `/app/items` My Items
- `/app/items/new` Register New Item (multi-step, category-specific forms)
- `/app/items/:id` Item detail
- `/app/items/:id/stolen` Report Stolen
- `/app/items/:id/transfer` Transfer Ownership
- `/app/tips/new` Anonymous tip (also reachable unauthenticated)
- `/app/notifications`
- `/app/settings`

Dealer (`/tracetag/dealer/*`, RoleGate "dealer"):
- `/dealer` Dashboard
- `/dealer/verify` Bulk CSV / comma-list verification
- `/dealer/history` Verification log
- `/dealer/api` API key management
- `/dealer/billing`

Admin (`/tracetag/admin/*`, RoleGate "admin"):
- `/admin` Overview
- `/admin/users` User management & ID verification
- `/admin/items` Item moderation
- `/admin/stolen` Stolen reports + state heatmap
- `/admin/tips` Tip triage
- `/admin/dealers` Dealer application approvals
- `/admin/logs` Search logs
- `/admin/analytics` Charts (Recharts)
- `/admin/announcements` Platform-wide push

## Key features

- **Asset ID + QR**: trigger generates `TT-YYYY-NG-#####`; client generates QR (`qrcode` npm) pointing to `https://tracetag.ng/item/:assetId`. Downloadable PNG.
- **PDF certificate**: `jspdf` + `qrcode` to render certificate client-side with navy border, shield seal, owner + item + asset ID + QR.
- **Public search**: calls `tt_verify_search` RPC. Returns one of `clean | stolen | not_found`. On stolen, shows red banner, date/state/police ref, and "Submit Tip" CTA. Search input client-validates IMEI (15 digits), Nigerian plate, asset ID format.
- **Search-alert system**: `tt_verify_search` writes to `tt_search_logs` and inserts a `tt_notifications` row for the owner when status is stolen. Realtime subscription on `tt_notifications` pushes to the bell icon.
- **Anonymous tips**: insert allowed for `anon` role with rate-limit by IP via a Postgres function counting recent inserts per IP (24h window).
- **Dealer bulk verify**: CSV parse client-side, batch RPC call, results table with export to CSV/PDF, logged in `tt_verification_checks`.
- **Edge functions**:
  - `tt-fraud-check` — keep existing, retarget to new tables.
  - `tt-search` — optional server-side wrapper around `tt_verify_search` for IP capture + rate limit (no backend rate limiting per project rule → handled in DB function as a fraud-flag side effect only, not a hard block).
  - `tt-notify` — single function stub for SMS/email fan-out; logs to console, no external calls until keys added.
- **Auth**: keep existing Supabase email + Google. Add dealer signup path that creates `tt_business_profiles` row with `pending` status.
- **Pricing page**: 3 tiers (Free / Individual Pro ₦2,000mo / Business ₦25,000mo). "Subscribe" buttons disabled with "Coming soon — Paystack integration pending" badge.
- **SEO**: per-route `<title>`/meta via `react-helmet-async` (already present pattern), JSON-LD `Organization` + `WebSite` on landing, `Product`-ish schema on public item status page. Sitemap + robots updated.

## Out of scope this pass

- Live SMS (Africa's Talking / Termii) — code paths exist, function stubbed.
- Live Paystack subscriptions — pricing UI only.
- Real NIN/BVN/NIMC/FRSC verification — fields not collected.
- Map heatmap uses a simple SVG of Nigerian states colored by count, not Mapbox.
- Email-delivery of certificates — user downloads from UI; no transactional email scaffolding this pass.

## Technical notes

- Adds: `qrcode`, `jspdf`, `papaparse` (CSV), `react-helmet-async` if not present.
- All Nigeria state/LGA data committed as a static `src/components/tracetag/shared/ng-locations.ts`.
- Existing `useTTAuth` hook renamed and moved to `src/components/tracetag/shared/useAuth.ts`; old TrustTag components deleted.
- `App.tsx`: replace `/trusttag/*` route with `/tracetag/*` + a `<Navigate>` redirect from old path so any external QR codes that already exist still resolve (best-effort).
- Build order: (1) migration, (2) shared layout/auth/types, (3) public surfaces (landing, search, status, auth), (4) user app, (5) dealer, (6) admin, (7) PDF/QR/CSV utilities, (8) edge function retarget, (9) SEO pass, (10) memory update.

Heads-up: this is a very large scope in one shot. Expect the first build to land all 22 routes wired and functional, but admin analytics charts, dealer billing, and the heatmap will be intentionally minimal so the rest is solid. We can iterate after.
