/*
  # Fix Experience Manager Access
  
  1. Changes
    - Update RLS policies for experiences table
    - Add manager type check for experience managers
    - Fix auth policies for proper access control
    
  2. Security
    - Ensure experience managers can only manage experiences
    - Maintain proper access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Managers can create experiences" ON experiences;
DROP POLICY IF EXISTS "Managers can update own experiences" ON experiences;
DROP POLICY IF EXISTS "Managers can delete own experiences" ON experiences;
DROP POLICY IF EXISTS "Managers can view all experiences" ON experiences;
DROP POLICY IF EXISTS "Public can view visible experiences" ON experiences;

-- Create updated policies for experiences

-- Allow experience managers to create experiences
CREATE POLICY "Experience managers can create experiences" ON experiences
FOR INSERT TO authenticated
WITH CHECK (
  auth.role() = 'authenticated' AND
  (
    auth.jwt()->>'role' = 'manager' AND
    (auth.jwt()->>'managerType')::text = 'experience'
  ) AND
  auth.uid() = created_by
);

-- Allow experience managers to update their own experiences
CREATE POLICY "Experience managers can update own experiences" ON experiences
FOR UPDATE TO authenticated
USING (
  auth.role() = 'authenticated' AND
  (
    auth.jwt()->>'role' = 'manager' AND
    (auth.jwt()->>'managerType')::text = 'experience'
  ) AND
  created_by = auth.uid()
)
WITH CHECK (
  auth.role() = 'authenticated' AND
  (
    auth.jwt()->>'role' = 'manager' AND
    (auth.jwt()->>'managerType')::text = 'experience'
  ) AND
  created_by = auth.uid()
);

-- Allow experience managers to delete their own experiences
CREATE POLICY "Experience managers can delete own experiences" ON experiences
FOR DELETE TO authenticated
USING (
  auth.role() = 'authenticated' AND
  (
    auth.jwt()->>'role' = 'manager' AND
    (auth.jwt()->>'managerType')::text = 'experience'
  ) AND
  created_by = auth.uid()
);

-- Allow experience managers to view all experiences
CREATE POLICY "Experience managers can view all experiences" ON experiences
FOR SELECT TO authenticated
USING (
  auth.role() = 'authenticated' AND
  (
    auth.jwt()->>'role' = 'manager' AND
    (auth.jwt()->>'managerType')::text = 'experience'
  )
);

-- Allow public to view visible experiences
CREATE POLICY "Public can view visible experiences" ON experiences
FOR SELECT TO public
USING (is_visible = true);

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

-- Allow experience managers to manage dates for their experiences
CREATE POLICY "Experience managers can manage dates" ON experience_dates
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM experiences e
    WHERE e.id = experience_id
    AND e.created_by = auth.uid()
    AND auth.jwt()->>'role' = 'manager'
    AND (auth.jwt()->>'managerType')::text = 'experience'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM experiences e
    WHERE e.id = experience_id
    AND e.created_by = auth.uid()
    AND auth.jwt()->>'role' = 'manager'
    AND (auth.jwt()->>'managerType')::text = 'experience'
  )
);