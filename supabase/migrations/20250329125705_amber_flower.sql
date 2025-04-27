/*
  # Add Experience Dates Table

  1. New Tables
    - `experience_dates`
      - `id` (uuid, primary key)
      - `experience_id` (uuid, references experiences)
      - `date` (date, nullable)
      - `start_time` (time)
      - `end_time` (time)
      - `is_recurring` (boolean)
      - `recurrence_type` (text: 'daily' or 'weekly')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for managers and public
    - Add constraints for date/recurrence logic
*/

-- Drop existing table and related objects if they exist
DROP TABLE IF EXISTS experience_dates CASCADE;

-- Create experience_dates table
CREATE TABLE experience_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid REFERENCES experiences(id) ON DELETE CASCADE,
  date date,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_recurring boolean DEFAULT false,
  recurrence_type text CHECK (recurrence_type IN ('daily', 'weekly') OR recurrence_type IS NULL),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure either date or recurrence is set
  CONSTRAINT date_or_recurrence CHECK (
    (date IS NOT NULL AND recurrence_type IS NULL) OR
    (date IS NULL AND recurrence_type IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE experience_dates ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER update_experience_dates_updated_at
  BEFORE UPDATE ON experience_dates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Policies for experience_dates
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

-- Public can view dates
CREATE POLICY "Public can view dates" ON experience_dates
FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM experiences e
    WHERE e.id = experience_id
    AND e.is_visible = true
  )
);