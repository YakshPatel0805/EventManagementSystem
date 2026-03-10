import Image from "next/image";
import connectDB from "@/lib/mongoose";
import Event from "@/models/Event";
import Booking from "@/models/Booking";
import EventDetailClient from "@/components/EventDetailClient";
import { notFound } from "next/navigation";
import mongoose from "mongoose";

interface Props {
  params: Promise<{ id: string }>;
}

interface BookingData {
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

    // Get pending bookings for this event with populated event data
    const pendingBookings = await Booking.find({
      eventId: id,
      status: 'pending'
    }).populate('eventId').lean();

    const pendingSeats = pendingBookings.reduce((total, booking) => total + booking.numberOfSeats, 0);
    const availableSeats = event.capacity - event.bookedSeats;

    // Convert to plain objects for client component
    const plainEvent = JSON.parse(JSON.stringify(event));
    const plainPendingBookings = JSON.parse(JSON.stringify(pendingBookings));

    return (
      <EventDetailClient
        event={plainEvent}
        pendingBookings={plainPendingBookings as BookingData[]}
        pendingSeats={pendingSeats}
        availableSeats={availableSeats}
        eventImage={event.image}
      />
    );
  } catch (error) {
    console.error('Error loading event:', error);
    notFound();
  }
};

export default EventDetailPage;
