/*
  # Fix storage policies for JWT role check

  1. Security Updates
    - Update policies to properly check JWT claims
    - Allow managers to upload images
    - Maintain public viewing access
    - Add proper role-based access control
  
  2. Changes
    - Drop existing policies
    - Create new role-based policies with proper JWT role check
    - Keep bucket public for viewing
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow manager uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow manager updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow manager deletes" ON storage.objects;

-- Policy to allow managers to upload files
CREATE POLICY "Allow manager uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
  AND auth.jwt() ? 'role'
  AND auth.jwt()->>'role' = 'manager'
);

-- Policy to allow managers to update their files
CREATE POLICY "Allow manager updates" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
  AND auth.jwt() ? 'role'
  AND auth.jwt()->>'role' = 'manager'
)
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
  AND auth.jwt() ? 'role'
  AND auth.jwt()->>'role' = 'manager'
);

-- Policy to allow managers to delete their files
CREATE POLICY "Allow manager deletes" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
  AND auth.jwt() ? 'role'
  AND auth.jwt()->>'role' = 'manager'
);

-- Keep the public viewing policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow public viewing'
  ) THEN
    CREATE POLICY "Allow public viewing" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'images');
  END IF;
END
$$;