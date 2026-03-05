'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to login');
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
          <h1 className="text-4xl font-bold text-white-900 mb-2">Welcome Back</h1>
          <p className="text-white-600">Login to your DevEvent account</p>
        </div>

        {error && (
          <div className="form-error mb-6">
            <p className="form-error-text">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-container space-y-5">
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
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label form-label-required">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              placeholder="Enter your password"
              className="form-input"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading} className="form-button">
            {loading ? '⏳ Logging in...' : '✓ Login'}
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700">
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
