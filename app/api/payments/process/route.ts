import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Booking from '@/models/Booking';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { bookingId, paymentMethod, cardNumber } = body;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Simulate payment processing
    // In production, integrate with real payment gateway (Stripe, PayPal, etc.)
    const paymentSuccess = await simulatePayment(cardNumber);

    if (paymentSuccess) {
      // Update booking with payment details
      booking.paymentStatus = 'completed';
      booking.paymentMethod = paymentMethod;
      booking.transactionId = generateTransactionId();
      await booking.save();

      return NextResponse.json({
        success: true,
        data: {
          bookingId: booking._id,
          paymentStatus: booking.paymentStatus,
          transactionId: booking.transactionId
        }
      });
    } else {
      // Payment failed
      booking.paymentStatus = 'failed';
      await booking.save();

      return NextResponse.json(
        { success: false, error: 'Payment failed. Please try again.' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

// Simulate payment processing (replace with real payment gateway)
async function simulatePayment(cardNumber: string): Promise<boolean> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demo: card numbers ending in even digits succeed
  const lastDigit = parseInt(cardNumber.slice(-1));
  return lastDigit % 2 === 0;
}

// Generate a random transaction ID
function generateTransactionId(): string {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}
