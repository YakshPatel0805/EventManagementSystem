import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Event from '@/models/Event';
import Booking from '@/models/Booking';

export async function GET(request: Request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 100); // Max 100 per page
    const cursor = url.searchParams.get('cursor'); // ObjectId of last item from previous page
    
    let query: any = {};
    
    // If cursor provided, fetch items after this cursor
    if (cursor) {
      query._id = { $gt: cursor };
    }

    // Fetch events with pagination
    const events = await Event.find(query)
      .sort({ _id: 1 })
      .limit(limit + 1); // Fetch one extra to determine if there are more pages

    // Check if there are more pages
    const hasMore = events.length > limit;
    const data = hasMore ? events.slice(0, limit) : events;

    // Fetch all pending bookings in a single query
    const pendingBookings = await Booking.find({ status: 'pending' }).select('eventId numberOfSeats');

    // Create a map of eventId -> total pending seats
    const pendingSeatsMap = new Map<string, number>();
    pendingBookings.forEach((booking) => {
      const eventId = booking.eventId.toString();
      const current = pendingSeatsMap.get(eventId) || 0;
      pendingSeatsMap.set(eventId, current + booking.numberOfSeats);
    });

    // Attach pending seats to each event
    const eventsWithPending = data.map((event) => ({
      ...event.toObject(),
      pendingSeats: pendingSeatsMap.get(event._id.toString()) || 0,
    }));

    // Get the cursor for next page
    const nextCursor = hasMore ? data[data.length - 1]._id : null;

    return NextResponse.json({ 
      success: true, 
      data: eventsWithPending,
      pagination: {
        nextCursor,
        hasMore
      }
    });
  } catch (error) {
    console.error('Failed to fetch events with pending bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
