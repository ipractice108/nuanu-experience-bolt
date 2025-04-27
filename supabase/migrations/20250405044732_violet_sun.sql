/*
  # Add foreign key relationship between experiences and worker_credentials
  
  1. Changes
    - Create worker records for existing experiences
    - Add foreign key constraint
    
  2. Security
    - Maintain data integrity
    - Preserve existing relationships
*/

-- First, ensure worker records exist for all experience creators
INSERT INTO worker_credentials (id, email, role, manager_type, name)
SELECT DISTINCT
  created_by as id,
  'experience.manager.' || created_by || '@nuanu.com' as email,
  'manager' as role,
  'experience' as manager_type,
  'Experience Manager ' || created_by as name
FROM experiences e
WHERE NOT EXISTS (
  SELECT 1 FROM worker_credentials w 
  WHERE w.id = e.created_by
);

-- Now we can safely add the foreign key constraint
ALTER TABLE experiences
ADD CONSTRAINT experiences_created_by_worker_fkey
FOREIGN KEY (created_by) REFERENCES worker_credentials(id)
ON DELETE CASCADE;