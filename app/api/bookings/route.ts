import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Booking from '@/models/Booking';
import Event from '@/models/Event';

export async function GET() {
  try {
    await connectDB();
    const bookings = await Booking.find({}).populate('eventId').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const event = await Event.findById(body.eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }
    
    if (event.bookedSeats + body.numberOfSeats > event.capacity) {
      return NextResponse.json(
        { success: false, error: 'Not enough seats available' },
        { status: 400 }
      );
    }
    
    // Calculate payment amount
    const paymentAmount = event.price * body.numberOfSeats;
    
    const booking = await Booking.create({
      ...body,
<<<<<<< HEAD
      eventName: event.title,
      eventDate: event.date,
      eventVenue: event.venue,
      paymentAmount,
      status: 'pending',
=======
      paymentAmount,
>>>>>>> f2c311adb61bb038bcbbc830b850bcf64d60cb0d
      paymentStatus: 'pending'
    });
    
    event.bookedSeats += body.numberOfSeats;
    await event.save();
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...booking.toObject(),
        eventPrice: event.price
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
