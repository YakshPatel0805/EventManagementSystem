import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Booking from '@/models/Booking';
import Event from '@/models/Event';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // Max 100 per page
    const cursor = searchParams.get('cursor'); // ObjectId of last item from previous page

    const query: any = {};
    if (eventId) query.eventId = eventId;
    if (status) query.status = status;
    
    // If cursor provided, fetch items after this cursor
    if (cursor) {
      query._id = { $gt: cursor };
    }

    const bookings = await Booking.find(query)
      .populate('eventId', 'title date time venue')
      .sort({ _id: -1 })
      .limit(limit + 1); // Fetch one extra to determine if there are more pages

    // Check if there are more pages
    const hasMore = bookings.length > limit;
    const data = hasMore ? bookings.slice(0, limit) : bookings;

    // Get the cursor for next page
    const nextCursor = hasMore ? data[data.length - 1]._id : null;

    return NextResponse.json({ 
      success: true, 
      data,
      pagination: {
        nextCursor,
        hasMore
      }
    });
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
    
    // Fetch event to get price and validate
    const event = await Event.findById(body.eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Calculate payment amount
    const paymentAmount = event.price * body.numberOfSeats;
    
    // Use atomic operation to increment bookedSeats and check capacity in one operation
    const updatedEvent = await Event.findByIdAndUpdate(
      body.eventId,
      {
        $inc: { bookedSeats: body.numberOfSeats }
      },
      { new: true }
    );
    
    // Check if capacity was exceeded after the atomic increment
    if (updatedEvent && updatedEvent.bookedSeats > updatedEvent.capacity) {
      // Rollback the increment if capacity exceeded
      await Event.findByIdAndUpdate(
        body.eventId,
        {
          $inc: { bookedSeats: -body.numberOfSeats }
        }
      );
      
      return NextResponse.json(
        { success: false, error: 'Not enough seats available' },
        { status: 400 }
      );
    }
    
    // Create booking after successful seat reservation
    const booking = await Booking.create({
      ...body,
      eventName: event.title,
      eventDate: event.date,
      eventVenue: event.venue,
      paymentAmount,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
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
