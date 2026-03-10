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

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    if (booking.status !== 'cancelled') {
      return NextResponse.json(
        { success: false, error: 'Only cancelled bookings can have refunds approved' },
        { status: 400 }
      );
    }

    if (booking.paymentStatus === 'refunded') {
      return NextResponse.json(
        { success: false, error: 'Refund already approved for this booking' },
        { status: 400 }
      );
    }

    if (booking.paymentStatus !== 'refund-pending') {
      return NextResponse.json(
        { success: false, error: 'Only bookings with pending refunds can be approved' },
        { status: 400 }
      );
    }

    // Update payment status to refunded
    booking.paymentStatus = 'refunded';
    booking.refundApprovedAt = new Date();
    await booking.save();

    return NextResponse.json({
      success: true,
      message: 'Refund approved successfully',
      data: booking
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to approve refund' },
      { status: 500 }
    );
  }
}
