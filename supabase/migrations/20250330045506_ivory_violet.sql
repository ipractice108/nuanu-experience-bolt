/*
  # Fix Worker Credentials RLS Policies
  
  1. Changes
    - Update RLS policies to properly check admin role
    - Simplify policy checks
    - Add proper JWT validation
    
  2. Security
    - Ensure admins can manage worker credentials
    - Maintain proper access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage worker credentials" ON worker_credentials;

-- Create updated policy for worker credentials with simpler check
CREATE POLICY "Admins can manage worker credentials"
ON worker_credentials
FOR ALL TO authenticated
USING (
  auth.jwt()->>'role' = 'admin'
)
WITH CHECK (
  auth.jwt()->>'role' = 'admin'
);

-- Grant necessary permissions
GRANT ALL ON worker_credentials TO authenticated;

-- Update handle_new_user function to properly set admin role
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