/*
  # Fix RLS Policies and Storage Access
  
  1. Changes
    - Update RLS policies for experiences table
    - Add storage policies for images bucket
    - Fix query ordering requirements
    
  2. Security
    - Allow managers to manage experiences
    - Allow managers to upload images
    - Maintain public read access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Managers can create experiences" ON experiences;
DROP POLICY IF EXISTS "Managers can update own experiences" ON experiences;
DROP POLICY IF EXISTS "Managers can delete own experiences" ON experiences;
DROP POLICY IF EXISTS "Managers can view all experiences" ON experiences;
DROP POLICY IF EXISTS "Public can view visible experiences" ON experiences;

-- Create updated policies for experiences table
CREATE POLICY "Managers can create experiences" ON experiences
FOR INSERT TO authenticated
WITH CHECK (
  auth.role() = 'authenticated' AND
  auth.jwt()->>'role' = 'manager'
);

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

CREATE POLICY "Managers can delete own experiences" ON experiences
FOR DELETE TO authenticated
USING (
  auth.role() = 'authenticated' AND
  auth.jwt()->>'role' = 'manager' AND
  created_by = auth.uid()
);

CREATE POLICY "Managers can view all experiences" ON experiences
FOR SELECT TO authenticated
USING (
  auth.role() = 'authenticated' AND
  auth.jwt()->>'role' = 'manager'
);

CREATE POLICY "Public can view visible experiences" ON experiences
FOR SELECT TO public
USING (is_visible = true);

-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow manager uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow manager updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow manager deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public viewing" ON storage.objects;

-- Create updated storage policies
CREATE POLICY "Allow manager uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'images' AND
  auth.role() = 'authenticated' AND
  auth.jwt()->>'role' = 'manager'
);

CREATE POLICY "Allow manager updates" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'images' AND
  auth.role() = 'authenticated' AND
  auth.jwt()->>'role' = 'manager'
)
WITH CHECK (
  bucket_id = 'images' AND
  auth.role() = 'authenticated' AND
  auth.jwt()->>'role' = 'manager'
);

CREATE POLICY "Allow manager deletes" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'images' AND
  auth.role() = 'authenticated' AND
  auth.jwt()->>'role' = 'manager'
);

CREATE POLICY "Allow public viewing" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');