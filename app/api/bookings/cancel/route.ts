import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Booking from '@/models/Booking';
import Event from '@/models/Event';

/**
 * Refund Policy:
 * - More than 7 days before event: 100% refund
 * - 3-7 days before event: 50% refund
 * - Less than 3 days before event: No refund
 */
function calculateRefundAmount(eventDate: Date, paymentAmount: number): number {
  const now = new Date();
  const daysUntilEvent = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilEvent > 7) {
    return paymentAmount; // 100% refund
  } else if (daysUntilEvent >= 3) {
    return paymentAmount * 0.5; // 50% refund
  } else {
    return 0; // No refund
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { bookingId, reason } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { success: false, error: 'Booking is already cancelled' },
        { status: 400 }
      );
    }

    // Check if event has already passed
    const now = new Date();
    if (booking.eventDate < now) {
      return NextResponse.json(
        { success: false, error: 'Cannot cancel booking for past events' },
        { status: 400 }
      );
    }

    // Calculate refund amount based on policy
    const refundAmount = calculateRefundAmount(booking.eventDate, booking.paymentAmount);

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = refundAmount > 0 ? 'refunded' : booking.paymentStatus;
    booking.refundAmount = refundAmount;
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date();
    await booking.save();

    // Release the seats back to the event
    await Event.findByIdAndUpdate(booking.eventId, {
      $inc: { bookedSeats: -booking.numberOfSeats }
    });

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        bookingId: booking._id,
        status: booking.status,
        refundAmount,
        refundPercentage: refundAmount > 0 ? Math.round((refundAmount / booking.paymentAmount) * 100) : 0,
        originalAmount: booking.paymentAmount,
        reason
      }
    });
  } catch (error) {
    console.error('Cancellation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
