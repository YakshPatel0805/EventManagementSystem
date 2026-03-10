'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, MapPinned, User, Mail } from 'lucide-react';

interface Booking {
  _id: string;
  userName: string;
  userEmail: string;
  numberOfSeats: number;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refund-pending' | 'refunded';
  paymentAmount: number;
  refundAmount: number;
  transactionId?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  refundApprovedAt?: string;
  eventId: {
    _id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    price: number;
  };
}

const AdminBookingsPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!authLoading && user && user.role !== 'admin') {
      router.push('/');
      return;
    }

    if (!authLoading && user && user.role === 'admin') {
      fetchBookings();
    }
  }, [user, authLoading, router, filterStatus, filterPaymentStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterPaymentStatus) params.append('paymentStatus', filterPaymentStatus);
      params.append('limit', '50');

      const url = `/api/bookings/all?${params.toString()}`;
      console.log('Fetching bookings from:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Bookings response:', data);
      
      if (data.success) {
        setBookings(data.data);
      } else {
        console.error('Failed to fetch bookings:', data.error);
        setErrorMessage(data.error || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setErrorMessage('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRefund = async (bookingId: string) => {
    setApprovingId(bookingId);
    try {
      const response = await fetch('/api/bookings/approve-refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Refund approved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchBookings();
      } else {
        alert(data.error || 'Failed to approve refund');
      }
    } catch (error) {
      alert('Error approving refund');
    } finally {
      setApprovingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-xl text-gray-600">Unauthorized access</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full px-4 py-8 pt-20">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white-900 mb-2">Bookings Management</h1>
            <p className="text-white-600">View and manage all event bookings</p>
          </div>
          <Link
            href="/admin/home"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {successMessage && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 font-semibold">✓ {successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-semibold">✗ {errorMessage}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Booking Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full text-black px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                className="w-full text-black px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Payment Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refund-pending">Refund Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          All Bookings ({bookings.length})
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
            {bookings.map((booking) => {
              // Skip bookings with deleted events
              if (!booking.eventId) {
                return (
                  <div
                    key={booking._id}
                    className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="text-center py-4">
                      <p className="text-gray-600 font-semibold">Event no longer available</p>
                      <p className="text-gray-500 text-sm mt-2">This event has been deleted from the system.</p>
                      <p className="text-gray-500 text-xs mt-2">Booking ID: {booking._id}</p>
                    </div>
                  </div>
                );
              }

              return (
              <div
                key={booking._id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {booking.eventId.title}
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">
                          {new Date(booking.eventId.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">{booking.eventId.time}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPinned className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">{booking.eventId.venue}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="font-semibold text-gray-900">{booking.userName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700 text-sm">{booking.userEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {/* Status Badges */}
                    <div className="flex gap-2 flex-wrap mb-4">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-900'
                            : booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-900'
                            : booking.paymentStatus === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : booking.paymentStatus === 'refund-pending'
                            ? 'bg-orange-100 text-orange-900'
                            : booking.paymentStatus === 'refunded'
                            ? 'bg-pink-100 text-pink-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        💳 {booking.paymentStatus === 'refund-pending' ? 'Refund Pending' : booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seats:</span>
                        <span className="font-semibold text-gray-900">{booking.numberOfSeats}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold text-gray-900">
                          ₹{booking.paymentAmount.toFixed(2)}
                        </span>
                      </div>
                      {booking.refundAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Refund:</span>
                          <span className="font-semibold text-pink-700">
                            ₹{booking.refundAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Booked:</span>
                        <span className="text-gray-700">
                          {new Date(booking.bookingDate).toLocaleDateString('en-US')}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/events/${booking.eventId._id}`}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition text-center"
                      >
                        View Event
                      </Link>

                      {booking.status === 'cancelled' &&
                        booking.paymentStatus !== 'refunded' &&
                        booking.refundAmount > 0 && (
                          <button
                            onClick={() => handleApproveRefund(booking._id)}
                            disabled={approvingId === booking._id}
                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
                          >
                            {approvingId === booking._id ? '⏳ Approving...' : '✓ Approve Refund'}
                          </button>
                        )}

                      {booking.paymentStatus === 'refunded' && (
                        <div className="flex-1 bg-pink-100 text-pink-800 px-3 py-2 rounded-lg text-sm font-semibold text-center">
                          ✓ Refund Approved
                        </div>
                      )}
                    </div>

                    {booking.cancellationReason && (
                      <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                        <p className="text-xs text-gray-600">Cancellation Reason:</p>
                        <p className="text-sm text-gray-900">{booking.cancellationReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
