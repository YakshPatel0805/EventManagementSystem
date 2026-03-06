import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  capacity: number;
  bookedSeats: number;
  price: number;
  image?: string;
  pendingSeats?: number;
}

interface PaginationInfo {
  nextCursor: string | null;
  hasMore: boolean;
}

interface EventsState {
  events: Event[];
  selectedEvent: Event | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
}

const initialState: EventsState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
  pagination: { nextCursor: null, hasMore: false },
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    fetchEventsRequest: (state, action: PayloadAction<{ limit?: number; cursor?: string | null }>) => {
      state.loading = true;
      state.error = null;
    },
    fetchEventsSuccess: (state, action: PayloadAction<{ events: Event[]; pagination: PaginationInfo }>) => {
      state.loading = false;
      state.events = action.payload.events;
      state.pagination = action.payload.pagination;
    },
    fetchEventsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    loadMoreEventsSuccess: (state, action: PayloadAction<{ events: Event[]; pagination: PaginationInfo }>) => {
      state.loading = false;
      state.events = [...state.events, ...action.payload.events];
      state.pagination = action.payload.pagination;
    },
    createEventRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createEventSuccess: (state, action: PayloadAction<Event>) => {
      state.loading = false;
      state.events.push(action.payload);
    },
    createEventFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedEvent: (state, action: PayloadAction<Event | null>) => {
      state.selectedEvent = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchEventsRequest,
  fetchEventsSuccess,
  fetchEventsFailure,
  loadMoreEventsSuccess,
  createEventRequest,
  createEventSuccess,
  createEventFailure,
  setSelectedEvent,
  clearError,
} = eventsSlice.actions;

export default eventsSlice.reducer;
