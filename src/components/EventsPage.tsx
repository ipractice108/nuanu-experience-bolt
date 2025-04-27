import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  imageUrl: string;
  link: string;
}

export function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/events`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nuanu"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-nuanu text-white rounded-lg hover:bg-nuanu-light transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Experiences
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {event.title}
              </h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="space-y-2 mb-4">
                <p className="text-gray-700">
                  <span className="font-medium">Date:</span> {formatDate(event.date)}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Time:</span> {event.time}
                </p>
              </div>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-nuanu text-white rounded-lg hover:bg-nuanu-light transition-colors text-center"
              >
                Learn More
              </a>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No upcoming events at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}