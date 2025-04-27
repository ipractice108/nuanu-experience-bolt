import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { useAuth } from '../auth/AuthContext';
import type { Experience } from '../types';

type DbExperience = Database['public']['Tables']['experiences']['Row'];

function mapDbExperienceToExperience(dbExp: DbExperience, dates: any[]): Experience {
  const hasPaidSessions = dates.some(date => date.is_paid);
  
  return {
    id: dbExp.id,
    name: dbExp.name,
    description: dbExp.description,
    category: dbExp.category,
    isPaid: hasPaidSessions,
    // Only set price if the experience is paid
    price: hasPaidSessions ? dates.find(date => date.is_paid)?.price : null,
    imageUrl: dbExp.image_url || '',
    isVisible: dbExp.is_visible,
    createdBy: dbExp.created_by,
    updatedAt: dbExp.updated_at ? new Date(dbExp.updated_at) : undefined,
    locationId: dbExp.location_id,
    isFullyBooked: dbExp.is_fully_booked || false,
    availableSlots: dates.map(date => ({
      date: date.date || '',
      startTime: date.start_time,
      endTime: date.end_time,
      available: true
    }))
  };
}

// Shared subscription for real-time updates
let experienceSubscription: any = null;

export function useExperiences(isPaid?: boolean) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchExperiences() {
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select(`
            *,
            experience_dates (
              id,
              date,
              start_time,
              end_time,
              is_recurring,
              recurrence_type,
              weekdays,
              weekly_start,
              weekly_end,
              is_paid,
              price
            )
          `)
          .eq('is_visible', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (isMounted && data) {
          const mappedExperiences = data
            .map(exp => mapDbExperienceToExperience(exp, exp.experience_dates))
            // Filter based on isPaid if specified
            .filter(exp => typeof isPaid === 'boolean' ? exp.isPaid === isPaid : true);

          setExperiences(mappedExperiences);
        }
      } catch (err) {
        console.error('Error fetching experiences:', err);
        if (isMounted) {
          setError('Failed to load experiences');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Set up real-time subscription
    if (!experienceSubscription) {
      experienceSubscription = supabase
        .channel('experiences')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'experiences'
          },
          () => {
            // Refetch experiences when changes occur
            fetchExperiences();
          }
        )
        .subscribe();
    }

    fetchExperiences();

    return () => {
      isMounted = false;
    };
  }, [isPaid]);

  return { experiences, loading, error };
}

export function useManagerExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function fetchExperiences() {
      try {
        if (!user || user.role !== 'manager') {
          navigate('/login');
          return;
        }

        const { data: experiencesData, error: experiencesError } = await supabase
          .from('experiences')
          .select(`
            *,
            experience_dates (
              id,
              date,
              start_time,
              end_time,
              is_recurring,
              recurrence_type,
              weekdays,
              weekly_start,
              weekly_end,
              is_paid,
              price
            )
          `)
          .eq('created_by', user.id)
          .order('created_at', { ascending: false });

        if (experiencesError) throw experiencesError;

        if (isMounted && experiencesData) {
          const mappedExperiences = experiencesData.map(exp => 
            mapDbExperienceToExperience(exp, exp.experience_dates)
          );
          setExperiences(mappedExperiences);
        }
      } catch (err) {
        console.error('Error fetching experiences:', err);
        if (isMounted) {
          setError('Failed to load experiences');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Set up real-time subscription for manager's experiences
    const subscription = supabase
      .channel('manager_experiences')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'experiences',
          filter: `created_by=eq.${user?.id}`
        },
        () => {
          // Refetch experiences when changes occur
          fetchExperiences();
        }
      )
      .subscribe();

    fetchExperiences();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, user]);

  const createExperience = async (experience: Omit<Experience, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
    try {
      if (!user || user.role !== 'manager') {
        navigate('/login');
        throw new Error('Unauthorized');
      }

      // First, verify the location exists if locationId is provided
      if (experience.locationId) {
        const { data: location, error: locationError } = await supabase
          .from('locations')
          .select('id')
          .eq('id', experience.locationId)
          .order('id', { ascending: true })
          .limit(1)
          .single();

        if (locationError || !location) {
          throw new Error('Invalid location selected');
        }
      }

      // Insert the experience
      const { data, error } = await supabase
        .from('experiences')
        .insert({
          name: experience.name,
          description: experience.description,
          category: experience.category,
          image_url: experience.imageUrl,
          created_by: user.id,
          is_visible: experience.isVisible,
          location_id: experience.locationId,
          is_fully_booked: experience.isFullyBooked || false
        })
        .select()
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create experience');

      return data;
    } catch (err) {
      console.error('Error creating experience:', err);
      throw err;
    }
  };

  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    try {
      if (!user || user.role !== 'manager') {
        navigate('/login');
        throw new Error('Unauthorized');
      }

      // First, verify the experience exists and belongs to the user
      const { data: existingExperience, error: checkError } = await supabase
        .from('experiences')
        .select()
        .match({ id, created_by: user.id })
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (checkError) throw checkError;
      if (!existingExperience) throw new Error('Experience not found or unauthorized');

      // Verify the location exists if locationId is being updated
      if (updates.locationId) {
        const { data: location, error: locationError } = await supabase
          .from('locations')
          .select('id')
          .eq('id', updates.locationId)
          .order('id', { ascending: true })
          .limit(1)
          .single();

        if (locationError || !location) {
          throw new Error('Invalid location selected');
        }
      }

      // Update the experience
      const { data, error } = await supabase
        .from('experiences')
        .update({
          name: updates.name,
          description: updates.description,
          category: updates.category,
          image_url: updates.imageUrl,
          is_visible: updates.isVisible,
          location_id: updates.locationId,
          is_fully_booked: updates.isFullyBooked
        })
        .match({ id, created_by: user.id })
        .select()
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to update experience');

      return data;
    } catch (err) {
      console.error('Error updating experience:', err);
      throw err;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      if (!user || user.role !== 'manager') {
        navigate('/login');
        throw new Error('Unauthorized');
      }

      // First, verify the experience exists and belongs to the user
      const { data: existingExperience, error: checkError } = await supabase
        .from('experiences')
        .select('id')
        .match({ id, created_by: user.id })
        .order('id', { ascending: true })
        .limit(1)
        .single();

      if (checkError) throw checkError;
      if (!existingExperience) throw new Error('Experience not found or unauthorized');

      // Delete the experience
      const { error: deleteError } = await supabase
        .from('experiences')
        .delete()
        .match({ id, created_by: user.id });

      if (deleteError) throw deleteError;
    } catch (err) {
      console.error('Error deleting experience:', err);
      throw err;
    }
  };

  return {
    experiences,
    loading,
    error,
    createExperience,
    updateExperience,
    deleteExperience
  };
}