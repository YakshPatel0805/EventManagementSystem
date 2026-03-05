import mongoose, { Schema, model, models } from 'mongoose';

export interface IBooking {
  eventId: mongoose.Types.ObjectId;
<<<<<<< HEAD
  eventName: string;
  eventDate: Date;
  eventVenue: string;
=======
>>>>>>> f2c311adb61bb038bcbbc830b850bcf64d60cb0d
  userName: string;
  userEmail: string;
  numberOfSeats: number;
  bookingDate: Date;
<<<<<<< HEAD
  status: 'pending' | 'confirmed' | 'cancelled';
=======
  status: 'confirmed' | 'cancelled';
>>>>>>> f2c311adb61bb038bcbbc830b850bcf64d60cb0d
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentAmount: number;
  paymentMethod?: string;
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
<<<<<<< HEAD
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventVenue: { type: String, required: true },
=======
>>>>>>> f2c311adb61bb038bcbbc830b850bcf64d60cb0d
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    numberOfSeats: { type: Number, required: true, default: 1 },
    bookingDate: { type: Date, default: Date.now },
<<<<<<< HEAD
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
=======
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
>>>>>>> f2c311adb61bb038bcbbc830b850bcf64d60cb0d
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentAmount: { type: Number, required: true },
    paymentMethod: { type: String },
    transactionId: { type: String }
  },
  { timestamps: true }
);

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
