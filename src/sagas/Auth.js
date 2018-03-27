import {all, call, fork, put, takeEvery} from 'redux-saga/effects';
import {
    SIGNIN_FACEBOOK_USER,
    SIGNIN_GITHUB_USER,
    SIGNIN_GOOGLE_USER,
    SIGNIN_TWITTER_USER,
    SIGNIN_USER,
    SIGNOUT_USER,
    SIGNUP_USER
} from 'constants/ActionTypes';
import {showAuthMessage, userSignInSuccess, userSignOutSuccess, userSignUpSuccess, userActivateSuccess} from 'actions/Auth';
import {
    userFacebookSignInSuccess,
    userGithubSignInSuccess,
    userGoogleSignInSuccess,
    userTwitterSignInSuccess
} from '../actions/Auth';

import {get, post, errorMessageFormatter} from './Api';
import {ACTIVATE_USER} from '../constants/ActionTypes';


function* createUserWithEmailPassword({payload}) {
    const {email, password} = payload;
    try {
        const {body, response} = yield post('/api/users', JSON.stringify({email, password}))
        yield put(userSignUpSuccess(body));
    } catch (error) {
        const {body, response} = error;
        yield put(showAuthMessage(errorMessageFormatter(body)));
    }
}

function* activate({payload}) {
  const {_id, code} = payload;
  try {
    const {body, response} = yield post('/api/users/activate', JSON.stringify({_id, code}));
    localStorage.setItem('token', body.token);
    yield put(userActivateSuccess(body));
  } catch (error) {
    const {body, response} = error;
    yield put(showAuthMessage(errorMessageFormatter(body)));
  }
}

function* signInUserWithEmailPassword({payload}) {
    const {email, password} = payload;
    try {
        const {body, response} = yield post('/api/auth/local', JSON.stringify({email, password}));
        localStorage.setItem('token', body.token);
        yield put(userSignInSuccess(body));
    } catch (error) {
        const {body, response} = error;
        yield put(showAuthMessage(errorMessageFormatter(body)));
    }
}

function* signOut() {
    localStorage.removeItem('token');
    yield put(userSignOutSuccess({}));
}

export function* createUserAccount() {
    yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
}

export function* signInUser() {
    yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
    yield takeEvery(SIGNOUT_USER, signOut);
}

export function* activateUser() {
  yield takeEvery(ACTIVATE_USER, activate);
}

export default function* rootSaga() {
    yield all([fork(signInUser),
        fork(activateUser),
        fork(createUserAccount),
        fork(signOutUser)]);
}