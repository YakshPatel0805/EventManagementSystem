'use client';

import { useState } from 'react';
import PaymentForm from './PaymentForm';
import { Clock, Calendar } from 'lucide-react';

interface Booking {
  _id: string;
  userName: string;
  userEmail: string;
  numberOfSeats: number;
  bookingDate: string;
  status: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'refund-pending';
  paymentAmount: number;
  eventId: {
    _id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
  };
}

interface Props {
  bookings: Booking[];
  onPaymentSuccess: () => void;
}

const PendingBookings = ({ bookings, onPaymentSuccess }: Props) => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setSelectedBooking(null);
      onPaymentSuccess();
    }, 2000);
  };

  const handleCancel = () => {
    setShowPayment(false);
    setSelectedBooking(null);
  };

  if (bookings.length === 0) {
    return null;
  }

  if (paymentSuccess) {
    return (
      <div className="form-success">
        <h3 className="form-success-title">✓ Payment Successful!</h3>
        <p className="form-success-text">Your ticket is confirmed. Thank you for booking with us!</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200 space-y-4">
        <h3 className="text-lg font-semibold text-yellow-900">⏳ Pending Payments</h3>
        <p className="text-sm text-yellow-800">You have {bookings.length} booking(s) awaiting payment. Complete payment to confirm your ticket(s).</p>

        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg p-4 border border-yellow-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{booking.eventId.title}</p>
                  <p className="text-sm text-gray-600">{booking.numberOfSeats} seat(s) - ₹{booking.paymentAmount.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handlePayClick(booking)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
                >
                  Pay Now
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(booking.eventId.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{booking.eventId.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPayment && selectedBooking && (
        <PaymentForm
          bookingId={selectedBooking._id}
          amount={selectedBooking.paymentAmount}
          onSuccess={handlePaymentSuccess}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default PendingBookings;
