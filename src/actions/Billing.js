import {
  FETCH_ALL_BILLING,
  FETCH_ALL_BILLING_SUCCESS,
  SHOW_MESSAGE,
} from 'constants/ActionTypes';

export const fetchBilling = () => {
  return {
    type: FETCH_ALL_BILLING
  };
};

export const fetchBillingSuccess = (billing) => {
  return {
    type: FETCH_ALL_BILLING_SUCCESS,
    payload: billing
  }
};

export const showBillingMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};