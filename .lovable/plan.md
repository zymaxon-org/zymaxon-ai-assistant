# AI Fraud Detection Edge Function

## Goal

Add a `tt-fraud-check` Supabase edge function that runs heuristic + AI-assisted fraud analysis and writes results into `tt_fraud_flags` and `tt_audit_logs`. Wire it into the scan flow (and a manual admin trigger).

## Detection rules

1. **Multi-country scan burst** — same `qr_code_id` scanned from >2 distinct `ip_country` values within 24h → severity `high`, reason `multi_country_burst`.
2. **Duplicate serial numbers** — same `serial_number` (non-empty) across >1 `tt_items` rows → severity `high`, reason `duplicate_serial`. One flag per serial.
3. **Suspicious transfers** — item with >3 completed transfers in 30 days, OR a transfer chain where the same item bounces between two users → severity `medium`, reason `rapid_transfer_chain`.
4. **Counterfeit pattern** — QR token scanned >20 times in 1h from >5 countries, OR scan ratio of `invalid` results >50% over last 50 scans → severity `high`, reason `counterfeit_pattern`.
5. **AI layer** — for any flagged entity, send a compact JSON summary (counts, countries, timestamps, item meta) to Lovable AI Gateway (`google/gemini-2.5-flash`) which returns `{ severity, confidence, explanation, recommended_action }`. AI severity overrides heuristic when confidence ≥ 0.7. Explanation is stored in `metadata.ai_explanation`.

## Edge function: `tt-fraud-check`

- Path: `supabase/functions/tt-fraud-check/index.ts`
- Public CORS, no JWT required (called on every public scan). For the admin `mode=full` sweep, requires JWT + admin role.
- Input: `{ mode: "scan" | "transfer" | "full", qr_code_id?, item_id?, transfer_id? }`.
- Uses `SUPABASE_SERVICE_ROLE_KEY` to read across RLS.
- Uses `LOVABLE_API_KEY` (already provisioned for Lovable AI Gateway) — no user secret needed.
- Writes:
  - `tt_fraud_flags` (one row per distinct reason+entity, dedup via select-before-insert on unresolved open flags).
  - `tt_audit_logs` with `action='fraud_check'`, `target_type='qr_code'|'item'|'transfer'`, `metadata` includes rule, counts, AI verdict. Uses a NULL `actor_user_id` — see migration note.
  - `tt_notifications` to the item owner when a `high` severity flag fires on their item.

## Migration (small)

- Allow system-inserted audit rows: relax `tt_audit_logs` INSERT policy so service role / NULL actor entries are accepted (add policy `Service inserts audit` with `WITH CHECK (actor_user_id IS NULL OR auth.uid() = actor_user_id)`).
- Add unique partial index to prevent duplicate open flags: `CREATE UNIQUE INDEX tt_fraud_flags_open_uniq ON tt_fraud_flags(entity_type, entity_id, reason) WHERE resolved = false;`

## Wiring

- `src/components/trusttag/verify/VerifyPage.tsx`: after inserting the scan row, fire-and-forget `supabase.functions.invoke('tt-fraud-check', { body: { mode: 'scan', qr_code_id }})`. No await on UI critical path.
- `src/components/trusttag/user/TransfersPage.tsx`: invoke with `mode: 'transfer', transfer_id` after a transfer is created/accepted.
- `src/components/trusttag/admin/AdminFraud.tsx`: add a "Run full sweep" button that invokes `mode: 'full'` and reloads the flag list.

## Out of scope

- Email/SMS alerts (notifications stay in-app)
- ML model training (uses Gemini via Lovable AI Gateway)
- Auto-locking items (admin still resolves manually)

## Files

- `supabase/migrations/<timestamp>_tt_fraud_audit.sql` (policy + index)
- `supabase/functions/tt-fraud-check/index.ts` (new)
- `src/components/trusttag/verify/VerifyPage.tsx` (1 invoke call)
- `src/components/trusttag/user/TransfersPage.tsx` (1 invoke call)
- `src/components/trusttag/admin/AdminFraud.tsx` (sweep button)  
  
only UI for now