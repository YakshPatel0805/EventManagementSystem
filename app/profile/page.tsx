'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }
      setProfile(user);
      setFormData({ name: user.name, email: user.email });
      setIsLoading(false);
    }
  }, [user, loading, router]);

  const handleSaveProfile = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage('Name and email are required');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile?.id,
          name: formData.name,
          email: formData.email
        })
      });

      const data = await response.json();

      if (!data.success) {
        setErrorMessage(data.error || 'Failed to update profile');
        setIsSaving(false);
        return;
      }

      // Update local profile state
      setProfile({
        ...profile!,
        name: data.data.name,
        email: data.data.email
      });

      // Update localStorage
      const updatedUser = {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: profile?.name || '', email: profile?.email || '' });
    setIsEditing(false);
    setErrorMessage('');
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center pt-20">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  const roleLabel = profile.role === 'admin' ? 'Administrator' : 'User';
  const roleBadgeColor = profile.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 pt-24">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link 
          href={profile.role === 'admin' ? '/admin/home' : '/home'}
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition mb-8"
        >
          <span className="mr-2">←</span>
          Back
        </Link>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 font-semibold">✓ {successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-semibold">✗ {errorMessage}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-slate-800 rounded-lg shadow-2xl overflow-hidden border border-slate-700">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar and Name */}
            <div className="flex flex-col items-center -mt-16 mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-lg mb-4">
                <span className="text-5xl font-bold text-white">
                  {formData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white text-center">{formData.name}</h1>
              <span className={`${roleBadgeColor} text-white px-4 py-1 rounded-full text-sm font-semibold mt-3`}>
                {roleLabel}
              </span>
            </div>

            {/* Profile Information */}
            {!isEditing ? (
              <div className="space-y-6">
                {/* Email */}
                <div className="border-b border-slate-700 pb-6">
                  <label className="text-slate-400 text-sm font-semibold uppercase tracking-wide">Email Address</label>
                  <p className="text-white text-lg mt-2">{profile.email}</p>
                </div>

                {/* Username */}
                <div className="border-b border-slate-700 pb-6">
                  <label className="text-slate-400 text-sm font-semibold uppercase tracking-wide">Username</label>
                  <p className="text-white text-lg mt-2 capitalize">{profile.name}</p>
                </div>

                {/* Account Status */}
                <div>
                  <label className="text-slate-400 text-sm font-semibold uppercase tracking-wide">Account Status</label>
                  <p className="text-white text-lg mt-2 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Active
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Name Input */}
                <div>
                  <label className="text-slate-400 text-sm font-semibold uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-2 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="text-slate-400 text-sm font-semibold uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full mt-2 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Account Type (Read-only) */}
                <div>
                  <label className="text-slate-400 text-sm font-semibold uppercase tracking-wide">Account Type</label>
                  <p className="text-white text-lg mt-2 capitalize">{profile.role}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                  >
                    ✏️ Edit Profile
                  </button>
                  <Link
                    href={profile.role === 'admin' ? '/admin/home' : '/home'}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition text-center"
                  >
                    Back to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    {isSaving ? '⏳ Saving...' : '✓ Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {/* <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-white font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.role === 'user' && (
              <>
                <Link
                  href="/users"
                  className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg transition text-center"
                >
                  My Bookings
                </Link>
                <Link
                  href="/home"
                  className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg transition text-center"
                >
                  Browse Events
                </Link>
              </>
            )}
            {profile.role === 'admin' && (
              <>
                <Link
                  href="/admin/bookings"
                  className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg transition text-center"
                >
                  Manage Bookings
                </Link>
                <Link
                  href="/admin/home"
                  className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg transition text-center"
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
