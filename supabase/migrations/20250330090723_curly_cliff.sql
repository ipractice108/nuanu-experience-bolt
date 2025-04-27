/*
  # Remove Duplicate Experiences
  
  1. Changes
    - Find and remove duplicate experiences based on name
    - Keep the most recently updated version
    - Add unique constraint to prevent future duplicates
    
  2. Data Integrity
    - Preserve experience dates
    - Maintain relationships
*/

-- Create a temporary table to store duplicates
CREATE TEMP TABLE duplicate_experiences AS
WITH duplicates AS (
  SELECT 
    id,
    name,
    created_by,
    updated_at,
    ROW_NUMBER() OVER (
      PARTITION BY name, created_by 
      ORDER BY updated_at DESC
    ) as row_num
  FROM experiences
)
SELECT id
FROM duplicates
WHERE row_num > 1;

-- Delete duplicate experiences while preserving relationships
DELETE FROM experiences
WHERE id IN (
  SELECT id FROM duplicate_experiences
);

-- Drop temporary table
DROP TABLE duplicate_experiences;

-- Add unique constraint to prevent future duplicates
ALTER TABLE experiences
ADD CONSTRAINT unique_experience_name_per_manager
UNIQUE (name, created_by);