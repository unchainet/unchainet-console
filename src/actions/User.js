import {
    FETCH_USER_SUCCESS,
    FETCH_USER_ERROR,
    FETCH_USER,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    UPDATE_USER,
    UPDATE_USER_MESSAGE_HIDE
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

export const userUpdate = (user) => {
  return {
    type: UPDATE_USER,
    payload: user
  };
};

export const userUpdateSuccess = (user) => {
  return {
    type: UPDATE_USER_SUCCESS,
    payload: user
  };
};

export const userUpdateError = (err) => {
  return {
    type: UPDATE_USER_ERROR,
    payload: err
  };
};

export const userUpdateMessageHide = () => {
  return {
    type: UPDATE_USER_MESSAGE_HIDE,
  };
};