'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BookingForm from './BookingForm';
import PendingBookings from './PendingBookings';
import { Clock, Calendar, MapPinned, Users } from 'lucide-react';

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

interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: Date;
  time: string;
  venue: string;
  capacity: number;
  bookedSeats: number;
  price: number;
  refundPolicy?: string;
}

interface Props {
  event: Event;
  pendingBookings: Booking[];
  pendingSeats: number;
  availableSeats: number;
  eventImage: string;
}

const EventDetailClient = ({ event, pendingBookings, pendingSeats, availableSeats, eventImage }: Props) => {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePaymentSuccess = () => {
    setRefreshKey(prev => prev + 1);
    router.refresh();
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-10 pt-20">
      <div className="w-full grid lg:grid-cols-2 gap-10 items-start">
        <div className="w-full space-y-4">
          <div className="relative overflow-hidden rounded-xl shadow-lg">
            <Image
              src={eventImage}
              alt={event.title}
              width={600}
              height={400}
              priority
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
        </div>

        <div className="w-full space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-center text-white-900">{event.title}</h1>

            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {availableSeats > 0 
                ? `${availableSeats} seats available${pendingSeats > 0 ? ` and ${pendingSeats} tickets on hold` : ''}`
                : 'Fully Booked'
              }
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>

            <div className="flex items-start gap-4">
              <div className="bg-black p-2 rounded-lg">
                <Calendar />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-black p-2 rounded-lg">
                <Clock />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Time</p>
                <p className="text-lg font-semibold text-gray-900">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-black p-2 rounded-lg">
                <MapPinned />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Venue</p>
                <p className="text-lg font-semibold text-gray-900">{event.venue}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-black p-2 rounded-lg">
                <Users />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Capacity</p>
                <p className="text-lg font-semibold text-gray-900">
                  {event.capacity} total seats ({event.bookedSeats} booked)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this event</h2>
            <p className="text-gray-700 leading-relaxed text-base">{event.description}</p>
          </div>

          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Policy</h2>
            <p className="text-gray-700 leading-relaxed text-base">{event.refundPolicy || 'No refunds available for this event.'}</p>
          </div>

          {pendingBookings.length > 0 && (
            <PendingBookings 
              key={refreshKey}
              bookings={pendingBookings} 
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}

          {availableSeats > 0 ? (
            <BookingForm
              eventId={event._id.toString()}
              availableSeats={availableSeats}
              eventPrice={event.price}
            />
          ) : (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-700 font-bold text-lg">⚠️ This event is fully booked</p>
              <p className="text-red-600 text-sm mt-2">All {event.capacity} seats have been reserved</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventDetailClient;
