import {all, call, put, takeEvery} from 'redux-saga/effects';
import {fetchPriceHistorySuccess, showPriceHistoryMessage} from 'actions/PriceHistory';
import {FETCH_ALL_PRICE_HISTORY} from 'constants/ActionTypes';
import priceHistoryListStub from './priceHistoryListStub';

const getPriceHistoryStub = async () =>
  await Promise.resolve()
    .then(() => {
      return priceHistoryListStub;
    })
    .catch((error => error));

// TODO SWAP WHEN READY
// const getPriceHistory = async () =>
//   await database.ref('prod/priceHistory').once('value')
//     .then((snapshot) => {
//       const priceHistory = [];
//       snapshot.forEach((rawData) => {
//         priceHistory.push(rawData.val());
//       });
//       return priceHistory;
//     })
//     .catch(error => error);


function* fetchPriceHistoryRequest() {
  try {
    const fetchedPriceHistory = yield call(getPriceHistoryStub);
    yield put(fetchPriceHistorySuccess(fetchedPriceHistory));
  } catch (error) {
    yield put(showPriceHistoryMessage(error));
  }
}


export default function* rootSaga() {
  yield all([takeEvery(FETCH_ALL_PRICE_HISTORY, fetchPriceHistoryRequest)]);
}