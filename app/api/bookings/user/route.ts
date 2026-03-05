import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Booking from '@/models/Booking';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const bookings = await Booking.find({ userEmail: email })
      .populate('eventId')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
