import {all, call, put, takeEvery} from 'redux-saga/effects';
import {fetchAllRegionSuccess,showRegionMessage} from 'actions/Region';
import {FETCH_ALL_REGION} from 'constants/ActionTypes';

const getAllRegionStub = async () =>
  await Promise.resolve()
    .then(() => {
      return require('../stubData/regions').default;
    })
    .catch((error => error));

function* fetchAllRegionRequest() {
  try {
    const data = yield call(getAllRegionStub);
    yield put(fetchAllRegionSuccess(data));
  } catch (error) {
    yield put(showRegionMessage(error));
  }
}


export default function* rootSaga() {
  yield all([takeEvery(FETCH_ALL_REGION, fetchAllRegionRequest)]);
}