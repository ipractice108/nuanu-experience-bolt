/*
  # Create Admin User and Permissions
  
  1. Changes
    - Create admin user with specified credentials
    - Set up admin role and permissions
    - Add admin to worker credentials
*/

-- Create admin user in worker_credentials
INSERT INTO worker_credentials (
  email,
  role,
  manager_type,
  name,
  is_active
) VALUES (
  'daniel@nuanu.com',
  'manager',
  'experience',
  'Daniel Admin',
  true
)
ON CONFLICT (email) DO UPDATE 
SET
  role = EXCLUDED.role,
  manager_type = EXCLUDED.manager_type,
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Create function to set user role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set admin role for specific email
  IF NEW.email = 'daniel@nuanu.com' THEN
    NEW.raw_user_meta_data = jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"'
    );
  -- Set default role if not provided
  ELSIF NEW.raw_user_meta_data->>'role' IS NULL THEN
    NEW.raw_user_meta_data = jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"member"'
    );
  END IF;

  RETURN NEW;
END;
$$;