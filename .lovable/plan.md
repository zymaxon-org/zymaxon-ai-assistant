# TrustTag — Full SaaS at `/trusttag`

## Overview
A full-stack product authenticity + lost-and-found platform mounted as a self-contained section inside Zymaxon at `/trusttag/*`. Brand identity is invented (see below). All data lives in Lovable Cloud with RLS and role-based access. Built in a single pass covering visitor, user, manufacturer, and admin experiences.

## Brand Identity (invented)
- **Name:** TrustTag
- **Tagline:** "Prove it. Protect it. Recover it."
- **Palette:** White `#FFFFFF`, Trust Green `#10B981` (primary), Deep Forest `#064E3B` (accent), Dark Gray `#111827` (text/dark mode bg), Slate `#6B7280`
- **Typography:** Inter (body) + Outfit (display) — already loaded
- **Vibe:** Stripe-grade clarity, glassmorphism cards, soft shadows, micro-animations on scan/verify states

## Routes (under `/trusttag`)
```
/trusttag                      → marketing landing (SEO)
/trusttag/verify/:qrToken      → public verification page
/trusttag/scan                 → camera QR scanner
/trusttag/auth                 → login / signup / forgot password
/trusttag/app                  → user dashboard (auth)
/trusttag/app/items            → my items
/trusttag/app/items/new        → register item
/trusttag/app/items/:id        → item detail + QR + history
/trusttag/app/lost             → lost items + reports
/trusttag/app/transfers        → ownership transfers
/trusttag/app/messages         → secure chat threads
/trusttag/app/notifications    → notifications feed
/trusttag/app/profile          → profile + role upgrade
/trusttag/brand                → manufacturer portal (role: manufacturer)
  /products, /products/new, /qr-batches, /scans, /analytics, /csv-import
/trusttag/admin                → admin console (role: admin)
  /users, /manufacturers, /reports, /analytics, /audit
```

## Database (Lovable Cloud, all `tt_` prefix to avoid collision with okads/lifeos)
- `tt_profiles` — user_id, full_name, avatar, country, created_at
- `tt_user_roles` — user_id, role enum (`user` | `manufacturer` | `admin`) — separate table + `has_role()` security-definer function
- `tt_manufacturers` — user_id (owner), company_name, website, logo, verified bool, verification_status, created_at
- `tt_products` — manufacturer_id, name, category, model, description, image_url, warranty_months
- `tt_items` — owner_id, product_id (nullable for user-registered), name, category, brand, model, serial_number, purchase_date, description, photos jsonb, status (`active`|`lost`|`recovered`|`transferred`)
- `tt_qr_codes` — item_id (nullable) or product_id (for bulk brand QRs), token (unique), verification_secret, batch_id, created_at, scan_count
- `tt_qr_batches` — manufacturer_id, name, size, created_at
- `tt_scans` — qr_code_id, scanner_user_id (nullable), ip_country, ip_city, user_agent, result (`verified`|`lost`|`invalid`), created_at
- `tt_ownership_history` — item_id, from_user, to_user, transferred_at, reason
- `tt_transfers` — item_id, from_user, to_user_email, to_user_id (nullable until accept), status (`pending`|`accepted`|`rejected`|`cancelled`), token
- `tt_lost_reports` — item_id, reported_by, reward_amount, last_location, description, status, created_at
- `tt_found_reports` — lost_report_id, finder_user_id (nullable), photo_url, location, message, contact_thread_id
- `tt_chat_threads` — item_id, owner_id, other_user_id (or anon_token), created_at
- `tt_chat_messages` — thread_id, sender_id (nullable for anon finder), body, sanitized_body, flagged bool, created_at
- `tt_notifications` — user_id, type, title, body, link, read bool, created_at
- `tt_audit_logs` — actor_user_id, action, target_type, target_id, metadata jsonb, created_at
- `tt_fraud_flags` — entity_type, entity_id, reason, severity, resolved bool, created_at

**Security:** RLS on every table. `public.tt_has_role(uuid, tt_role)` security-definer. Public can read minimal verification view via `tt_verify_qr(token)` RPC (no direct table access to secrets). Admins use `tt_has_role(auth.uid(),'admin')` in policies. GRANTs included for every new table.

**Storage:** `trusttag-items` bucket (public read, authed write to own folder), `trusttag-brand` bucket (manufacturer write).

