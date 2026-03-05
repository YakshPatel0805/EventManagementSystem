import { call, put, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchEventsRequest,
  fetchEventsSuccess,
  fetchEventsFailure,
  createEventRequest,
  createEventSuccess,
  createEventFailure,
  Event,
} from '../slices/eventsSlice';

interface CreateEventPayload {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  price: number;
  image?: string;
}

function* handleFetchEvents() {
  try {
    const response: Response = yield call(fetch, '/api/events', {
      method: 'GET',
    });

    const data: { success: boolean; data?: Event[]; error?: string } = yield call(
      [response, 'json']
    );

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch events');
    }

    yield put(fetchEventsSuccess(data.data || []));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch events';
    yield put(fetchEventsFailure(errorMessage));
  }
}

function* handleCreateEvent(action: PayloadAction<CreateEventPayload>) {
  try {
    const response: Response = yield call(fetch, '/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });

    const data: { success: boolean; data?: Event; error?: string } = yield call(
      [response, 'json']
    );

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to create event');
    }

    yield put(createEventSuccess(data.data as Event));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
    yield put(createEventFailure(errorMessage));
  }
}

export function* eventsSaga() {
  yield takeEvery(fetchEventsRequest.type as any, handleFetchEvents);
  yield takeEvery(createEventRequest.type as any, handleCreateEvent);
}
