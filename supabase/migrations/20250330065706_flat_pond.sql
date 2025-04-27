/*
  # Add Delicious Manager Support
  
  1. Changes
    - Add delicious manager type to worker_credentials
    - Update constraints and policies
    - Add test account
*/

-- Update worker_credentials table to support delicious manager
ALTER TABLE worker_credentials
DROP CONSTRAINT IF EXISTS worker_credentials_check;

ALTER TABLE worker_credentials
ADD CONSTRAINT worker_credentials_check
CHECK (
  (role = 'manager' AND manager_type IN ('experience', 'stay', 'delicious')) OR
  (role != 'manager' AND manager_type IS NULL)
);

-- Insert delicious manager test account
INSERT INTO worker_credentials (email, role, manager_type, name, is_active)
VALUES ('delicious@nuanu.com', 'manager', 'delicious', 'Delicious Manager', true)
ON CONFLICT (email) DO UPDATE 
SET
  role = EXCLUDED.role,
  manager_type = EXCLUDED.manager_type,
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active,
  updated_at = now();