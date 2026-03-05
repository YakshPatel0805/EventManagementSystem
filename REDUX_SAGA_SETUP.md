# Redux Saga Integration Guide

## Overview
Redux Saga has been integrated into your Next.js project to manage complex async operations and side effects. This replaces the need for manual async handling in components.

## Project Structure

```
store/
├── index.ts              # Store configuration
├── hooks.ts              # Custom Redux hooks
├── slices/
│   ├── authSlice.ts      # Auth state management
│   ├── eventsSlice.ts    # Events state management
│   └── bookingsSlice.ts  # Bookings state management
└── sagas/
    ├── index.ts          # Root saga
    ├── authSaga.ts       # Auth side effects
    ├── eventsSaga.ts     # Events side effects
    └── bookingsSaga.ts   # Bookings side effects
```

## Installation

Run the following command to install dependencies:

```bash
npm install
```

This will install:
- `@reduxjs/toolkit` - Redux state management
- `react-redux` - React bindings for Redux
- `redux-saga` - Side effects management

## Key Features

### 1. Auth Management
**File:** `store/slices/authSlice.ts` & `store/sagas/authSaga.ts`

Actions:
- `loginRequest(credentials)` - Initiates login
- `signupRequest(userData)` - Initiates signup
- `logoutRequest()` - Initiates logout

Example usage:
```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginRequest } from '@/store/slices/authSlice';

function LoginComponent() {
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector(state => state.auth);

  const handleLogin = (email: string, password: string) => {
    dispatch(loginRequest({ email, password }));
  };

  return (
    // Your component JSX
  );
}
```

### 2. Events Management
**File:** `store/slices/eventsSlice.ts` & `store/sagas/eventsSaga.ts`

Actions:
- `fetchEventsRequest()` - Fetches all events
- `createEventRequest(eventData)` - Creates a new event

Example usage:
```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchEventsRequest } from '@/store/slices/eventsSlice';

function EventsComponent() {
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector(state => state.events);

  useEffect(() => {
    dispatch(fetchEventsRequest());
  }, [dispatch]);

  return (
    // Your component JSX
  );
}
```

### 3. Bookings Management
**File:** `store/slices/bookingsSlice.ts` & `store/sagas/bookingsSaga.ts`

Actions:
- `fetchBookingsRequest()` - Fetches all bookings
- `createBookingRequest(bookingData)` - Creates a new booking

Example usage:
```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createBookingRequest } from '@/store/slices/bookingsSlice';

function BookingComponent() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.bookings);

  const handleBooking = (eventId: string, numberOfSeats: number) => {
    dispatch(createBookingRequest({
      userId: 'user-id',
      eventId,
      numberOfSeats
    }));
  };

  return (
    // Your component JSX
  );
}
```

## How Redux Saga Works

### Request Flow
1. Component dispatches an action (e.g., `loginRequest`)
2. Saga middleware intercepts the action
3. Saga makes the API call
4. On success: dispatches success action with data
5. On error: dispatches failure action with error message
6. Component re-renders with updated state

### Example: Login Flow
```
User clicks login
    ↓
dispatch(loginRequest({ email, password }))
    ↓
authSaga intercepts loginRequest
    ↓
Saga calls fetch('/api/auth/login')
    ↓
Success: dispatch(loginSuccess(user))
    ↓
Component receives updated user state
    ↓
Redirect to /home or /admin/home
```

## Custom Hooks

Use the provided hooks for type-safe Redux access:

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// In your component
const dispatch = useAppDispatch();
const authState = useAppSelector(state => state.auth);
const eventsState = useAppSelector(state => state.events);
const bookingsState = useAppSelector(state => state.bookings);
```

## Migrating from Context API

### Before (Context API):
```typescript
const { user, login, logout, loading } = useAuth();
```

### After (Redux):
```typescript
const dispatch = useAppDispatch();
const { user, loading, error } = useAppSelector(state => state.auth);

const handleLogin = (email, password) => {
  dispatch(loginRequest({ email, password }));
};
```

## Error Handling

All slices include error state management:

```typescript
const { error } = useAppSelector(state => state.auth);

if (error) {
  return <div className="error">{error}</div>;
}
```

Clear errors when needed:
```typescript
import { clearError } from '@/store/slices/authSlice';

dispatch(clearError());
```

## Adding New Features

To add a new feature (e.g., payments):

1. Create a slice: `store/slices/paymentsSlice.ts`
2. Create a saga: `store/sagas/paymentsSaga.ts`
3. Add to root saga: `store/sagas/index.ts`
4. Use in components with custom hooks

## Best Practices

1. **Always use custom hooks** - `useAppDispatch` and `useAppSelector` for type safety
2. **Handle loading states** - Show spinners while requests are pending
3. **Display errors** - Show error messages to users
4. **Dispatch on mount** - Use `useEffect` to fetch data when components mount
5. **Keep sagas pure** - Avoid side effects outside of sagas
6. **Use selectors** - Create reusable selectors for complex state queries

## Debugging

Redux DevTools are automatically enabled in development. You can:
- View all dispatched actions
- Time-travel through state changes
- Inspect state at each step

Install Redux DevTools browser extension for enhanced debugging.

## Next Steps

1. Update existing components to use Redux instead of Context API
2. Create additional slices for other features (payments, notifications, etc.)
3. Add selectors for complex state queries
4. Implement error boundaries for better error handling
