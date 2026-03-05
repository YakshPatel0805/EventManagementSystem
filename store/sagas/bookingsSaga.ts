import { call, put, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchBookingsRequest,
  fetchBookingsSuccess,
  fetchBookingsFailure,
  createBookingRequest,
  createBookingSuccess,
  createBookingFailure,
  payLaterRequest,
  payLaterSuccess,
  payLaterFailure,
  Booking,
} from '../slices/bookingsSlice';

interface CreateBookingPayload {
  userId: string;
  eventId: string;
  numberOfSeats: number;
}

interface PayLaterPayload {
  bookingId: string;
}

function* handleFetchBookings() {
  try {
    const response: Response = yield call(fetch, '/api/bookings', {
      method: 'GET',
    });

    const data: { success: boolean; data?: Booking[]; error?: string } = yield call(
      [response, 'json']
    );

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch bookings');
    }

    yield put(fetchBookingsSuccess(data.data || []));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookings';
    yield put(fetchBookingsFailure(errorMessage));
  }
}

function* handleCreateBooking(action: PayloadAction<CreateBookingPayload>) {
  try {
    const response: Response = yield call(fetch, '/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });

    const data: { success: boolean; data?: Booking; error?: string } = yield call(
      [response, 'json']
    );

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to create booking');
    }

    yield put(createBookingSuccess(data.data as Booking));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
    yield put(createBookingFailure(errorMessage));
  }
}

function* handlePayLater(action: PayloadAction<PayLaterPayload>) {
  try {
    const response: Response = yield call(fetch, '/api/bookings/pay-later', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });

    const data: { success: boolean; data?: Booking; error?: string } = yield call(
      [response, 'json']
    );

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to save booking');
    }

    yield put(payLaterSuccess(data.data as Booking));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to save booking';
    yield put(payLaterFailure(errorMessage));
  }
}

export function* bookingsSaga() {
  yield takeEvery(fetchBookingsRequest.type as any, handleFetchBookings);
  yield takeEvery(createBookingRequest.type as any, handleCreateBooking);
  yield takeEvery(payLaterRequest.type as any, handlePayLater);
}
