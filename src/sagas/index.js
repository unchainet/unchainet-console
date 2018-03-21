import {all} from 'redux-saga/effects';
import mailSagas from './Mail';
import toDoSagas from './Todo';
import contactSagas from './Contact';
import chatSagas from './Chat';
import authSagas from './Auth';
import billingSagas from './Billing';
import priceHistorySagas from './PriceHistory';

export default function* rootSaga(getState) {
    yield all([
        mailSagas(),
        toDoSagas(),
        contactSagas(),
        chatSagas(),
        authSagas(),
        billingSagas(),
        priceHistorySagas(),
    ]);
}
