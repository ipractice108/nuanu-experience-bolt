/*
  # Update Experience Visibility Policies
  
  1. Changes
    - Add policies for public visibility
    - Update manager policies for full CRUD
    - Handle paid and free experiences
    
  2. Security
    - Maintain manager access control
    - Allow public to view visible experiences
    - Preserve existing RLS
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow managers to insert experiences" ON experiences;
DROP POLICY IF EXISTS "Managers can create experiences" ON experiences;
DROP POLICY IF EXISTS "Public can view visible experiences" ON experiences;
DROP POLICY IF EXISTS "Managers can update own experiences" ON experiences;
DROP POLICY IF EXISTS "Managers can delete own experiences" ON experiences;
DROP POLICY IF EXISTS "Managers can view all experiences" ON experiences;

-- Create comprehensive policies for experiences

-- Allow managers to create experiences
CREATE POLICY "Managers can create experiences" ON experiences
FOR INSERT TO authenticated
WITH CHECK (
  auth.role() = 'authenticated' AND
  auth.jwt()->>'role' = 'manager' AND
  auth.uid() = created_by
);

-- Allow managers to update their own experiences
CREATE POLICY "Managers can update own experiences" ON experiences
FOR UPDATE TO authenticated
USING (
  auth.role() = 'authenticated' AND
  auth.jwt()->>'role' = 'manager' AND
  created_by = auth.uid()
)
WITH CHECK (
  auth.role() = 'authenticated' AND
  auth.jwt()->>'role' = 'manager' AND
  created_by = auth.uid()
);

-- Allow managers to delete their own experiences
CREATE POLICY "Managers can delete own experiences" ON experiences
FOR DELETE TO authenticated
USING (
  auth.role() = 'authenticated' AND
  auth.jwt()->>'role' = 'manager' AND
  created_by = auth.uid()
);

-- Allow managers to view all experiences
CREATE POLICY "Managers can view all experiences" ON experiences
FOR SELECT TO authenticated
USING (
  auth.role() = 'authenticated' AND
  auth.jwt()->>'role' = 'manager'
);

-- Allow public to view visible experiences
CREATE POLICY "Public can view visible experiences" ON experiences
FOR SELECT TO public
USING (is_visible = true);

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS experiences_visibility_idx ON experiences(is_visible);

-- Update experience dates policies
DROP POLICY IF EXISTS "Public can view dates" ON experience_dates;
DROP POLICY IF EXISTS "Managers can manage dates" ON experience_dates;

-- Allow public to view dates for visible experiences
CREATE POLICY "Public can view dates" ON experience_dates
FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM experiences e
    WHERE e.id = experience_id
    AND e.is_visible = true
  )
);

-- Allow managers to manage dates for their experiences
CREATE POLICY "Managers can manage dates" ON experience_dates
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM experiences e
    WHERE e.id = experience_id
    AND e.created_by = auth.uid()
    AND auth.jwt()->>'role' = 'manager'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM experiences e
    WHERE e.id = experience_id
    AND e.created_by = auth.uid()
    AND auth.jwt()->>'role' = 'manager'
  )
);