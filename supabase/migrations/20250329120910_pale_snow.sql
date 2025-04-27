/*
  # Database Schema Update
  
  1. Tables
    - Creates experiences table if not exists
    - Adds necessary constraints and triggers
  
  2. Security
    - Enables RLS
    - Creates policies for managers and public access
    
  3. Functions
    - Creates updated_at trigger function
*/

-- Create experiences table if it doesn't exist
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('art', 'education', 'wellness', 'creative')),
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

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_experiences_updated_at ON experiences;
CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Drop existing policies
DROP POLICY IF EXISTS "Managers can create experiences" ON experiences;
DROP POLICY IF EXISTS "Managers can update own experiences" ON experiences;
DROP POLICY IF EXISTS "Managers can delete own experiences" ON experiences;
DROP POLICY IF EXISTS "Managers can view all experiences" ON experiences;
DROP POLICY IF EXISTS "Public can view visible experiences" ON experiences;

-- Create policies
CREATE POLICY "Managers can create experiences" ON experiences
FOR INSERT TO authenticated
WITH CHECK (
  auth.jwt()->>'role' = 'manager'
);

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

CREATE POLICY "Managers can delete own experiences" ON experiences
FOR DELETE TO authenticated
USING (
  auth.jwt()->>'role' = 'manager'
  AND created_by = auth.uid()
);

CREATE POLICY "Managers can view all experiences" ON experiences
FOR SELECT TO authenticated
USING (
  auth.jwt()->>'role' = 'manager'
);

CREATE POLICY "Public can view visible experiences" ON experiences
FOR SELECT TO public
USING (is_visible = true);