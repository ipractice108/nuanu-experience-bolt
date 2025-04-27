/*
  # Update RLS Policies for Experiences Table
  
  1. Changes
    - Enable RLS on experiences table
    - Add policy for managers to insert experiences
    - Ensure proper user role checks
    
  2. Security
    - Verify user role is manager
    - Ensure created_by matches auth.uid()
*/

-- Enable RLS on experiences table
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow managers to insert experiences" ON experiences;
DROP POLICY IF EXISTS "Managers can create experiences" ON experiences;

-- Create policy for managers to insert experiences
CREATE POLICY "Allow managers to insert experiences"
ON experiences
FOR INSERT
TO authenticated
WITH CHECK (
  auth.role() = 'authenticated' AND
  auth.jwt()->>'role' = 'manager' AND
  auth.uid() = created_by
);