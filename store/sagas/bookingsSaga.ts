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
  cancelBookingRequest,
  cancelBookingSuccess,
  cancelBookingFailure,
  Booking,
  CancelBookingResponse,
} from '../slices/bookingsSlice';

interface CreateBookingPayload {
  userId: string;
  eventId: string;
  numberOfSeats: number;
}

interface PayLaterPayload {
  bookingId: string;
}

interface CancelBookingPayload {
  bookingId: string;
  reason?: string;
}

/* FETCH BOOKINGS */

function* handleFetchBookings() {
  try {
    const response: Response = yield call(fetch, '/api/bookings', {
      method: 'GET',
    });

    const data: { success: boolean; data?: Booking[]; error?: string } =
      yield call([response, 'json']);

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch bookings');
    }

    yield put(fetchBookingsSuccess(data.data || []));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch bookings';

    yield put(fetchBookingsFailure(errorMessage));
  }
}

/* CREATE BOOKING */

function* handleCreateBooking(
  action: PayloadAction<CreateBookingPayload>
) {
  try {
    const response: Response = yield call(fetch, '/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });

    const data: { success: boolean; data?: Booking; error?: string } =
      yield call([response, 'json']);

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to create booking');
    }

    yield put(createBookingSuccess(data.data as Booking));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create booking';

    yield put(createBookingFailure(errorMessage));
  }
}

/* PAY LATER */

function* handlePayLater(
  action: PayloadAction<PayLaterPayload>
) {
  try {
    const response: Response = yield call(fetch, '/api/bookings/pay-later', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });

    const data: { success: boolean; data?: Booking; error?: string } =
      yield call([response, 'json']);

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to save booking');
    }

    yield put(payLaterSuccess(data.data as Booking));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to save booking';

    yield put(payLaterFailure(errorMessage));
  }
}

/* CANCEL BOOKING */

function* handleCancelBooking(
  action: PayloadAction<CancelBookingPayload>
) {
  try {
    const response: Response = yield call(fetch, '/api/bookings/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });

    const data: { success: boolean; data?: CancelBookingResponse; error?: string } =
      yield call([response, 'json']);

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to cancel booking');
    }

    yield put(cancelBookingSuccess(data.data as CancelBookingResponse));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to cancel booking';

    yield put(cancelBookingFailure(errorMessage));
  }
}

/* ROOT SAGA */

export function* bookingsSaga() {
  yield takeEvery(fetchBookingsRequest.type, handleFetchBookings);
  yield takeEvery(createBookingRequest.type, handleCreateBooking);
  yield takeEvery(payLaterRequest.type, handlePayLater);
  yield takeEvery(cancelBookingRequest.type, handleCancelBooking);
}