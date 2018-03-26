import conf from '../conf';
const host = conf.apiBaseUrl;

export function* get (relativePath){
  return yield doFetch(relativePath, getHeaders('GET'));
}

export function* post (relativePath, body){
  const config = getHeaders('POST');
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
  return {
    method: method,
    headers: {
      'authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  }
}