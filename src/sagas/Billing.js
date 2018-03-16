import {all, call, put, takeEvery} from 'redux-saga/effects';
import {fetchBillingSuccess, showBillingMessage} from 'actions/Billing';
import {database} from 'firebase/firebase';
import {FETCH_ALL_BILLING} from 'constants/ActionTypes';
import billingListStub from './billingListStub';

const getBillingStub = async () =>
  await Promise.resolve()
    .then(() => {
      return billingListStub;
    })
    .catch((error => error));

// TODO SWAP WHEN READY
// const getBilling = async () =>
//   await database.ref('prod/billing').once('value')
//     .then((snapshot) => {
//       const billing = [];
//       snapshot.forEach((rawData) => {
//         billing.push(rawData.val());
//       });
//       return billing;
//     })
//     .catch(error => error);


function* fetchBillingRequest() {
  try {
    const fetchedBilling = yield call(getBillingStub);
    yield put(fetchBillingSuccess(fetchedBilling));
  } catch (error) {
    yield put(showBillingMessage(error));
  }
}


export default function* rootSaga() {
  yield all([takeEvery(FETCH_ALL_BILLING, fetchBillingRequest)]);
}