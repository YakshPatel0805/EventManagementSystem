import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Booking from '@/models/Booking';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const cursor = searchParams.get('cursor');

    const query: any = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    if (cursor) {
      query._id = { $gt: cursor };
    }

    const bookings = await Booking.find(query)
      .populate('eventId', 'title date time venue price')
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = bookings.length > limit;
    const data = hasMore ? bookings.slice(0, limit) : bookings;
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
