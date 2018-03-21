import {
  FETCH_ALL_DATACENTER_SUCCESS,
} from 'constants/ActionTypes';

const INIT_STATE = {
  loader: true,
  allDatacenters: [],

};

export default (state = INIT_STATE, action) => {
  switch (action.type) {

    case FETCH_ALL_DATACENTER_SUCCESS: {
      return {
        ...state,
        loader: false,
        allDatacenters: action.payload,
      }
    }

    default:
      return state;
  }
}
