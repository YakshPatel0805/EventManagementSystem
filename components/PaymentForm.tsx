'use client';

import { useState } from 'react';

interface Props {
  bookingId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  onPayLater?: () => void;
}

const PaymentForm = ({ bookingId, amount, onSuccess, onCancel, onPayLater }: Props) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'credit_card'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateCard = (cardNumber: string): boolean => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0 ? true : false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate card number using Luhn algorithm
    const cleanCardNumber = formData.cardNumber.replace(/\s+/g, '');
    if (!validateCard(cleanCardNumber)) {
      setError('Invalid card number. Please check and try again.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          paymentMethod: formData.paymentMethod,
          cardNumber: formData.cardNumber
        })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Payment failed');
        setLoading(false);
        return;
      }

      onSuccess();
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Payment</h2>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Total Amount</p>
          <p className="text-3xl font-bold text-blue-600">₹{amount.toFixed(2)}</p>
        </div>

        {error && (
          <div className="form-error mb-4">
            <p className="form-error-text">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="cardName" className="form-label form-label-required">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardName"
              required
              placeholder="John Doe"
              className="form-input"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              value={formData.cardName}
              onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardNumber" className="form-label form-label-required">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              required
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="form-input"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              value={formData.cardNumber}
              onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="expiryDate" className="form-label form-label-required">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                required
                placeholder="MM/YY"
                maxLength={5}
                className="form-input"
                style={{ color: '#000000', backgroundColor: '#ffffff' }}
                value={formData.expiryDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                  }
                  setFormData({ ...formData, expiryDate: value });
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cvv" className="form-label form-label-required">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                required
                placeholder="123"
                maxLength={3}
                className="form-input"
                style={{ color: '#000000', backgroundColor: '#ffffff' }}
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onPayLater}
              disabled={loading}
              className="flex-1 bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              Pay Later
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 form-button"
            >
              {loading ? '⏳ Processing...' : `Pay ₹${amount.toFixed(2)}`}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          🔒 Secure payment processing (Demo mode)
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
