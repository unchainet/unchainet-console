import {
    FETCH_USER_SUCCESS,
    FETCH_USER_ERROR,
    FETCH_USER
} from '../constants/ActionTypes';

export const userFetch = () => {
  return {
    type: FETCH_USER
  };
};

export const userFetchSuccess = (user) => {
    return {
        type: FETCH_USER_SUCCESS,
        payload: user
    };
};
export const userFetchError = (err) => {
  return {
    type: FETCH_USER_ERROR,
    payload: err
  };
};
