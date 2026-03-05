'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

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
}

const AdminHomePage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!authLoading && user && user.role !== 'admin') {
      router.push('/');
      return;
    }

    if (!authLoading && user) {
      fetchEvents();
    }
  }, [user, authLoading, router]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setEvents(events.filter(event => event._id !== eventId));
        alert('Event deleted successfully');
      } else {
        alert('Failed to delete event');
      }
    } catch (error) {
      alert('Error deleting event');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Unauthorized access</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white-900 mb-2">Admin Dashboard</h1>
          <p className="text-white-600">Manage all events and bookings</p>
        </div>
        <Link
          href="/admin/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
        >
          + Create New Event
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Events</h3>
          <p className="text-4xl font-bold text-blue-600">{events.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Bookings</h3>
          <p className="text-4xl font-bold text-green-600">
            {events.reduce((sum, event) => sum + event.bookedSeats, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Available Seats</h3>
          <p className="text-4xl font-bold text-purple-600">
            {events.reduce((sum, event) => sum + (event.capacity - event.bookedSeats), 0)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Events</h2>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No events created yet</p>
            <Link
              href="/admin/create"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
              >
                <div className="flex gap-4">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={150}
                    height={100}
                    className="rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Image src="/icons/calendar.svg" alt="date" width={16} height={16} />
                        <span className="text-gray-700">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Image src="/icons/clock.svg" alt="time" width={16} height={16} />
                        <span className="text-gray-700">{event.time}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Image src="/icons/pin.svg" alt="venue" width={16} height={16} />
                        <span className="text-gray-700">{event.venue}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Image src="/icons/audience.svg" alt="capacity" width={16} height={16} />
                        <span className="text-gray-700">
                          {event.bookedSeats}/{event.capacity} booked
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/events/${event._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition text-center"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHomePage;
