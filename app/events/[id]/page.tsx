import Image from "next/image";
import connectDB from "@/lib/mongoose";
import Event from "@/models/Event";
import BookingForm from "@/components/BookingForm";
import { notFound } from "next/navigation";
import mongoose from "mongoose";

interface Props {
  params: Promise<{ id: string }>;
}

const EventDetailPage = async ({ params }: Props) => {
  try {
    const { id } = await params;
    console.log('Fetching event with ID:', id);

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format');
      notFound();
    }

    await connectDB();
    console.log('MongoDB connected');

    const event = await Event.findById(id).lean();
    console.log('Event found:', event ? 'Yes' : 'No');

    if (!event) {
      console.log('Event not found, returning 404');
      notFound();
    }

    const availableSeats = event.capacity - event.bookedSeats;

    return (
      <section className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="w-full grid lg:grid-cols-2 gap-10 items-start">
          <div className="w-full space-y-4">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <Image
                src={event.image}
                alt={event.title}
                width={700}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>

          <div className="w-full space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-center text-white-900">{ event.title }</h1>

              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                {availableSeats > 0 ? `${availableSeats} seats available` : 'Fully Booked'}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>

              <div className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg">
                  <Image src="/icons/calendar.svg" alt="date" width={24} height={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date</p>
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
                <div className="bg-white p-2 rounded-lg">
                  <Image src="/icons/clock.svg" alt="time" width={24} height={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Time</p>
                  <p className="text-lg font-semibold text-gray-900">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg">
                  <Image src="/icons/pin.svg" alt="venue" width={24} height={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Venue</p>
                  <p className="text-lg font-semibold text-gray-900">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg">
                  <Image src="/icons/audience.svg" alt="capacity" width={24} height={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Capacity</p>
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
  } catch (error) {
    console.error('Error loading event:', error);
    notFound();
  }
};

export default EventDetailPage;
