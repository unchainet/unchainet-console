import {all, call, fork, put, takeEvery} from 'redux-saga/effects';
import {userSignOut} from '../actions/Auth';
import {store} from '../MainApp';

const host = window.process.env.API_BASE_URL;

export function* get (relativePath){
  return yield doFetch(relativePath, getHeaders('GET'));
}

export function* post (relativePath, body){
  const config = getHeaders('POST');
  config.body = body;
  return yield doFetch(relativePath, config);
}

export function* patch (relativePath, body){
  const config = getHeaders('PUT');
  config.body = body;
  return yield doFetch(relativePath, config);
}

export function* doFetch (relativePath, config){
  const res = yield fetch(`${host}${relativePath}`, config);
  if (res.status === 404) {
    throw({response: res, body: 'Requested api method is not found'});
  }
  const copy = res.clone();
  let body = null;
  try {
    body = yield res.json();
  } catch (e) {
    body = yield copy.text();
  }
  if (res.status >= 400) {
    if (res.status === 401) {
      yield put(userSignOut());
    }
    throw({response: res, body});
  }
  return {response: res, body};
}

export function errorMessageFormatter (body){
  if (typeof body === 'string') {
    return body;
  }
  body = body || {};
  return body.reason || body.message || 'Internal server error';
}

function getHeaders (method) {
  let token = '';
  try {
    token = store.getState().auth.authUser.token;
  } catch (e) {}
  return {
    method: method,
    headers: {
      'authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  }
}