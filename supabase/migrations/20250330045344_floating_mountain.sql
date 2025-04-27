/*
  # Fix Worker Credentials Permissions
  
  1. Changes
    - Update RLS policies for worker_credentials table
    - Add admin access to users table
    - Fix policy checks for proper role validation
    
  2. Security
    - Ensure admins can manage worker credentials
    - Maintain proper access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage worker credentials" ON worker_credentials;

-- Create updated policy for worker credentials
CREATE POLICY "Admins can manage worker credentials"
ON worker_credentials
FOR ALL TO authenticated
USING (
  auth.role() = 'authenticated' AND
  (auth.jwt()->>'role')::text = 'admin'
)
WITH CHECK (
  auth.role() = 'authenticated' AND
  (auth.jwt()->>'role')::text = 'admin'
);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON worker_credentials TO authenticated;

-- Create policy for admins to view users
CREATE POLICY "Admins can view users"
ON auth.users
FOR SELECT TO authenticated
USING (
  auth.role() = 'authenticated' AND
  (auth.jwt()->>'role')::text = 'admin'
);

-- Create policy for admins to update users
CREATE POLICY "Admins can update users"
ON auth.users
FOR UPDATE TO authenticated
USING (
  auth.role() = 'authenticated' AND
  (auth.jwt()->>'role')::text = 'admin'
)
WITH CHECK (
  auth.role() = 'authenticated' AND
  (auth.jwt()->>'role')::text = 'admin'
);

-- Update handle_new_user function to handle worker credentials
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  worker_record RECORD;
BEGIN
  -- Check if user exists in worker_credentials
  SELECT role, manager_type 
  INTO worker_record 
  FROM worker_credentials 
  WHERE email = NEW.email 
  AND is_active = true;

  -- Set role based on worker_credentials or default to member
  IF NEW.email = 'daniel@nuanu.com' THEN
    NEW.raw_user_meta_data = jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"'
    );
  ELSIF worker_record.role IS NOT NULL THEN
    NEW.raw_user_meta_data = jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      ('"' || worker_record.role || '"')::jsonb
    );
    
    IF worker_record.manager_type IS NOT NULL THEN
      NEW.raw_user_meta_data = jsonb_set(
        NEW.raw_user_meta_data,
        '{managerType}',
        ('"' || worker_record.manager_type || '"')::jsonb
      );
    END IF;
  ELSE
    NEW.raw_user_meta_data = jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"member"'
    );
  END IF;

  RETURN NEW;
END;
$$;