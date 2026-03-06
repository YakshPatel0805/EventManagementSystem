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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changePasswordData, setChangePasswordData] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordMessage, setChangePasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordLoading(true);
    setChangePasswordMessage(null);

    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setChangePasswordMessage({ type: 'error', text: 'New passwords do not match' });
      setChangePasswordLoading(false);
      return;
    }

    if (changePasswordData.newPassword.length < 8) {
      setChangePasswordMessage({ type: 'error', text: 'New password must be at least 8 characters' });
      setChangePasswordLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: changePasswordData.email,
          oldPassword: changePasswordData.oldPassword,
          newPassword: changePasswordData.newPassword
        })
      });

      const data = await response.json();

      if (!data.success) {
        setChangePasswordMessage({ type: 'error', text: data.error || 'Failed to change password' });
      } else {
        setChangePasswordMessage({ type: 'success', text: 'Password changed successfully' });
        setChangePasswordData({ email: '', oldPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setShowChangePassword(false), 2000);
      }
    } catch (err) {
      setChangePasswordMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setChangePasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white-900 mb-2">Welcome Back</h1>
          <p className="text-white-600">Login to your DevEvent account</p>
        </div>

        {!showChangePassword ? (
          <>
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

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(true)}
                  className="text-blue-600 text-sm font-semibold hover:text-blue-700"
                >
                  Change password?
                </button>
              </div>

              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700">
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </>
        ) : (
          <>
            {changePasswordMessage && (
              <div className={`mb-6 p-4 rounded ${changePasswordMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <p>{changePasswordMessage.text}</p>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="form-container space-y-5">
              <div className="form-group">
                <label htmlFor="change-email" className="form-label form-label-required">
                  Email Address
                </label>
                <input
                  type="email"
                  id="change-email"
                  required
                  placeholder="your.email@example.com"
                  className="form-input"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  value={changePasswordData.email}
                  onChange={(e) => setChangePasswordData({ ...changePasswordData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="old-password" className="form-label form-label-required">
                  Old Password
                </label>
                <input
                  type="password"
                  id="old-password"
                  required
                  placeholder="Enter your current password"
                  className="form-input"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  value={changePasswordData.oldPassword}
                  onChange={(e) => setChangePasswordData({ ...changePasswordData, oldPassword: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-password" className="form-label form-label-required">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  required
                  placeholder="Enter new password (min 8 characters)"
                  className="form-input"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  value={changePasswordData.newPassword}
                  onChange={(e) => setChangePasswordData({ ...changePasswordData, newPassword: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password" className="form-label form-label-required">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  required
                  placeholder="Confirm new password"
                  className="form-input"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  value={changePasswordData.confirmPassword}
                  onChange={(e) => setChangePasswordData({ ...changePasswordData, confirmPassword: e.target.value })}
                />
              </div>

              <button type="submit" disabled={changePasswordLoading} className="form-button">
                {changePasswordLoading ? '⏳ Changing...' : '✓ Change Password'}
              </button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="text-blue-600 text-sm font-semibold hover:text-blue-700"
                >
                  Back to login
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
