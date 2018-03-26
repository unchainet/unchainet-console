import {all, call, put, takeEvery} from 'redux-saga/effects';
import {fetchPriceHistorySuccess, showPriceHistoryMessage} from 'actions/PriceHistory';
import {database} from 'firebase/firebase';
import {FETCH_ALL_WALLET} from 'constants/ActionTypes';
import walletStub from '../stubData/wallet';
import {fetchWalletSuccess, showWalletMessage} from '../actions/Wallet';

const getWalletStub = async () =>
  await Promise.resolve()
    .then(() => {
      return walletStub;
    })
    .catch((error => error));

// TODO SWAP WHEN READY
// const getWallet = async () =>
//   await database.ref('prod/wallet').once('value')
//     .then((snapshot) => {
//      //todo transform as needed
//       return snapshot;
//     })
//     .catch(error => error);


function* fetchWalletRequest() {
  try {
    const fetchedWallet = yield call(getWalletStub);
    yield put(fetchWalletSuccess(fetchedWallet));
  } catch (error) {
    yield put(showWalletMessage(error));
  }
}


export default function* rootSaga() {
  yield all([takeEvery(FETCH_ALL_WALLET, fetchWalletRequest)]);
}