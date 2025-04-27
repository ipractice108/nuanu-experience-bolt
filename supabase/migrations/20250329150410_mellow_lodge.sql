/*
  # Add locations table and location_id to experiences
  
  1. New Tables
    - `locations` table for storing location information
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `logo` (text)
      - `category` (text)
  
  2. Changes
    - Create locations table
    - Add location_id to experiences table
    - Add foreign key constraint
    - Add necessary indexes
*/

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  logo text,
  category text NOT NULL CHECK (
    category IN (
      'education',
      'art',
      'wellness',
      'community',
      'nature',
      'coworking'
    )
  ),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on locations
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Create policies for locations
CREATE POLICY "Public can view locations" ON locations
FOR SELECT TO public
USING (true);

-- Add location_id column to experiences
ALTER TABLE experiences 
ADD COLUMN IF NOT EXISTS location_id uuid REFERENCES locations(id);

-- Create index for foreign key
CREATE INDEX IF NOT EXISTS experiences_location_id_idx ON experiences(location_id);

-- Insert initial locations
INSERT INTO locations (id, name, description, logo, category) VALUES
  ('123e4567-e89b-12d3-a456-426614174000', 'Jungle Kids', 'Nature-based learning center for children', 'https://images.unsplash.com/photo-1459908676235-d5f02a50184b?auto=format&fit=crop&q=80', 'education'),
  ('123e4567-e89b-12d3-a456-426614174001', 'Pro Ed', 'Professional education and training center', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80', 'education'),
  ('123e4567-e89b-12d3-a456-426614174002', 'Art Village', 'Creative hub for artists and art enthusiasts', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80', 'art'),
  ('123e4567-e89b-12d3-a456-426614174003', 'Pasar Nusantara', 'Traditional market and cultural center', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80', 'community'),
  ('123e4567-e89b-12d3-a456-426614174004', 'Nuanu Mall', 'Sustainable shopping and lifestyle center', 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&q=80', 'community'),
  ('123e4567-e89b-12d3-a456-426614174005', 'Aurora Media Park', 'Digital media and entertainment hub', 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80', 'art'),
  ('123e4567-e89b-12d3-a456-426614174006', 'Earth Sentinels', 'Environmental education and conservation center', 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80', 'nature'),
  ('123e4567-e89b-12d3-a456-426614174007', 'THK Tower', 'Modern coworking and office space', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80', 'coworking'),
  ('123e4567-e89b-12d3-a456-426614174008', 'Luna Beach Club', 'Beachfront wellness and leisure club', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80', 'wellness'),
  ('123e4567-e89b-12d3-a456-426614174009', 'Oshom', 'Holistic wellness and healing center', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80', 'wellness'),
  ('123e4567-e89b-12d3-a456-426614174010', 'Ash', 'Contemporary art gallery and performance space', 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80', 'art'),
  ('123e4567-e89b-12d3-a456-426614174011', 'Odyssey Garden', 'Botanical garden and educational center', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80', 'nature'),
  ('123e4567-e89b-12d3-a456-426614174012', 'Labyrinth Residence', 'Artist residency and creative space', 'https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80', 'art'),
  ('123e4567-e89b-12d3-a456-426614174013', 'Sol Studio', 'Music and sound production studio', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80', 'art'),
  ('123e4567-e89b-12d3-a456-426614174014', 'Long House', 'Traditional architecture and cultural center', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80', 'community'),
  ('123e4567-e89b-12d3-a456-426614174015', 'Block 42', 'Urban farming and sustainability center', 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80', 'nature'),
  ('123e4567-e89b-12d3-a456-426614174016', 'Horizon Glassworks', 'Glass art studio and workshop space', 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80', 'art'),
  ('123e4567-e89b-12d3-a456-426614174017', 'Phoenix Lab', 'Innovation and technology hub', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80', 'education'),
  ('123e4567-e89b-12d3-a456-426614174018', 'Labyrinth Gallery', 'Contemporary art exhibition space', 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&q=80', 'art'),
  ('123e4567-e89b-12d3-a456-426614174019', 'Labyrinth Dome', 'Immersive art and performance venue', 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80', 'art'),
  ('123e4567-e89b-12d3-a456-426614174020', 'Magic Garden', 'Children''s nature play and learning space', 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&q=80', 'nature'),
  ('123e4567-e89b-12d3-a456-426614174021', 'Pacha Alpaca', 'Animal therapy and education center', 'https://images.unsplash.com/photo-1552474705-dd8183e00901?auto=format&fit=crop&q=80', 'nature'),
  ('123e4567-e89b-12d3-a456-426614174022', 'Red Tent', 'Women''s wellness and community space', 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80', 'wellness'),
  ('123e4567-e89b-12d3-a456-426614174023', 'Lumeira', 'Meditation and mindfulness center', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80', 'wellness'),
  ('123e4567-e89b-12d3-a456-426614174024', 'Connect', 'Community gathering and event space', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80', 'community')
ON CONFLICT (id) DO UPDATE 
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  logo = EXCLUDED.logo,
  category = EXCLUDED.category,
  updated_at = now();

-- Update validate_experience_date function
CREATE OR REPLACE FUNCTION validate_experience_date()
RETURNS trigger AS $$
BEGIN
  -- For one-time events
  IF NEW.date IS NOT NULL THEN
    -- Check if date is not more than 1 year in the future
    IF NEW.date > CURRENT_DATE + INTERVAL '1 year' THEN
      RAISE EXCEPTION 'One-time events cannot be scheduled more than 1 year in advance';
    END IF;
  END IF;

  -- For recurring events
  IF NEW.is_recurring = true THEN
    -- For weekly events, validate date range
    IF NEW.recurrence_type = 'weekly' THEN
      -- Ensure both start and end dates are provided
      IF NEW.weekly_start IS NULL OR NEW.weekly_end IS NULL THEN
        RAISE EXCEPTION 'Weekly events must have both start and end dates';
      END IF;

      -- Validate date range (max 2 months)
      IF NEW.weekly_end > NEW.weekly_start + INTERVAL '2 months' THEN
        RAISE EXCEPTION 'Weekly events cannot be scheduled for more than 2 months';
      END IF;

      -- Ensure start date is not in the past
      IF NEW.weekly_start < CURRENT_DATE THEN
        RAISE EXCEPTION 'Start date cannot be in the past';
      END IF;

      -- Ensure end date is after start date
      IF NEW.weekly_end <= NEW.weekly_start THEN
        RAISE EXCEPTION 'End date must be after start date';
      END IF;

      -- Validate weekdays
      IF NEW.weekdays IS NULL OR array_length(NEW.weekdays, 1) = 0 THEN
        RAISE EXCEPTION 'Weekly recurring events must have at least one weekday selected';
      END IF;
    ELSE
      -- For daily events, check the 2-month limit
      IF CURRENT_DATE + INTERVAL '2 months' < CURRENT_DATE THEN
        RAISE EXCEPTION 'Recurring events cannot be scheduled more than 2 months in advance';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;