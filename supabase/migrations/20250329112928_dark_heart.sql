/*
  # Create experiences table and related schemas

  1. New Tables
    - `experiences`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (enum)
      - `is_paid` (boolean)
      - `price` (integer, nullable)
      - `image_url` (text)
      - `created_by` (uuid, references auth.users)
      - `is_visible` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on experiences table
    - Add policies for CRUD operations
    - Managers can create/update their own experiences
    - Public can view visible experiences
*/

-- Create category enum type
CREATE TYPE experience_category AS ENUM ('art', 'education', 'wellness', 'creative');

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category experience_category NOT NULL,
  is_paid boolean NOT NULL DEFAULT false,
  price integer CHECK (price IS NULL OR price >= 0),
  image_url text,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  is_visible boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Add constraint to ensure paid experiences have a price
  CONSTRAINT paid_experiences_require_price 
    CHECK (NOT is_paid OR (is_paid AND price IS NOT NULL))
);

-- Enable RLS
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Policies

-- Allow managers to create experiences
CREATE POLICY "Managers can create experiences" ON experiences
FOR INSERT TO authenticated
WITH CHECK (
  auth.jwt()->>'role' = 'manager'
);

-- Allow managers to update their own experiences
CREATE POLICY "Managers can update own experiences" ON experiences
FOR UPDATE TO authenticated
USING (
  auth.jwt()->>'role' = 'manager'
  AND created_by = auth.uid()
)
WITH CHECK (
  auth.jwt()->>'role' = 'manager'
  AND created_by = auth.uid()
);

-- Allow managers to delete their own experiences
CREATE POLICY "Managers can delete own experiences" ON experiences
FOR DELETE TO authenticated
USING (
  auth.jwt()->>'role' = 'manager'
  AND created_by = auth.uid()
);

-- Allow managers to view all experiences
CREATE POLICY "Managers can view all experiences" ON experiences
FOR SELECT TO authenticated
USING (
  auth.jwt()->>'role' = 'manager'
);

-- Allow public to view visible experiences
CREATE POLICY "Public can view visible experiences" ON experiences
FOR SELECT TO public
USING (is_visible = true);