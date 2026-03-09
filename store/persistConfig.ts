import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventsReducer from './slices/eventsSlice';
import bookingsReducer from './slices/bookingsSlice';

// Configure which parts of state to persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  // blacklist: ['events', 'bookings'], // Don't persist these (they should be fetched fresh)
};

// Auth-specific persist config
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated'], // Only persist user and auth status, not loading/error
};

// Combine reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  events: eventsReducer, // Not persisted - fetch fresh
  bookings: bookingsReducer, // Not persisted - fetch fresh
});

export default rootReducer;
