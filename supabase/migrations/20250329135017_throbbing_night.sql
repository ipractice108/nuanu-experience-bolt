/*
  # Add weekdays to experience_dates table

  1. Changes
    - Add weekdays array column to experience_dates table
    - Update constraints and validations
    - Add migration for existing data
*/

-- Add weekdays column to experience_dates
ALTER TABLE experience_dates
ADD COLUMN IF NOT EXISTS weekdays text[] DEFAULT NULL;

-- Add constraint to ensure weekdays are only set for weekly recurring events
ALTER TABLE experience_dates
ADD CONSTRAINT weekdays_only_for_weekly
CHECK (
  (recurrence_type != 'weekly' AND weekdays IS NULL) OR
  (recurrence_type = 'weekly' AND weekdays IS NOT NULL)
);

-- Update validate_experience_date function to handle weekdays
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
    -- Check if current date + 2 months is within allowed range
    IF CURRENT_DATE + INTERVAL '2 months' < CURRENT_DATE THEN
      RAISE EXCEPTION 'Recurring events cannot be scheduled more than 2 months in advance';
    END IF;

    -- Validate weekdays for weekly recurring events
    IF NEW.recurrence_type = 'weekly' AND (
      NEW.weekdays IS NULL OR 
      array_length(NEW.weekdays, 1) = 0
    ) THEN
      RAISE EXCEPTION 'Weekly recurring events must have at least one weekday selected';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;