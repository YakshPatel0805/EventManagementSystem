import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Booking {
  _id: string;
  userId?: string;
  eventId: string | { _id: string; title: string; date: string; time: string; venue: string };
  numberOfSeats: number;
  paymentAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'refund-pending';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
  refundAmount?: number;
  userName?: string;
  userEmail?: string;
  bookingDate?: string;
  transactionId?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  [key: string]: any;
}

export interface CancelBookingResponse {
  bookingId: string;
  status: string;
  refundAmount: number;
  refundPercentage: number;
  originalAmount: number;
  reason?: string;
}

interface BookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  loading: false,
  error: null
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    fetchBookingsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBookingsSuccess: (state, action: PayloadAction<Booking[]>) => {
      state.loading = false;
      state.bookings = action.payload;
    },
    fetchBookingsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    createBookingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createBookingSuccess: (state, action: PayloadAction<Booking>) => {
      state.loading = false;
      state.bookings.push(action.payload);
    },
    createBookingFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    payLaterRequest: (state, action: PayloadAction<{ bookingId: string }>) => {
      state.loading = true;
      state.error = null;
    },
    payLaterSuccess: (state, action: PayloadAction<Booking>) => {
      state.loading = false;
      const index = state.bookings.findIndex(
        (b) => b._id === action.payload._id
      );
      if (index !== -1) {
        state.bookings[index] = action.payload;
      } else {
        state.bookings.push(action.payload);
      }
    },
    payLaterFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    cancelBookingRequest: (state, action: PayloadAction<{ bookingId: string; reason?: string }>) => {
      state.loading = true;
      state.error = null;
    },
    cancelBookingSuccess: (state, action: PayloadAction<CancelBookingResponse>) => {
      state.loading = false;
      const index = state.bookings.findIndex(
        (b) => b._id === action.payload.bookingId
      );
      if (index !== -1) {
        state.bookings[index].status = 'cancelled';
        state.bookings[index].paymentStatus = action.payload.refundAmount > 0 ? 'refunded' : state.bookings[index].paymentStatus;
        state.bookings[index].refundAmount = action.payload.refundAmount;
        state.bookings[index].cancellationReason = action.payload.reason;
        state.bookings[index].cancelledAt = new Date().toISOString();
      }
    },
    cancelBookingFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchBookingsRequest,
  fetchBookingsSuccess,
  fetchBookingsFailure,
  createBookingRequest,
  createBookingSuccess,
  createBookingFailure,
  payLaterRequest,
  payLaterSuccess,
  payLaterFailure,
  cancelBookingRequest,
  cancelBookingSuccess,
  cancelBookingFailure,
  clearError,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;