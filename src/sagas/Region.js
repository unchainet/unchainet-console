import {all, call, put, takeEvery} from 'redux-saga/effects';
import {fetchAllRegionSuccess,showRegionMessage} from 'actions/Region';
import {FETCH_ALL_REGION} from 'constants/ActionTypes';
import {get, post, errorMessageFormatter} from './Api';

const getAllRegionStub = async () =>
  await Promise.resolve()
    .then(() => {
      return require('../stubData/regions').default;
    })
    .catch((error => error));

const getAllRegions = async () =>
  await get('/api/regions1')
    .then(response => {
      if (response.status === 404) {
        throw new Error('Requested api is not found');
      }
      return response.json().then(body => ({ body, response }))
    });

function* fetchAllRegionRequest() {
  try {
    const {body, response} = yield call(getAllRegions);
    yield put(fetchAllRegionSuccess(body));
  } catch (error) {
    yield put(showRegionMessage(error));
  }
}


export default function* rootSaga() {
  yield all([takeEvery(FETCH_ALL_REGION, fetchAllRegionRequest)]);
}