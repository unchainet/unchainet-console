import conf from '../conf';
const host = conf.domain;

export function get (relativePath){
  return doFetch(relativePath, getHeaders('GET'));
}

export function post (relativePath, body){
  const config = getHeaders('POST');
  config.body = body;
  return doFetch(relativePath, config);
}

export function doFetch (relativePath, config){
  return fetch(`${host}${relativePath}`, config);
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