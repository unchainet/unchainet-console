import {all, call, put, takeEvery} from 'redux-saga/effects';
import {fetchAllDatacenterSuccess,showDatacenterMessage} from 'actions/Datacenter';
import {FETCH_ALL_DATACENTER} from 'constants/ActionTypes';

const getAllDatacenterStub = async () =>
  await Promise.resolve()
    .then(() => {
      return require('../stubData/datacenters').default;
    })
    .catch((error => error));

function* fetchAllDatacenterRequest() {
  try {
    const data = yield call(getAllDatacenterStub);
    yield put(fetchAllDatacenterSuccess(data));
  } catch (error) {
    yield put(showDatacenterMessage(error));
  }
}


export default function* rootSaga() {
  yield all([takeEvery(FETCH_ALL_DATACENTER, fetchAllDatacenterRequest)]);
}