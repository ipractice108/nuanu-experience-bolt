/*
  # Add weekly schedule fields
  
  1. Changes
    - Add weekly_start and weekly_end columns to experience_dates
    - Update constraints and validation
    
  2. Data
    - Add date range for weekly schedules
    - Ensure proper validation of date ranges
*/

-- Add weekly schedule columns
ALTER TABLE experience_dates
ADD COLUMN IF NOT EXISTS weekly_start date,
ADD COLUMN IF NOT EXISTS weekly_end date;

-- Update validate_experience_date function to handle weekly schedule
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