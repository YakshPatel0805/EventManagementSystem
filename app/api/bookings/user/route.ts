import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Booking from '@/models/Booking';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // Max 100 per page
    const cursor = searchParams.get('cursor'); // ObjectId of last item from previous page

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const query: any = { userEmail: email };
    
    // If cursor provided, fetch items after this cursor
    if (cursor) {
      query._id = { $gt: cursor };
    }

    const bookings = await Booking.find(query)
      .populate('eventId', 'title date time venue price image description')
      .sort({ _id: -1 })
      .limit(limit + 1); // Fetch one extra to determine if there are more pages

    // Check if there are more pages
    const hasMore = bookings.length > limit;
    const data = hasMore ? bookings.slice(0, limit) : bookings;

    // Get the cursor for next page
    const nextCursor = hasMore ? data[data.length - 1]._id : null;

    const response = { 
      success: true, 
      data,
      pagination: {
        nextCursor,
        hasMore
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}