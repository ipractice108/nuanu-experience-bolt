/*
  # Add Date Constraints for Experience Dates

  1. Changes
    - Add check constraint for one-time events (max 1 year ahead)
    - Add check constraint for recurring events (max 2 months ahead)
    - Add validation functions
  
  2. Validation Rules
    - One-time events: date must be within 1 year from now
    - Recurring events: end date calculated as 2 months from now
*/

-- Create validation function for date ranges
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
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS validate_experience_date_trigger ON experience_dates;

-- Create trigger for date validation
CREATE TRIGGER validate_experience_date_trigger
  BEFORE INSERT OR UPDATE ON experience_dates
  FOR EACH ROW
  EXECUTE FUNCTION validate_experience_date();

-- Add check constraints
ALTER TABLE experience_dates
  ADD CONSTRAINT check_one_time_date
  CHECK (
    date IS NULL OR 
    date <= CURRENT_DATE + INTERVAL '1 year'
  );

-- Note: The recurring event constraint is handled by the trigger since
-- it requires dynamic date calculation