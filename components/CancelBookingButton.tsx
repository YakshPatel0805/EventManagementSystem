'use client';

import { useState } from 'react';

interface CancelBookingButtonProps {
  bookingId: string;
  onSuccess?: () => void;
}

export default function CancelBookingButton({ bookingId, onSuccess }: CancelBookingButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCancel = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, reason }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to cancel booking');
        setLoading(false);
        return;
      }

      setSuccessMessage(
        `Booking cancelled successfully! Refund: ₹${data.data.refundAmount.toFixed(2)} (${data.data.refundPercentage}%)`
      );
      setLoading(false);
      
      // Close modal after 2 seconds and refresh
      setTimeout(() => {
        setShowModal(false);
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
        disabled={loading}
      >
        Cancel Booking
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Cancel Booking</h2>
            
            {!successMessage ? (
              <>
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-gray-700 font-semibold mb-2">Refund Policy:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• More than 7 days: 100% refund</li>
                    <li>• 3-7 days: 50% refund</li>
                    <li>• Less than 3 days: No refund</li>
                  </ul>
                </div>

                <p className="text-gray-600 mb-4">
                  Are you sure you want to cancel this booking?
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Reason for cancellation (optional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                    rows={3}
                    placeholder="Please let us know why you're cancelling..."
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-gray-700"
                    disabled={loading}
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4 bg-green-100 text-green-700 rounded text-center">
                <p className="font-semibold">✓ {successMessage}</p>
                <p className="text-sm mt-2">Refreshing your bookings...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
