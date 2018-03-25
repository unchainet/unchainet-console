import {all, call, put, takeEvery} from 'redux-saga/effects';
import {fetchAllWorkloadsSuccess,fetchAllWorkloadsMessage} from '../actions/Workload';
import {FETCH_ALL_WORKLOADS} from '../constants/ActionTypes';
import {get, post, errorMessageFormatter} from './Api';

function* fetchAllWorkloadsRequest() {
  try {
    const {body, response} = yield get('/api/workloads');
    yield put(fetchAllWorkloadsSuccess(body));
  } catch (error) {
    const {body, response} = error;
    yield put(fetchAllWorkloadsMessage(errorMessageFormatter(body)));
  }
}


export default function* rootSaga() {
  yield all([takeEvery(FETCH_ALL_WORKLOADS, fetchAllWorkloadsRequest)]);
}