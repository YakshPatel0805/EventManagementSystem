import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  bookedSeats: number;
  price: number;
  image?: string;
}

interface EventsState {
  events: Event[];
  selectedEvent: Event | null;
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    fetchEventsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEventsSuccess: (state, action: PayloadAction<Event[]>) => {
      state.loading = false;
      state.events = action.payload;
    },
    fetchEventsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
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
  createEventRequest,
  createEventSuccess,
  createEventFailure,
  setSelectedEvent,
  clearError,
} = eventsSlice.actions;

export default eventsSlice.reducer;
