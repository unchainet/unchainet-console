import {
  FETCH_ALL_WALLET,
  FETCH_ALL_WALLET_SUCCESS,
  SHOW_MESSAGE,
} from 'constants/ActionTypes';

export const fetchWallet = () => {
  return {
    type: FETCH_ALL_WALLET
  };
};

export const fetchWalletSuccess = (wallet) => {
  return {
    type: FETCH_ALL_WALLET_SUCCESS,
    payload: wallet
  }
};

export const showWalletMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};