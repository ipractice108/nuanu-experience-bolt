/*
  # Fix Experience Manager Data

  1. Changes
    - Add manager role to first user if none exists
    - Insert sample experiences data
    - Ensure experiences are visible and paid
*/

-- First, ensure we have at least one manager
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE raw_user_meta_data->>'role' = 'manager'
  ) THEN
    -- Update the first user to be a manager if no manager exists
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"manager"'
    )
    WHERE id = (SELECT id FROM auth.users LIMIT 1);
  END IF;
END $$;

-- Insert sample experiences
WITH manager_user AS (
  SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'manager' LIMIT 1
)
INSERT INTO public.experiences (
  name,
  description,
  category,
  is_paid,
  price,
  image_url,
  created_by,
  is_visible
)
SELECT
  name,
  description,
  category::experience_category,
  is_paid,
  price,
  image_url,
  manager_user.id,
  true
FROM (
  VALUES
    (
      'Palm Hat Workshop',
      'Learn the traditional art of palm hat weaving in this hands-on workshop. Create your own unique hat using sustainable materials.',
      'art',
      true,
      300000,
      'https://images.unsplash.com/photo-1529111290557-82f6d5c6cf85?auto=format&fit=crop&q=80',
      true
    ),
    (
      'Glass Blowing Experience',
      'Discover the mesmerizing art of glass blowing. Create your own glass piece under expert guidance.',
      'art',
      true,
      450000,
      'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80',
      true
    ),
    (
      'Urban Sketching Workshop',
      'Learn urban sketching techniques and capture the beauty of city life through your artwork.',
      'art',
      true,
      250000,
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80',
      true
    ),
    (
      'Music Production Masterclass',
      'Learn professional music production techniques using industry-standard software and equipment.',
      'education',
      true,
      500000,
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80',
      true
    ),
    (
      'Music Promotion Workshop',
      'Master the art of music promotion in the digital age. Learn effective strategies for artist branding and marketing.',
      'education',
      true,
      400000,
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80',
      true
    ),
    (
      'AI Practical Workshop',
      'Get hands-on experience with AI tools and learn practical applications in various industries.',
      'education',
      true,
      600000,
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80',
      true
    ),
    (
      'Sunset Yoga Flow',
      'Join us for a serene sunset yoga session overlooking the ocean. This class combines gentle flows with breathwork.',
      'wellness',
      true,
      200000,
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80',
      true
    ),
    (
      'Dynamic Stretching Flow',
      'Improve flexibility and mobility through dynamic stretching sequences and mindful movement patterns.',
      'wellness',
      true,
      180000,
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80',
      true
    ),
    (
      'Zumba Dance Party',
      'Get your heart pumping with this fun and energetic Zumba class combining Latin rhythms and easy-to-follow moves.',
      'wellness',
      true,
      150000,
      'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80',
      true
    ),
    (
      'Break Dance Fundamentals',
      'Learn the basics of break dancing from experienced b-boys and b-girls. Perfect for beginners!',
      'wellness',
      true,
      200000,
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80',
      true
    ),
    (
      'Sound Healing Journey',
      'Experience deep relaxation and healing through the power of sound vibrations using crystal bowls and other instruments.',
      'wellness',
      true,
      250000,
      'https://images.unsplash.com/photo-1591291621060-89dd2673b51b?auto=format&fit=crop&q=80',
      true
    ),
    (
      'Gong Bath Meditation',
      'Immerse yourself in the healing vibrations of the gong for deep relaxation and stress relief.',
      'wellness',
      true,
      300000,
      'https://images.unsplash.com/photo-1591291675190-eafd25234d4c?auto=format&fit=crop&q=80',
      true
    )
  ) AS t (name, description, category, is_paid, price, image_url, is_visible)
  CROSS JOIN manager_user
ON CONFLICT (id) DO UPDATE 
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_paid = EXCLUDED.is_paid,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  is_visible = EXCLUDED.is_visible,
  updated_at = now();