## Auth
- Email/password + Google OAuth via Lovable Cloud managed (`lovable.auth.signInWithOAuth('google')`)
- Forgot password → `/trusttag/auth/reset-password` page
- On signup: trigger creates `tt_profiles` row + assigns default `user` role
- Manufacturer role: user requests upgrade → admin approves → role inserted

## Key Feature Logic
- **QR generation:** `qrcode` npm package, client-side render + download (PNG/SVG). Token = `nanoid(24)` + HMAC verification_secret.
- **Verification page** (`/trusttag/verify/:token`): public, calls `tt_verify_qr` RPC → returns sanitized payload (brand, product, registration date, status). Logs scan with geo (via `ipapi.co` lookup in edge fn). Shows green ✓ Verified, amber ⚠ Lost, red ✗ Counterfeit states with smooth motion transitions.
- **Lost flow:** owner marks lost → QR scan result switches to "Lost" with finder form → submission creates chat thread + notifies owner real-time (Supabase Realtime).
- **Secure messaging:** edge function `tt-sanitize-message` strips phone numbers (regex), emails, @handles, common social patterns before insert. Flagged messages stored with `flagged=true`.
- **Transfers:** owner enters new owner email → creates transfer + notification. New owner accepts → ownership_history append + item.owner_id updated atomically via RPC.
- **CSV import** (manufacturer): client-side parse with PapaParse → batch insert products + generate QR batch.
- **Analytics:** Recharts dashboards — scans over time, geo heat (simple country bar), fraud flag count.
- **Fraud detection (basic, scaffolded for AI later):** edge function `tt-fraud-check` runs on each scan — flags: >3 countries in 24h, duplicate serial_numbers, transfer chains >5 in 30 days. Writes to `tt_fraud_flags`.
- **Notifications:** in-app feed + Realtime subscription on `tt_notifications`.
- **Audit logs:** RPC `tt_log_action` called from sensitive paths (role changes, transfers, admin actions).

## Edge Functions
- `tt-verify-qr` — public, logs scan + returns verification payload
- `tt-sanitize-message` — strips contact info
- `tt-fraud-check` — runs heuristics, writes flags
- `tt-transfer-accept` — atomic ownership swap
- `tt-bulk-qr-generate` — manufacturer batch QR creation

## Component Structure
```
src/pages/TrustTag.tsx              ← router root
src/components/trusttag/
  shared/           (useTTAuth, useTTRole, types, TTLayout, TTSidebar, AuthGate, RoleGate)
  marketing/        (Hero, Features, HowItWorks, Pricing, FAQ, Footer)
  verify/           (VerifyPage, ScanPage, VerifiedCard, LostCard, InvalidCard)
  user/             (Dashboard, ItemsList, ItemForm, ItemDetail, QRDisplay, LostForm, TransferForm, Messages, Notifications, Profile)
  brand/            (BrandDashboard, ProductsList, ProductForm, CSVImport, QRBatches, BrandAnalytics)
  admin/            (AdminDashboard, UsersTable, ManufacturersTable, ReportsTable, AuditLogTable, PlatformAnalytics)
```

## Design System (scoped to TrustTag)
- Add `.trusttag` CSS scope in `src/index.css` overriding `--primary` to trust-green HSL, plus custom tokens `--tt-glass`, `--tt-shadow-glow`, `--gradient-tt`. Avoids polluting Zymaxon/LifeOS/Okads themes.
- All components use semantic tokens — no hardcoded colors.
- Glassmorphism utility class `tt-glass` with backdrop-blur + subtle border.
- Dark mode supported via `.dark .trusttag` overrides.
- Mobile-first; sidebar collapses to bottom nav on mobile app routes.

## SEO
- Landing `/trusttag` gets title, meta description, OG tags, JSON-LD SoftwareApplication via `react-helmet-async` (already in deps if present, else inline `<head>` updates). Semantic H1, alt text, lazy-loaded images.

## Tech additions
- `qrcode`, `html5-qrcode` (scanner), `papaparse`, `nanoid` — install via bun
- Recharts already available
- Supabase Realtime for notifications + chat

## Out of scope (this iteration)
- AI fraud detection (scaffolded with heuristics; LLM upgrade later)
- Payments / paid plans
- Email delivery (notifications are in-app only; can add transactional email later)
- Native mobile app
