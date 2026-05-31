
-- Allow service-role inserts (NULL actor) into audit logs while keeping authenticated-user inserts scoped to themselves
DROP POLICY IF EXISTS "Anyone insert audit (server)" ON public.tt_audit_logs;
CREATE POLICY "Authenticated insert own audit"
  ON public.tt_audit_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = actor_user_id);
CREATE POLICY "Service insert audit"
  ON public.tt_audit_logs FOR INSERT TO service_role
  WITH CHECK (true);

-- Prevent duplicate unresolved fraud flags for the same entity+reason
CREATE UNIQUE INDEX IF NOT EXISTS tt_fraud_flags_open_uniq
  ON public.tt_fraud_flags (entity_type, entity_id, reason)
  WHERE resolved = false;
