'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Booking {
  _id: string;
  userName: string;
  userEmail: string;
  numberOfSeats: number;
  bookingDate: string;
  status: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentAmount: number;
  transactionId?: string;
  eventId: {
    _id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    time: string;
    venue: string;
  };
}

const UserBookingsPage = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const response = await fetch(`/api/bookings/user?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to fetch bookings');
        setBookings([]);
        setLoading(false);
        return;
      }

      setBookings(data.data);
      setLoading(false);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setBookings([]);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">My Bookings</h1>

      <div className="max-w-xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="form-container space-y-4">
          <div className="form-group">
            <label htmlFor="email" className="form-label form-label-required">
              Enter Your Email
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="your.email@example.com"
              className="form-input"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="form-helper-text">Enter the email you used to book events</p>
          </div>

          <button type="submit" disabled={loading} className="form-button">
            {loading ? '🔍 Searching...' : '🔍 View My Bookings'}
          </button>
        </form>
      </div>

      {error && (
        <div className="form-error max-w-xl mx-auto">
          <p className="form-error-text">{error}</p>
        </div>
      )}

      {searched && !loading && bookings.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No bookings found for this email address.</p>
          <p className="text-gray-400 mt-2">Make sure you entered the correct email.</p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Found {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </h2>

          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition">
                <div className="grid md:grid-cols-3 gap-6 p-6">
                  <div className="md:col-span-1">
                    <Image
                      src={booking.eventId.image}
                      alt={booking.eventId.title}
                      width={300}
                      height={200}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{booking.eventId.title}</h3>
                      <div className="flex gap-2 flex-wrap">
                        <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          ✓ {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                        {booking.paymentStatus === 'completed' && (
                          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                            💳 Payment Successful
                          </div>
                        )}
                        {booking.paymentStatus === 'pending' && (
                          <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                            ⏳ Payment Pending
                          </div>
                        )}
                        {booking.paymentStatus === 'failed' && (
                          <div className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                            ❌ Payment Failed
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Image src="/icons/calendar.svg" alt="date" width={18} height={18} />
                          <p className="text-gray-700">
                            {new Date(booking.eventId.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Image src="/icons/clock.svg" alt="time" width={18} height={18} />
                          <p className="text-gray-700">{booking.eventId.time}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Image src="/icons/pin.svg" alt="venue" width={18} height={18} />
                          <p className="text-gray-700">{booking.eventId.venue}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Booked By</p>
                          <p className="font-semibold text-gray-900">{booking.userName}</p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Number of Seats</p>
                          <p className="font-semibold text-gray-900">{booking.numberOfSeats}</p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="font-semibold text-gray-900">₹{booking.paymentAmount.toFixed(2)}</p>
                        </div>

                        {booking.transactionId && (
                          <div className="bg-indigo-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Transaction ID</p>
                            <p className="font-semibold text-gray-900 text-xs">{booking.transactionId}</p>
                          </div>
                        )}

                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Booked On</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.bookingDate).toLocaleDateString('en-US')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/events/${booking.eventId._id}`}
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        View Event Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;
