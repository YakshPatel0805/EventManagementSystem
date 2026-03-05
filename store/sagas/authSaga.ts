import { call, put, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  signupRequest,
  signupSuccess,
  signupFailure,
  User,
} from '../slices/authSlice';

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

function* handleLogin(action: PayloadAction<LoginPayload>) {
  try {
    const response: Response = yield call(fetch, '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });

    const data: { success: boolean; data?: User; error?: string } = yield call(
      [response, 'json']
    );

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Login failed');
    }

    const user = data.data as User;
    localStorage.setItem('user', JSON.stringify(user));
    yield put(loginSuccess(user));

    // Redirect based on role
    if (typeof window !== 'undefined') {
      window.location.href = user.role === 'admin' ? '/admin/home' : '/home';
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    yield put(loginFailure(errorMessage));
  }
}

function* handleLogout() {
  try {
    localStorage.removeItem('user');
    yield put(logoutSuccess());

    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Logout failed';
    yield put(loginFailure(errorMessage));
  }
}

function* handleSignup(action: PayloadAction<SignupPayload>) {
  try {
    const response: Response = yield call(fetch, '/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });

    const data: { success: boolean; data?: User; error?: string } = yield call(
      [response, 'json']
    );

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Signup failed');
    }

    const user = data.data as User;
    localStorage.setItem('user', JSON.stringify(user));
    yield put(signupSuccess(user));

    if (typeof window !== 'undefined') {
      window.location.href = '/home';
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Signup failed';
    yield put(signupFailure(errorMessage));
  }
}

export function* authSaga() {
  yield takeEvery(loginRequest.type as any, handleLogin);
  yield takeEvery(logoutRequest.type as any, handleLogout);
  yield takeEvery(signupRequest.type as any, handleSignup);
}
