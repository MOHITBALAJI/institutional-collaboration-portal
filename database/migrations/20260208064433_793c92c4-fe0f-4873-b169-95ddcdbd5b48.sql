-- Fix the permissive INSERT policy on notifications
-- The notifications should only be inserted by the system (triggers) or admins
DROP POLICY "System can insert notifications" ON public.notifications;

-- More restrictive insert policy - only admin or system triggers can insert
CREATE POLICY "Admin can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));