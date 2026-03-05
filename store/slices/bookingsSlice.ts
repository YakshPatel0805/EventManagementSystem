import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Booking {
  _id: string;
  userId: string;
  eventId: string;
  numberOfSeats: number;
  paymentAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface BookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  loading: false,
  error: null,
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
      const index = state.bookings.findIndex(b => b._id === action.payload._id);
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
  clearError,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
