import {all, call, fork, put, takeEvery} from 'redux-saga/effects';
import {
  FETCH_USER
} from '../constants/ActionTypes';
import {userFetchSuccess, userFetchError} from '../actions/User';

import {get, post, errorMessageFormatter} from './Api';


function* fetchUserRequest() {
    try {
        const {body, response} = yield get('/api/users/me');
        yield put(userFetchSuccess(body));
    } catch (error) {
        const {body, response} = error;
        yield put(userFetchError(errorMessageFormatter(body)));
    }
}

export function* fetchUser() {
    yield takeEvery(FETCH_USER, fetchUserRequest);
}

export default function* rootSaga() {
    yield all([
      fork(fetchUser)
    ]);
}