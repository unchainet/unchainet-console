import {
  FETCH_ALL_PRICE_HISTORY_SUCCESS,
} from 'constants/ActionTypes';

const INIT_STATE = {
  alertMessage: '',
  showMessage: false,
  loader: true,
  noContentFoundMessage: 'No spot computing price history found',
  priceHistoryList: [],

};

export default (state = INIT_STATE, action) => {
  switch (action.type) {

    case FETCH_ALL_PRICE_HISTORY_SUCCESS: {
      return {
        ...state,
        loader: false,
        priceHistoryList: action.payload,
      }
    }

    default:
      return state;
  }
}
