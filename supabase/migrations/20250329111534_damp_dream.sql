/*
  # Fix storage policies for manager uploads

  1. Security Updates
    - Update policies to check user role
    - Allow managers to upload images
    - Maintain public viewing access
    - Add role-based access control
  
  2. Changes
    - Drop existing policies
    - Create new role-based policies
    - Keep bucket public for viewing
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Policy to allow managers to upload files
CREATE POLICY "Allow manager uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'images' 
  AND auth.jwt()->>'role' IN ('manager')
);

-- Policy to allow managers to update their files
CREATE POLICY "Allow manager updates" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'images' 
  AND auth.jwt()->>'role' IN ('manager')
)
WITH CHECK (
  bucket_id = 'images' 
  AND auth.jwt()->>'role' IN ('manager')
);

-- Policy to allow managers to delete their files
CREATE POLICY "Allow manager deletes" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'images' 
  AND auth.jwt()->>'role' IN ('manager')
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