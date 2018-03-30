import {all, call, fork, put, takeEvery} from 'redux-saga/effects';
import {
  fetchAllWorkloadsSuccess, fetchAllWorkloadsMessage, launchWorkloadSuccess,
  saveWorkload
} from '../actions/Workload';
import {FETCH_ALL_WORKLOADS, PROCESS_WORKLOAD, SAVE_WORKLOAD} from '../constants/ActionTypes';
import {get, post, errorMessageFormatter} from './Api';
import {delay} from 'redux-saga'

function* fetchAllWorkloadsRequest() {
  try {
    debugger;
    const {body, response} = yield get('/api/workloads');
    yield put(fetchAllWorkloadsSuccess(body));
  } catch (error) {
    const {body, response} = error;
    yield put(fetchAllWorkloadsMessage(errorMessageFormatter(body)));
  }
}

//todo demo only
function* processWorkloadRequest({payload}) {
  try {

      yield put(saveWorkload(payload));
      yield delay(5000);
      yield put(launchWorkloadSuccess({status: 'running'}));

  } catch (error) {
    // const {body, response} = error;
    // yield put(fetchAllWorkloadsMessage(errorMessageFormatter(body)));
  }
}

// function* createUserWithEmailPassword({payload}) {
//   const {email, password} = payload;
//   try {
//     const {body, response} = yield post('/api/users', JSON.stringify({email, password}))
//     yield put(userSignUpSuccess(body));
//   } catch (error) {
//     const {body, response} = error;
//     yield put(showAuthMessage(errorMessageFormatter(body)));
//   }
// }

// function* createWorkload({payload}) {
//   const {email, password} = payload;
//   try {
//     const {body, response} = yield post('/api/users', JSON.stringify({email, password}))
//     yield put(userSignUpSuccess(body));
//   } catch (error) {
//     const {body, response} = error;
//     yield put(showAuthMessage(errorMessageFormatter(body)));
//   }
// }

export function* fetchAllWorkloads() {
  yield takeEvery(FETCH_ALL_WORKLOADS, fetchAllWorkloadsRequest);
}

export function* processWorkload() {
  yield takeEvery(PROCESS_WORKLOAD, processWorkloadRequest);
}

export default function* rootSaga() {
  yield all([fork(fetchAllWorkloads),
    fork(processWorkload)]);
}