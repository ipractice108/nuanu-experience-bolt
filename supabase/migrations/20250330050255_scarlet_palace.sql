/*
  # Update RLS policies for admin access
  
  1. Changes
    - Allow admins to manage all experiences
    - Update policies to include admin role
    - Maintain existing manager access
    
  2. Security
    - Keep existing RLS enabled
    - Add admin privileges
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Experience managers can create experiences" ON experiences;
DROP POLICY IF EXISTS "Experience managers can update own experiences" ON experiences;
DROP POLICY IF EXISTS "Experience managers can delete own experiences" ON experiences;
DROP POLICY IF EXISTS "Experience managers can view all experiences" ON experiences;
DROP POLICY IF EXISTS "Public can view visible experiences" ON experiences;

-- Create updated policies for experiences

-- Allow admins and experience managers to create experiences
CREATE POLICY "Allow experience creation"
ON experiences
FOR INSERT TO authenticated
WITH CHECK (
  (auth.jwt()->>'role' = 'admin') OR
  (
    auth.jwt()->>'role' = 'manager' AND
    (auth.jwt()->>'managerType')::text = 'experience' AND
    auth.uid() = created_by
  )
);

-- Allow admins and experience managers to update experiences
CREATE POLICY "Allow experience updates"
ON experiences
FOR UPDATE TO authenticated
USING (
  (auth.jwt()->>'role' = 'admin') OR
  (
    auth.jwt()->>'role' = 'manager' AND
    (auth.jwt()->>'managerType')::text = 'experience' AND
    created_by = auth.uid()
  )
)
WITH CHECK (
  (auth.jwt()->>'role' = 'admin') OR
  (
    auth.jwt()->>'role' = 'manager' AND
    (auth.jwt()->>'managerType')::text = 'experience' AND
    created_by = auth.uid()
  )
);

-- Allow admins and experience managers to delete experiences
CREATE POLICY "Allow experience deletion"
ON experiences
FOR DELETE TO authenticated
USING (
  (auth.jwt()->>'role' = 'admin') OR
  (
    auth.jwt()->>'role' = 'manager' AND
    (auth.jwt()->>'managerType')::text = 'experience' AND
    created_by = auth.uid()
  )
);

-- Allow admins and experience managers to view all experiences
CREATE POLICY "Allow experience viewing"
ON experiences
FOR SELECT TO authenticated
USING (
  (auth.jwt()->>'role' = 'admin') OR
  (
    auth.jwt()->>'role' = 'manager' AND
    (auth.jwt()->>'managerType')::text = 'experience'
  )
);

-- Allow public to view visible experiences
CREATE POLICY "Public can view visible experiences"
ON experiences
FOR SELECT TO public
USING (is_visible = true);

-- Update experience dates policies
DROP POLICY IF EXISTS "Public can view dates" ON experience_dates;
DROP POLICY IF EXISTS "Experience managers can manage dates" ON experience_dates;

-- Allow public to view dates for visible experiences
CREATE POLICY "Public can view dates"
ON experience_dates
FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM experiences e
    WHERE e.id = experience_id
    AND e.is_visible = true
  )
);

-- Allow admins and experience managers to manage dates
CREATE POLICY "Allow date management"
ON experience_dates
FOR ALL TO authenticated
USING (
  (auth.jwt()->>'role' = 'admin') OR
  EXISTS (
    SELECT 1 FROM experiences e
    WHERE e.id = experience_id
    AND (
      (auth.jwt()->>'role' = 'admin') OR
      (
        auth.jwt()->>'role' = 'manager' AND
        (auth.jwt()->>'managerType')::text = 'experience' AND
        e.created_by = auth.uid()
      )
    )
  )
)
WITH CHECK (
  (auth.jwt()->>'role' = 'admin') OR
  EXISTS (
    SELECT 1 FROM experiences e
    WHERE e.id = experience_id
    AND (
      (auth.jwt()->>'role' = 'admin') OR
      (
        auth.jwt()->>'role' = 'manager' AND
        (auth.jwt()->>'managerType')::text = 'experience' AND
        e.created_by = auth.uid()
      )
    )
  )
);