/*
  # Add pricing to experience dates
  
  1. New Columns
    - `is_paid` (boolean) - Whether this specific time slot is paid
    - `price` (integer) - Price for this specific time slot
    
  2. Changes
    - Move pricing from experiences to experience_dates
    - Add constraints for paid sessions
*/

-- Add pricing columns to experience_dates
ALTER TABLE experience_dates
ADD COLUMN is_paid boolean NOT NULL DEFAULT false,
ADD COLUMN price integer CHECK (price IS NULL OR price >= 0);

-- Add constraint to ensure paid sessions have a price
ALTER TABLE experience_dates
ADD CONSTRAINT paid_sessions_require_price
CHECK (NOT is_paid OR (is_paid AND price IS NOT NULL));

-- Remove price constraints from experiences table
ALTER TABLE experiences
DROP CONSTRAINT IF EXISTS paid_experiences_require_price;

-- Update experiences table
ALTER TABLE experiences
ALTER COLUMN is_paid DROP NOT NULL,
ALTER COLUMN is_paid SET DEFAULT false;