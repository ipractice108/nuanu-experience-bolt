import { corsHeaders } from '../_shared/cors.ts';
import * as cheerio from 'npm:cheerio@1.0.0-rc.12';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Fetch HTML content from nuanu.com/events
    const response = await fetch('https://www.nuanu.com/events');
    const html = await response.text();

    // Parse HTML using cheerio
    const $ = cheerio.load(html);

    // Extract events data
    const events = [];
    
    // Find all event elements and extract data
    $('.event-card').each((i, el) => {
      const event = {
        id: String(i + 1), // Generate sequential IDs
        title: $(el).find('.event-title').text().trim(),
        description: $(el).find('.event-description').text().trim(),
        date: $(el).find('.event-date').text().trim(),
        time: $(el).find('.event-time').text().trim(),
        imageUrl: $(el).find('img').attr('src') || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80',
        link: $(el).find('a').attr('href') || 'https://www.nuanu.com/events'
      };

      // Only add events with valid data
      if (event.title && event.description) {
        events.push(event);
      }
    });

    // If no events were found, return sample data
    if (events.length === 0) {
      const sampleEvents = [
        {
          id: '1',
          title: 'Wellness Workshop',
          description: 'Join us for a comprehensive wellness workshop focusing on mindfulness and healthy living.',
          date: '2024-03-25',
          time: '10:00 AM - 12:00 PM',
          imageUrl: 'https://images.unsplash.com/photo-1544367567-0b2e23e6ba5d?auto=format&fit=crop&q=80',
          link: 'https://www.nuanu.com/events'
        },
        {
          id: '2',
          title: 'Sound Healing Session',
          description: 'Experience the healing power of sound therapy with our expert practitioners.',
          date: '2024-03-26',
          time: '2:00 PM - 3:30 PM',
          imageUrl: 'https://images.unsplash.com/photo-1591291621060-89dd2673b51b?auto=format&fit=crop&q=80',
          link: 'https://www.nuanu.com/events'
        },
        {
          id: '3',
          title: 'Art Workshop',
          description: 'Learn various art techniques in this hands-on creative workshop.',
          date: '2024-03-27',
          time: '3:00 PM - 5:00 PM',
          imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80',
          link: 'https://www.nuanu.com/events'
        }
      ];
      return new Response(JSON.stringify(sampleEvents), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(events), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    
    // Return sample data in case of error
    const fallbackEvents = [
      {
        id: '1',
        title: 'Upcoming Event',
        description: 'Details will be announced soon.',
        date: '2024-03-25',
        time: 'TBA',
        imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80',
        link: 'https://www.nuanu.com/events'
      }
    ];

    return new Response(JSON.stringify(fallbackEvents), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});