import mongoose, { Schema, model, models } from 'mongoose';

export interface IBooking {
  eventId: mongoose.Types.ObjectId;
  eventName: string;
  eventDate: Date;
  eventVenue: string;
  userName: string;
  userEmail: string;
  numberOfSeats: number;
  bookingDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentAmount: number;
  paymentMethod?: string;
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventVenue: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    numberOfSeats: { type: Number, required: true, default: 1 },
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    paymentAmount: { type: Number, required: true },
    paymentMethod: { type: String },
    transactionId: { type: String }
  },
  { timestamps: true }
);

// Compound index for filtering by eventId and status
BookingSchema.index({ eventId: 1, status: 1 });

// Index for filtering by userEmail
BookingSchema.index({ userEmail: 1 });

// Index for sorting by createdAt
BookingSchema.index({ createdAt: -1 });

// Compound index for user bookings with status
BookingSchema.index({ userEmail: 1, status: 1 });

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
