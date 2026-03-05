'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const LandingPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Redirect logged-in users to their respective pages
      if (parsedUser.role === 'admin') {
        router.push('/admin/home');
      } else {
        router.push('/home');
      }
    }
  }, [router]);

  // Don't show landing page if user is logged in
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Image 
              src="/icons/logo.png" 
              alt="DevEvent Logo" 
              width={120} 
              height={120}
              className="mx-auto mb-6"
            />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to DevEvent
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The ultimate platform for developers to discover, book, and manage amazing tech events
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
            >
              Get Started - Sign Up
            </Link>
            <Link
              href="/login"
              className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
            >
              Already a Member? Login
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Free to Join</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Easy Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Instant Confirmation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-100">
            Why Choose DevEvent?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-blue-500 transition">
              <div className="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Image src="/icons/calendar.svg" alt="Events" width={32} height={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-100">Discover Events</h3>
              <p className="text-gray-400">
                Browse through a curated list of tech conferences, workshops, and meetups tailored for developers.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-purple-500 transition">
              <div className="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Image src="/icons/audience.svg" alt="Booking" width={32} height={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-100">Easy Booking</h3>
              <p className="text-gray-400">
                Book your spot in seconds with our streamlined booking process. Get instant confirmation via email.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-pink-500 transition">
              <div className="bg-pink-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Image src="/icons/mode.svg" alt="Management" width={32} height={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-100">Manage Bookings</h3>
              <p className="text-gray-400">
                Track all your event bookings in one place. View event details and manage your schedule effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-100">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">Sign Up</h3>
              <p className="text-gray-400">Create your free account in seconds</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">Browse Events</h3>
              <p className="text-gray-400">Explore upcoming tech events</p>
            </div>

            <div className="text-center">
              <div className="bg-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">Book Your Spot</h3>
              <p className="text-gray-400">Reserve your seat instantly</p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">Attend & Learn</h3>
              <p className="text-gray-400">Join the event and network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-blue-400 mb-2">500+</div>
              <p className="text-gray-400">Events Hosted</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-purple-400 mb-2">10K+</div>
              <p className="text-gray-400">Active Users</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-pink-400 mb-2">50K+</div>
              <p className="text-gray-400">Bookings Made</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers discovering and attending amazing tech events
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="bg-blue-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-900 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2026 DevEvent. All rights reserved.</p>
          <p className="mt-2 text-sm">Connecting developers through amazing events</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
