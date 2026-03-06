import { call, put, takeLatest } from 'redux-saga/effects';
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

interface FetchEventsPayload {
  limit?: number;
  cursor?: string | null;
}

function* handleFetchEvents(action: PayloadAction<FetchEventsPayload>) {
  try {
    const { limit = 10, cursor } = action.payload;
    let url = `/api/events/with-pending?limit=${limit}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }

    const response: Response = yield call(fetch, url, {
      method: 'GET',
    });

    const data: { success: boolean; data?: Event[]; pagination?: any; error?: string } = yield call(
      [response, 'json']
    );

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch events');
    }

    yield put(fetchEventsSuccess({ 
      events: data.data || [],
      pagination: data.pagination
    }));
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
  yield takeLatest(fetchEventsRequest.type as any, handleFetchEvents);
  yield takeLatest(createEventRequest.type as any, handleCreateEvent);
}
