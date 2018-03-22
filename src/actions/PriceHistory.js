import {
  FETCH_ALL_PRICE_HISTORY,
  FETCH_ALL_PRICE_HISTORY_SUCCESS,
  SHOW_MESSAGE,
} from 'constants/ActionTypes';

export const fetchPriceHistory = () => {
  return {
    type: FETCH_ALL_PRICE_HISTORY
  };
};

export const fetchPriceHistorySuccess = (priceHistory) => {
  return {
    type: FETCH_ALL_PRICE_HISTORY_SUCCESS,
    payload: priceHistory
  }
};

export const showPriceHistoryMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};