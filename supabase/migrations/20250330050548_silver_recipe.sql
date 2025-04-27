/*
  # Update Authentication System
  
  1. Changes
    - Add default test accounts
    - Update auth policies
    - Ensure proper role assignment
    
  2. Security
    - Maintain RLS policies
    - Keep existing permissions
*/

-- Insert test accounts into worker_credentials
INSERT INTO worker_credentials (email, role, manager_type, name, is_active) VALUES
  -- Experience Managers
  ('experience@nuanu.com', 'manager', 'experience', 'Experience Manager', true),
  
  -- Stay Managers
  ('stay@nuanu.com', 'manager', 'stay', 'Stay Manager', true),
  
  -- Guides
  ('guide@nuanu.com', 'guide', NULL, 'Guide User', true),
  
  -- Admin (if not exists)
  ('daniel@nuanu.com', 'manager', 'experience', 'Daniel Admin', true)
ON CONFLICT (email) DO UPDATE 
SET
  role = EXCLUDED.role,
  manager_type = EXCLUDED.manager_type,
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Update handle_new_user function to handle all roles
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
  SELECT role, manager_type, name
  INTO worker_record 
  FROM worker_credentials 
  WHERE email = NEW.email 
  AND is_active = true;

  -- Set role and metadata based on email or worker_credentials
  IF NEW.email = 'daniel@nuanu.com' THEN
    NEW.raw_user_meta_data = jsonb_build_object(
      'role', 'admin',
      'name', 'Daniel Admin'
    );
  ELSIF worker_record.role IS NOT NULL THEN
    NEW.raw_user_meta_data = jsonb_build_object(
      'role', worker_record.role,
      'name', worker_record.name,
      'managerType', worker_record.manager_type
    );
  ELSE
    -- Default to member role for new users
    NEW.raw_user_meta_data = jsonb_build_object(
      'role', 'member',
      'name', split_part(NEW.email, '@', 1)
    );
  END IF;

  RETURN NEW;
END;
$$;