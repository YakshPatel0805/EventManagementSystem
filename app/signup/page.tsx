'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const SignupPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      // Use auth context to login (will handle redirect)
      login(data.data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join DevEvent to book amazing events</p>
        </div>

        {error && (
          <div className="form-error mb-6">
            <p className="form-error-text">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-container space-y-5">
          <div className="form-group">
            <label htmlFor="name" className="form-label form-label-required">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              placeholder="Enter your full name"
              className="form-input"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label form-label-required">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="your.email@example.com"
              className="form-input"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <p className="form-helper-text">
              Admin emails will automatically get admin access
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label form-label-required">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              minLength={6}
              placeholder="Create a strong password (min 6 characters)"
              className="form-input"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label form-label-required">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              minLength={6}
              placeholder="Re-enter your password"
              className="form-input"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading} className="form-button">
            {loading ? '⏳ Creating Account...' : '✓ Sign Up'}
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
