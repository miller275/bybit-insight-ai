-- Fix overly permissive audit_log insert policy
DROP POLICY IF EXISTS "Service can insert audit log" ON public.audit_log;
CREATE POLICY "Authenticated users can insert audit log" ON public.audit_log FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);