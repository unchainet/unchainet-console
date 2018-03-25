import {
  FETCH_ALL_WALLET_SUCCESS,
} from 'constants/ActionTypes';

const INIT_STATE = {
  loader: true,
  info: {},
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {

    case FETCH_ALL_WALLET_SUCCESS: {
      return {
        ...state,
        loader: false,
        info: action.payload,
      }
    }

    default:
      return state;
  }
}
