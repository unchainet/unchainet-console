import {all, call, fork, put, takeEvery} from 'redux-saga/effects';
import {
  FETCH_USER,
  UPDATE_USER
} from '../constants/ActionTypes';
import {userFetchSuccess, userFetchError, userUpdateError, userUpdateSuccess} from '../actions/User';

import {get, patch, errorMessageFormatter} from './Api';


function* fetchUserRequest() {
    try {
        const {body, response} = yield get('/api/users/me');
        yield put(userFetchSuccess(body));
    } catch (error) {
        const {body, response} = error;
        yield put(userFetchError(errorMessageFormatter(body)));
    }
}

function* updateUserRequest(user) {
  try {
    const {body, response} = yield patch('/api/users/me', JSON.stringify(user.payload));
    yield put(userUpdateSuccess(body));
  } catch (error) {
    const {body, response} = error;
    yield put(userUpdateError(errorMessageFormatter(body)));
  }
}

export function* fetchUser() {
    yield takeEvery(FETCH_USER, fetchUserRequest);
}

export function* updateUser() {
  yield takeEvery(UPDATE_USER, updateUserRequest);
}

export default function* rootSaga() {
    yield all([
      fork(fetchUser),
      fork(updateUser)
    ]);
}