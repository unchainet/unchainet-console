import {
  FETCH_ALL_BILLING_SUCCESS,
} from 'constants/ActionTypes';

const INIT_STATE = {
  alertMessage: '',
  showMessage: false,
  loader: true,
  noContentFoundMessage: 'No billing found',
  billingList: [],

};

export default (state = INIT_STATE, action) => {
  switch (action.type) {

    case FETCH_ALL_BILLING_SUCCESS: {
      return {
        ...state,
        loader: false,
        billingList: action.payload,
      }
    }

    default:
      return state;
  }
}
