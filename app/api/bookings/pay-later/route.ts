import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Booking from '@/models/Booking';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Keep booking as pending since payment is pending
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: 'pending',
        paymentStatus: 'pending'
      },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Ticket confirmed! Please complete payment later.'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save booking' },
      { status: 500 }
    );
  }
}
