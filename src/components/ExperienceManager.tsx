import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Experience, TimeSlot, Category, locations } from '../types';
import { useManagerExperiences } from '../hooks/useExperiences';
import { 
  Calendar, Plus, Trash2, Edit, LogOut, Save, X,
  DollarSign, Image, Check, User, BookOpen, Filter, Upload,
  Repeat, CalendarDays, Clock, AlertCircle, Sun, Calendar as CalendarIcon,
  MapPin, UserPlus
} from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { supabase } from '../lib/supabase';

interface ExperienceForm {
  id?: string;
  name: string;
  description: string;
  category: Category;
  image_url: string | null;
  is_visible: boolean;
  locationId?: string;
  teacher?: {
    name: string;
    bio: string;
    photoUrl: string;
    specialties: string[];
  };
}

interface DateSlot {
  id?: string;
  date?: string | null;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurrenceType?: 'daily' | 'weekly' | null;
  weekdays?: string[];
  weeklyStart?: string;
  weeklyEnd?: string;
  isPaid: boolean;
  price: number | null;
}

type ExperienceFilter = 'all' | 'free' | 'paid';
type ScheduleType = 'one-time' | 'weekly' | 'daily' | null;

const WEEKDAYS = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' }
];

export function ExperienceManager() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { experiences, loading, error, createExperience, updateExperience, deleteExperience } = useManagerExperiences();
  const [isEditing, setIsEditing] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceForm | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<ExperienceFilter>('all');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [dateSlots, setDateSlots] = useState<DateSlot[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);
  const [selectedScheduleType, setSelectedScheduleType] = useState<ScheduleType>(null);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [teacherSpecialty, setTeacherSpecialty] = useState('');

  useEffect(() => {
    if (editingExperience?.id) {
      loadDateSlots(editingExperience.id);
    }
  }, [editingExperience?.id]);

  const loadDateSlots = async (experienceId: string) => {
    try {
      const { data, error } = await supabase
        .from('experience_dates')
        .select('*')
        .eq('experience_id', experienceId);

      if (error) throw error;

      setDateSlots(
        (data || []).map(slot => ({
          id: slot.id,
          date: slot.date,
          startTime: slot.start_time,
          endTime: slot.end_time,
          isRecurring: slot.is_recurring,
          recurrenceType: slot.recurrence_type,
          weekdays: slot.weekdays || [],
          weeklyStart: slot.weekly_start,
          weeklyEnd: slot.weekly_end,
          isPaid: slot.is_paid,
          price: slot.price
        }))
      );
    } catch (err) {
      console.error('Error loading date slots:', err);
      setDateError('Failed to load schedule settings');
    }
  };

  const calculateTotalSessions = (slot: DateSlot): number => {
    if (!slot.isRecurring) {
      return 1;
    }

    if (slot.recurrenceType === 'daily') {
      const start = new Date();
      const end = new Date(start);
      end.setMonth(end.getMonth() + 2);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return days;
    }

    if (slot.recurrenceType === 'weekly' && slot.weeklyStart && slot.weeklyEnd && slot.weekdays) {
      const start = new Date(slot.weeklyStart);
      const end = new Date(slot.weeklyEnd);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const weeks = Math.ceil(days / 7);
      return weeks * slot.weekdays.length;
    }

    return 0;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;

    try {
      let experienceId: string;
      
      if (isEditing && editingExperience.id) {
        const updated = await updateExperience(editingExperience.id, editingExperience);
        experienceId = updated.id;
      } else {
        const created = await createExperience(editingExperience);
        experienceId = created.id;
      }

      // Save date slots
      for (const slot of dateSlots) {
        const dateData = {
          experience_id: experienceId,
          date: slot.isRecurring ? null : slot.date,
          start_time: slot.startTime,
          end_time: slot.endTime,
          is_recurring: slot.isRecurring,
          recurrence_type: slot.isRecurring ? slot.recurrenceType : null,
          weekdays: slot.recurrenceType === 'weekly' ? slot.weekdays : null,
          weekly_start: slot.recurrenceType === 'weekly' ? slot.weeklyStart : null,
          weekly_end: slot.recurrenceType === 'weekly' ? slot.weeklyEnd : null,
          is_paid: slot.isPaid,
          price: slot.price
        };

        if (slot.id) {
          await supabase
            .from('experience_dates')
            .update(dateData)
            .eq('id', slot.id);
        } else {
          await supabase
            .from('experience_dates')
            .insert([dateData]);
        }
      }

      setShowForm(false);
      setEditingExperience(null);
      setIsEditing(false);
      setDateSlots([]);
      setDateError(null);
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience. Please try again.');
    }
  };

  const handleEdit = async (experience: Experience) => {
    setEditingExperience({
      id: experience.id,
      name: experience.name,
      description: experience.description,
      category: experience.category,
      image_url: experience.imageUrl,
      is_visible: experience.isVisible || false,
      locationId: experience.locationId
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (experienceId: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteExperience(experienceId);
      } catch (error) {
        console.error('Error deleting experience:', error);
        alert('Failed to delete experience. Please try again.');
      }
    }
  };

  const addDateSlot = () => {
    setDateSlots([...dateSlots, {
      startTime: '09:00',
      endTime: '17:00',
      isRecurring: false,
      weekdays: [],
      isPaid: false,
      price: null
    }]);
  };

  const updateDateSlot = (index: number, updates: Partial<DateSlot>) => {
    const newSlots = [...dateSlots];
    newSlots[index] = { ...newSlots[index], ...updates };
    setDateSlots(newSlots);
  };

  const toggleWeekday = (index: number, weekday: string) => {
    const slot = dateSlots[index];
    const weekdays = slot.weekdays || [];
    const newWeekdays = weekdays.includes(weekday)
      ? weekdays.filter(w => w !== weekday)
      : [...weekdays, weekday];
    
    updateDateSlot(index, { weekdays: newWeekdays });
  };

  const removeDateSlot = (index: number) => {
    setDateSlots(dateSlots.filter((_, i) => i !== index));
  };

  const handleScheduleTypeSelect = (type: ScheduleType, index: number) => {
    if (!dateSlots[index]) return;

    const today = new Date();
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(today.getMonth() + 2);

    setSelectedScheduleType(type);
    updateDateSlot(index, {
      isRecurring: type !== 'one-time',
      recurrenceType: type === 'one-time' ? null : type,
      date: type === 'one-time' ? (dateSlots[index].date || today.toISOString().split('T')[0]) : null,
      weekdays: type === 'weekly' ? [] : undefined,
      weeklyStart: type === 'weekly' ? today.toISOString().split('T')[0] : undefined,
      weeklyEnd: type === 'weekly' ? twoMonthsFromNow.toISOString().split('T')[0] : undefined
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const filteredExperiences = experiences.filter(exp => {
    switch (filter) {
      case 'free':
        return !exp.is_paid;
      case 'paid':
        return exp.is_paid;
      default:
        return true;
    }
  });

  const renderScheduleSettings = (slot: DateSlot, index: number) => (
    <div className="space-y-6">
      {/* Schedule Type Selection */}
      <div className="grid grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => handleScheduleTypeSelect('one-time', index)}
          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
            ${slot.isRecurring === false
              ? 'border-nuanu bg-nuanu/5 text-nuanu'
              : 'border-gray-200 hover:border-nuanu/30 text-gray-600'
            }`}
        >
          <CalendarIcon className="w-6 h-6" />
          <span className="font-medium">One Time</span>
        </button>

        <button
          type="button"
          onClick={() => handleScheduleTypeSelect('weekly', index)}
          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
            ${slot.recurrenceType === 'weekly'
              ? 'border-nuanu bg-nuanu/5 text-nuanu'
              : 'border-gray-200 hover:border-nuanu/30 text-gray-600'
            }`}
        >
          <Calendar className="w-6 h-6" />
          <span className="font-medium">Weekly</span>
        </button>

        <button
          type="button"
          onClick={() => handleScheduleTypeSelect('daily', index)}
          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
            ${slot.recurrenceType === 'daily'
              ? 'border-nuanu bg-nuanu/5 text-nuanu'
              : 'border-gray-200 hover:border-nuanu/30 text-gray-600'
            }`}
        >
          <Sun className="w-6 h-6" />
          <span className="font-medium">Daily</span>
        </button>
      </div>

      {/* Schedule Details */}
      <div className="space-y-4">
        {slot.recurrenceType === 'weekly' && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Days
              </label>
              <div className="flex gap-2 flex-wrap">
                {WEEKDAYS.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleWeekday(index, day.value)}
                    className={`px-4 py-2 rounded-lg transition-all font-medium
                      ${slot.weekdays?.includes(day.value)
                        ? 'bg-nuanu text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Start Date
                </label>
                <input
                  type="date"
                  value={slot.weeklyStart || ''}
                  onChange={(e) => updateDateSlot(index, { weeklyStart: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule End Date
                </label>
                <input
                  type="date"
                  value={slot.weeklyEnd || ''}
                  onChange={(e) => updateDateSlot(index, { weeklyEnd: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  min={slot.weeklyStart || new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          </>
        )}

        {!slot.isRecurring && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={slot.date || ''}
              onChange={(e) => updateDateSlot(index, { date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required={!slot.isRecurring}
              min={new Date().toISOString().split('T')[0]}
              max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => updateDateSlot(index, { startTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => updateDateSlot(index, { endTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={slot.isPaid}
              onChange={(e) => updateDateSlot(index, { 
                isPaid: e.target.checked,
                price: e.target.checked ? slot.price || 0 : null
              })}
              className="rounded border-gray-300 text-nuanu focus:ring-nuanu"
            />
            <span className="ml-2">This is a paid session</span>
          </label>

          {slot.isPaid && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                value={slot.price || ''}
                onChange={(e) => updateDateSlot(index, { price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          )}
        </div>

        {/* Session Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Session Summary</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">Type:</span>{' '}
              {slot.isRecurring 
                ? `${slot.recurrenceType === 'weekly' ? 'Weekly' : 'Daily'} Recurring`
                : 'One-time'
              }
            </p>
            {slot.recurrenceType === 'weekly' && (
              <>
                <p>
                  <span className="font-medium">Days:</span>{' '}
                  {slot.weekdays?.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
                </p>
                <p>
                  <span className="font-medium">Period:</span>{' '}
                  {new Date(slot.weeklyStart!).toLocaleDateString()} - {new Date(slot.weeklyEnd!).toLocaleDateString()}
                </p>
              </>
            )}
            {!slot.isRecurring && (
              <p>
                <span className="font-medium">Date:</span>{' '}
                {new Date(slot.date!).toLocaleDateString()}
              </p>
            )}
            <p>
              <span className="font-medium">Time:</span>{' '}
              {slot.startTime} - {slot.endTime}
            </p>
            <p>
              <span className="font-medium">Price:</span>{' '}
              {slot.isPaid ? formatPrice(slot.price || 0) : 'Free'}
            </p>
            <p>
              <span className="font-medium">Total Sessions:</span>{' '}
              {calculateTotalSessions(slot)}
            </p>
          </div>
        </div>

        {slot.isRecurring && (
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recurring events are limited to 2 months from today
          </p>
        )}
      </div>
    </div>
  );

  const renderTeacherSettings = () => {
    if (!editingExperience) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Teacher Information</h3>
          {!showTeacherForm && (
            <button
              type="button"
              onClick={() => {
                setShowTeacherForm(true);
                setEditingExperience(prev => ({
                  ...prev!,
                  teacher: prev?.teacher || {
                    name: '',
                    bio: '',
                    photoUrl: '',
                    specialties: []
                  }
                }));
              }}
              className="flex items-center gap-2 text-nuanu hover:text-nuanu-light"
            >
              <UserPlus className="w-5 h-5" />
              Add Teacher
            </button>
          )}
        </div>

        {showTeacherForm && editingExperience.teacher && (
          <div className="space-y-6 bg-gray-50 rounded-lg p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teacher Name
              </label>
              <input
                type="text"
                value={editingExperience.teacher.name}
                onChange={(e) => setEditingExperience(prev => ({
                  ...prev!,
                  teacher: {
                    ...prev!.teacher!,
                    name: e.target.value
                  }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={editingExperience.teacher.bio}
                onChange={(e) => setEditingExperience(prev => ({
                  ...prev!,
                  teacher: {
                    ...prev!.teacher!,
                    bio: e.target.value
                  }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo URL
              </label>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={editingExperience.teacher.photoUrl}
                    onChange={(e) => setEditingExperience(prev => ({
                      ...prev!,
                      teacher: {
                        ...prev!.teacher!,
                        photoUrl: e.target.value
                      }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter photo URL"
                  />
                  <button
                    type="button"
                    onClick={() => setShowImageUpload(true)}
                    className="px-4 py-2 bg-nuanu text-white rounded-lg hover:bg-nuanu-light flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload
                  </button>
                </div>
                {editingExperience.teacher.photoUrl && (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <img
                      src={editingExperience.teacher.photoUrl}
                      alt="Teacher"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingExperience(prev => ({
                        ...prev!,
                        teacher: {
                          ...prev!.teacher!,
                          photoUrl: ''
                        }
                      }))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialties
              </label>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={teacherSpecialty}
                    onChange={(e) => setTeacherSpecialty(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter a specialty"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (teacherSpecialty.trim()) {
                        setEditingExperience(prev => ({
                          ...prev!,
                          teacher: {
                            ...prev!.teacher!,
                            specialties: [...prev!.teacher!.specialties, teacherSpecialty.trim()]
                          }
                        }));
                        setTeacherSpecialty('');
                      }
                    }}
                    className="px-4 py-2 bg-nuanu text-white rounded-lg hover:bg-nuanu-light"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editingExperience.teacher.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-nuanu/10 text-nuanu rounded-full flex items-center gap-2"
                    >
                      {specialty}
                      <button
                        type="button"
                        onClick={() => setEditingExperience(prev => ({
                          ...prev!,
                          teacher: {
                            ...prev!.teacher!,
                            specialties: prev!.teacher!.specialties.filter((_, i) => i !== index)
                          }
                        }))}
                        className="text-nuanu hover:text-nuanu-light"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowTeacherForm(false);
                  setEditingExperience(prev => ({
                    ...prev!,
                    teacher: undefined
                  }));
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Remove Teacher
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nuanu"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-nuanu text-white rounded-lg hover:bg-nuanu-light"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experience Manager</h1>
          <p className="text-gray-600">Manage your experiences</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-red-600 hover:text-red-700"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>

      {!showForm ? (
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-lg overflow-hidden">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 text-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-nuanu text-white'
                  : 'bg-white text-gray-600 hover:bg-nuanu/10'
              }`}
            >
              All Experiences
            </button>
            <button
              onClick={() => setFilter('free')}
              className={`px-6 py-3 text-lg font-medium transition-all ${
                filter === 'free'
                  ? 'bg-nuanu text-white'
                  : 'bg-white text-gray-600 hover:bg-nuanu/10'
              }`}
            >
              Free Experiences
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-6 py-3 text-lg font-medium transition-all ${
                filter === 'paid'
                  ? 'bg-nuanu text-white'
                  : 'bg-white text-gray-600 hover:bg-nuanu/10'
              }`}
            >
              Paid Experiences
            </button>
          </div>
        </div>
      ) : null}

      {!showForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button 
            onClick={() => {
              setEditingExperience({
                name: '',
                description: '',
                category: 'art',
                image_url: null,
                is_visible: false,
              });
              setIsEditing(false);
              setShowForm(true);
            }}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center"
          >
            <Plus className="w-8 h-8 text-nuanu mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Add New Experience</h3>
            <p className="text-gray-600 mt-2">Create a new experience or activity</p>
          </button>

          {filteredExperiences.map((experience) => {
            const location = locations.find(loc => loc.id === experience.locationId);
            
            return (
              <div key={experience.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="relative h-48 mb-4">
                  <img
                    src={experience.imageUrl || '/placeholder.jpg'}
                    alt={experience.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {!experience.is_visible && (
                    <div className="absolute top-2 right-2 bg-gray-500 text-white px-3 py-1 rounded-full text-sm">
                      Hidden
                    </div>
                  )}
                  <div className="absolute top-2 left-2 px-3 py-1 rounded-full text-sm bg-white shadow-md">
                    {experience.is_paid ? 'Paid' : 'Free'}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{experience.name}</h3>
                <p className="text-gray-600 mb-4">{experience.description}</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 bg-nuanu/10 text-nuanu rounded-full">
                      {experience.category}
                    </span>
                  </div>

                  {location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>{location.name}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="p-2 text-nuanu hover:bg-nuanu/10 rounded-full"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(experience.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Edit Experience' : 'Add New Experience'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingExperience(null);
                setShowImageUpload(false);
                setDateSlots([]);
                setDateError(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={editingExperience?.name || ''}
                onChange={(e) => setEditingExperience(prev => ({ ...prev!, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editingExperience?.description || ''}
                onChange={(e) => setEditingExperience(prev => ({ ...prev!, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={editingExperience?.category || 'art'}
                onChange={(e) => setEditingExperience(prev => ({ 
                  ...prev!, 
                  category: e.target.value as Category
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="art">Art</option>
                <option value="education">Education</option>
                <option value="wellness">Wellness</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={editingExperience?.locationId || ''}
                onChange={(e) => setEditingExperience(prev => ({ 
                  ...prev!, 
                  locationId: e.target.value
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select a location</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              {showImageUpload ? (
                <ImageUpload 
                  onImageUpload={(url) => {
                    setEditingExperience(prev => ({ ...prev!, image_url: url }));
                    setShowImageUpload(false);
                  }}
                  onCancel={() => setShowImageUpload(false)}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={editingExperience?.image_url || ''}
                      onChange={(e) => setEditingExperience(prev => ({ ...prev!, image_url: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter image URL"
                    />
                    <button
                      type="button"
                      onClick={() => setShowImageUpload(true)}
                      className="px-4 py-2 bg-nuanu text-white rounded-lg hover:bg-nuanu-light flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Upload
                    </button>
                  </div>
                  {editingExperience?.image_url && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <img
                        src={editingExperience.image_url}
                        alt="Experience preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingExperience(prev => ({ ...prev!, image_url: null }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Teacher Settings */}
            {renderTeacherSettings()}

            {/* Schedule Settings */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Schedule Settings
                </label>
                <button
                  type="button"
                  onClick={addDateSlot}
                  className="text-nuanu hover:text-nuanu-light flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Time Slot
                </button>
              </div>

              {dateError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  {dateError}
                </div>
              )}

              <div className="space-y-6">
                {dateSlots.map((slot, index) => (
                  <div key={index} className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-nuanu" />
                        <span className="font-medium">Time Slot {index + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDateSlot(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {renderScheduleSettings(slot, index)}
                  </div>
                ))}

                {dateSlots.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No time slots added yet. Click "Add Time Slot" to schedule this experience.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingExperience?.is_visible || false}
                  onChange={(e) => setEditingExperience(prev => ({ 
                    ...prev!, 
                    is_visible: e.target.checked 
                  }))}
                  className="rounded border-gray-300 text-nuanu focus:ring-nuanu"
                />
                <span className="ml-2">Make Experience Visible</span>
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingExperience(null);
                  setDateSlots([]);
                  setDateError(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-nuanu rounded-lg hover:bg-nuanu-light"
              >
                {isEditing ? 'Save Changes' : 'Add Experience'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}