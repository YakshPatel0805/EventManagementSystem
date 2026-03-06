'use client';

import { useEffect, useState } from 'react';
import EventCard from "@/components/EventCard";
import { useAuth } from '@/contexts/AuthContext';

interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  time: string;
  venue: string;
  date: string;
  capacity: number;
  bookedSeats: number;
  pendingSeats?: number;
}

const HomePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      // Fetch events only if user is authenticated
      const fetchEvents = async () => {
        try {
          const response = await fetch('/api/events');
          const data = await response.json();
          if (data.success) {
            // Fetch pending bookings for each event
            const eventsWithPending = await Promise.all(
              data.data.map(async (event: Event) => {
                try {
                  const pendingRes = await fetch(`/api/bookings?eventId=${event._id}&status=pending`);
                  const pendingData = await pendingRes.json();
                  const pendingSeats = pendingData.data?.reduce((total: number, booking: any) => total + booking.numberOfSeats, 0) || 0;
                  return { ...event, pendingSeats };
                } catch (err) {
                  return event;
                }
              })
            );
            setEvents(eventsWithPending);
          }
        } catch (error) {
          console.error('Failed to fetch events:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchEvents();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <section>
      <h1 className="text-center">The Place for every Individuals</h1>
      <p className="text-center mt-5">Connect with each-other, share knowledge, and grow together.</p>

      <div className="mt-20 space-y-7">
        <h3>Events For Individuals</h3>
        {events.length === 0 ? (
          <p className="text-center text-gray-700">No events available at the moment.</p>
        ) : (
          <ul className="events">
            {events.map((event) => (
              <li key={event._id}>
                <EventCard
                  id={event._id}
                  title={event.title}
                  description={event.description}
                  image={event.image}
                  time={event.time}
                  venue={event.venue}
                  date={new Date(event.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  capacity={event.capacity}
                  bookedSeats={event.bookedSeats}
                  pendingSeats={event.pendingSeats}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default HomePage;
