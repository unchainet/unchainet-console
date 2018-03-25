import {all} from 'redux-saga/effects';
import mailSagas from './Mail';
import toDoSagas from './Todo';
import contactSagas from './Contact';
import chatSagas from './Chat';
import authSagas from './Auth';
import billingSagas from './Billing';
import regionSagas from './Region';
import datacenterSagas from './Datacenter';
import priceHistorySagas from './PriceHistory';
import walletSagas from './Wallet';

export default function* rootSaga(getState) {
  yield all([
    mailSagas(),
    toDoSagas(),
    contactSagas(),
    chatSagas(),
    authSagas(),
    billingSagas(),
    regionSagas(),
    datacenterSagas(),
    priceHistorySagas(),
    walletSagas(),
    ]);
}
