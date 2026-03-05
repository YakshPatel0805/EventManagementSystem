import { fork } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { eventsSaga } from './eventsSaga';
import { bookingsSaga } from './bookingsSaga';

export function* rootSaga() {
  yield fork(authSaga);
  yield fork(eventsSaga);
  yield fork(bookingsSaga);
}
