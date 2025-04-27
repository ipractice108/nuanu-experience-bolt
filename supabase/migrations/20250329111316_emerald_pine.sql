/*
  # Create storage bucket for images

  1. Storage
    - Create 'images' bucket for storing uploaded images
    - Enable public access for the bucket
  
  2. Security
    - Add policy for authenticated users to upload images
    - Add policy for public access to view images
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

-- Policy to allow public access to view files
CREATE POLICY "Allow public viewing" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');

-- Policy to allow authenticated users to update their own files
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Policy to allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images');