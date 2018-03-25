import {all} from 'redux-saga/effects';
import authSagas from './Auth';
import billingSagas from './Billing';
import regionSagas from './Region';
import datacenterSagas from './Datacenter';
import priceHistorySagas from './PriceHistory';
import workloadSagas from './Workload';
import walletSagas from './Wallet';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    billingSagas(),
    regionSagas(),
    datacenterSagas(),
    priceHistorySagas(),
    walletSagas(),
    workloadSagas()
    ]);
}
