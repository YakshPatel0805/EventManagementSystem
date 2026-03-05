import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logoutRequest: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    signupRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  signupRequest,
  signupSuccess,
  signupFailure,
  setUser,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
