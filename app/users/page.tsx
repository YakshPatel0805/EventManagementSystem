'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, MapPinned } from 'lucide-react'
import CancelBookingButton from '@/components/CancelBookingButton';

interface Booking {
  _id: string;
  userName: string;
  userEmail: string;
  numberOfSeats: number;
  bookingDate: string;
  status: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentAmount: number;
  refundAmount: number;
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

  const handleCancelSuccess = () => {
    // Refresh bookings after cancellation
    if (email) {
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center h-11">My Bookings</h1>

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
          <h2 className="text-2xl font-bold text-gray-300">
            Found {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </h2>

          <div className="grid gap-6">
            {bookings.map((booking) => {
              if (!booking.eventId) {
                return (
                  <div key={booking._id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden p-6">
                    <div className="text-center py-8">
                      <p className="text-gray-600 font-semibold">Event no longer available</p>
                      <p className="text-gray-500 text-sm mt-2">This event has been removed from the system.</p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition"
                >
                  <div className="grid md:grid-cols-2 gap-6 p-6">

                    {/* LEFT COLUMN */}
                    <div>
                      {booking.eventId.image ? (
                        <Image
                          src={booking.eventId.image}
                          alt={booking.eventId.title}
                          width={300}
                          height={200}
                          loading="lazy"
                          className="rounded-lg w-full h-58 object-cover"
                        />
                      ) : (
                        <div className="rounded-lg w-full h-48 bg-gray-300 flex items-center justify-center">
                          <p className="text-gray-600">No image available</p>
                        </div>
                      )}

                      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">
                        {booking.eventId.title}
                      </h3>

                      {/* Status */}
                      <div className="flex gap-2 flex-wrap mb-4">
                        {booking.status === "pending" && (
                          <div className="px-3 py-1 bg-yellow-100 text-yellow-900 rounded-full text-sm font-semibold">
                            ! {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                        )}

                        {booking.status === "confirmed" && (
                          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            ✓ {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                        )}

                        {booking.status === "cancelled" && (
                          <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                            ✓ {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                        )}

                        {booking.paymentStatus === "completed" && (
                          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                            💳 Payment Successful
                          </div>
                        )}

                        {booking.paymentStatus === "refunded" && (
                          <div className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-semibold">
                            💳 Payment refunded
                          </div>
                        )}

                        {booking.paymentStatus === "pending" && (
                          <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                            💳 Payment pending
                          </div>
                        )}

                      </div>

                      {/* Event Info */}
                      <div className="space-y-3">
                        <div className="flex items-center text-black gap-2">
                          <Calendar />
                          <p className="text-gray-700">
                            {new Date(booking.eventId.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>

                        <div className="flex items-center text-black gap-2">
                          <Clock />
                          <p className="text-gray-700">{booking.eventId.time}</p>
                        </div>

                        <div className="flex items-center text-black gap-2">
                          <MapPinned />
                          <p className="text-gray-700">{booking.eventId.venue}</p>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                        <p className="text-sm text-gray-600">Booked By</p>
                        <p className="font-semibold text-gray-900">{booking.userName}</p>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-3 border-2 border-purple-200">
                        <p className="text-sm text-gray-600">Number of Seats</p>
                        <p className="font-semibold text-gray-900">
                          {booking.numberOfSeats}
                        </p>
                      </div>

                      <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-semibold text-gray-900">
                          ₹{booking.paymentAmount.toFixed(2)}
                        </p>
                      </div>

                      {booking.refundAmount > 0 && (
                        <div className="bg-pink-50 rounded-lg p-3 border-2 border-pink-200">
                          <p className="text-sm text-gray-600">Refund Amount</p>
                          <p className="font-semibold text-pink-700">
                            ₹{booking.refundAmount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round((booking.refundAmount / booking.paymentAmount) * 100)}% refunded
                          </p>
                        </div>
                      )}

                      {booking.transactionId && (
                        <div className="bg-indigo-50 rounded-lg p-3 border-2 border-indigo-200">
                          <p className="text-sm text-gray-600">Transaction ID</p>
                          <p className="font-semibold text-gray-900 text-xs">
                            {booking.transactionId}
                          </p>
                        </div>
                      )}

                      <div className="bg-gray-50 rounded-lg p-3 border-2 border-gray-300">
                        <p className="text-sm text-gray-600">Booked On</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(booking.bookingDate).toLocaleDateString("en-US")}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="pt-4 flex justify-center gap-4">
                        <Link
                          href={`/events/${booking.eventId._id}`}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                          View Event Details
                        </Link>
                        {booking.status !== 'cancelled' && new Date(booking.eventId.date) > new Date() && (
                          <CancelBookingButton 
                            bookingId={booking._id}
                            onSuccess={handleCancelSuccess}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;
