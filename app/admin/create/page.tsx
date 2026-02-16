'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const AdminPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '/images/event1.png',
    slug: '',
    time: '',
    venue: '',
    date: '',
    capacity: 100,
    price: 0,
    refundPolicy: 'Full refund available up to 7 days before the event. 50% refund up to 3 days before. No refunds within 3 days of the event.',
    location: {
      lat: 0,
      lng: 0
    }
  });

  useEffect(() => {
    // Check if user is admin
    if (!authLoading && user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to create event');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/home');
      }, 2000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title, slug: generateSlug(title) });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-white-600">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Checking authorization...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="form-success">
          <h3 className="form-success-title">✓ Event Created!</h3>
          <p className="form-success-text">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-white-900">Create New Event</h1>

      {error && (
        <div className="form-error mb-6">
          <p className="form-error-text">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container space-y-6">
        <div className="form-group">
          <label htmlFor="title" className="form-label form-label-required">
            Event Title
          </label>
          <input
            type="text"
            id="title"
            required
            placeholder="Enter event title"
            className="form-input"
            style={{ color: '#000000', backgroundColor: '#ffffff' }}
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <p className="form-helper-text">The main title of your event</p>
        </div>

        <div className="form-group">
          <label htmlFor="slug" className="form-label">
            URL Slug <span className="text-gray-500 text-sm">(auto-generated)</span>
          </label>
          <input
            type="text"
            id="slug"
            required
            className="form-input"
            style={{ color: '#000000', backgroundColor: '#f9fafb' }}
            value={formData.slug}
            readOnly
          />
          <p className="form-helper-text">Automatically generated from the title</p>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label form-label-required">
            Event Description
          </label>
          <textarea
            id="description"
            required
            rows={5}
            placeholder="Describe your event in detail..."
            className="form-textarea"
            style={{ color: '#000000', backgroundColor: '#ffffff' }}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <p className="form-helper-text">Provide a detailed description of what attendees can expect</p>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="date" className="form-label form-label-required">
              Event Date
            </label>
            <input
              type="date"
              id="date"
              required
              className="form-input"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <p className="form-helper-text">When will the event take place?</p>
          </div>

          <div className="form-group">
            <label htmlFor="time" className="form-label form-label-required">
              Event Time
            </label>
            <input
              type="text"
              id="time"
              required
              placeholder="e.g., 9:00 AM - 5:00 PM"
              className="form-input"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
            <p className="form-helper-text">Start and end time</p>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="venue" className="form-label form-label-required">
            Venue Location
          </label>
          <input
            type="text"
            id="venue"
            required
            placeholder="e.g., San Francisco Convention Center"
            className="form-input"
            style={{ color: '#000000', backgroundColor: '#ffffff' }}
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
          />
          <p className="form-helper-text">Where will the event be held?</p>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="capacity" className="form-label form-label-required">
              Maximum Capacity
            </label>
            <input
              type="number"
              id="capacity"
              required
              min="1"
              placeholder="100"
              className="form-input"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            />
            <p className="form-helper-text">Total number of available seats</p>
          </div>

          <div className="form-group">
            <label htmlFor="price" className="form-label form-label-required">
              Ticket Price (₹)
            </label>
            <input
              type="number"
              id="price"
              required
              min="0"
              step="0.01"
              placeholder="999"
              className="form-input"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            />
            <p className="form-helper-text">Price per ticket in rupees</p>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label form-label-required">
            Event Image
          </label>
          <input
            type="text"
            id="image"
            required
            placeholder="/images/event1.png"
            className="form-input"
            style={{ color: '#000000', backgroundColor: '#ffffff' }}
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
          <p className="form-helper-text">Path to event image</p>
        </div>

        <div className="form-group">
          <label htmlFor="refundPolicy" className="form-label">
            Refund Policy
          </label>
          <textarea
            id="refundPolicy"
            rows={3}
            placeholder="Describe your refund and cancellation policy..."
            className="form-textarea"
            style={{ color: '#000000', backgroundColor: '#ffffff' }}
            value={formData.refundPolicy}
            onChange={(e) => setFormData({ ...formData, refundPolicy: e.target.value })}
          />
          <p className="form-helper-text">Cancellation and refund terms for attendees</p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="form-button"
          >
            {loading ? '⏳ Creating Event...' : '✓ Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPage;
