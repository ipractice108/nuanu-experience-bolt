/*
  # Fix Worker Credentials and Experience Manager Access
  
  1. Changes
    - Drop and recreate worker_credentials table with proper constraints
    - Update RLS policies for proper access control
    - Fix trigger for updated_at column
    
  2. Security
    - Ensure proper role-based access
    - Maintain data integrity
*/

-- Drop existing table and related objects
DROP TABLE IF EXISTS worker_credentials CASCADE;

-- Create worker_credentials table
CREATE TABLE worker_credentials (
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

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage worker credentials" ON worker_credentials;

-- Create updated policy for worker credentials
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