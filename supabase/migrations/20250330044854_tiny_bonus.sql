/*
  # Create worker credentials table and policies
  
  1. Tables
    - Create worker_credentials table if not exists
    - Add constraints for role types
    - Add validation for manager types
  
  2. Security
    - Enable RLS
    - Add admin-only policies
    - Insert initial worker data
*/

-- Create worker_credentials table
CREATE TABLE IF NOT EXISTS worker_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('manager', 'guide')),
  manager_type text CHECK (
    (role = 'manager' AND manager_type IN ('experience', 'stay')) OR
    (role != 'manager' AND manager_type IS NULL)
  ),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  
  -- Add constraint to ensure valid role/type combinations
  CONSTRAINT valid_role_type_combination CHECK (
    (role = 'manager' AND manager_type IS NOT NULL) OR
    (role = 'guide' AND manager_type IS NULL)
  )
);

-- Enable RLS
ALTER TABLE worker_credentials ENABLE ROW LEVEL SECURITY;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_worker_credentials_updated_at ON worker_credentials;
CREATE TRIGGER update_worker_credentials_updated_at
  BEFORE UPDATE ON worker_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage worker credentials" ON worker_credentials;

-- Create policies
CREATE POLICY "Admins can manage worker credentials"
ON worker_credentials
FOR ALL TO authenticated
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id
    AND raw_user_meta_data->>'role' = 'admin'
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Insert initial data
INSERT INTO worker_credentials (email, role, manager_type, name) VALUES
  -- Experience Managers
  ('emma.davis@nuanu.com', 'manager', 'experience', 'Emma Davis'),
  ('michael.chen@nuanu.com', 'manager', 'experience', 'Michael Chen'),
  ('sofia.patel@nuanu.com', 'manager', 'experience', 'Sofia Patel'),
  
  -- Stay Managers
  ('lucas.silva@nuanu.com', 'manager', 'stay', 'Lucas Silva'),
  ('sarah.kim@nuanu.com', 'manager', 'stay', 'Sarah Kim'),
  ('james.wilson@nuanu.com', 'manager', 'stay', 'James Wilson'),
  
  -- Guides
  ('ana.martinez@nuanu.com', 'guide', NULL, 'Ana Martinez'),
  ('david.lee@nuanu.com', 'guide', NULL, 'David Lee'),
  ('maya.patel@nuanu.com', 'guide', NULL, 'Maya Patel')
ON CONFLICT (email) DO UPDATE 
SET
  role = EXCLUDED.role,
  manager_type = EXCLUDED.manager_type,
  name = EXCLUDED.name,
  updated_at = now();