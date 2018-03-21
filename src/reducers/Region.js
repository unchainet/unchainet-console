import {
  FETCH_ALL_REGION_SUCCESS,
} from 'constants/ActionTypes';

const INIT_STATE = {
  loader: true,
  allRegions: [],

};

export default (state = INIT_STATE, action) => {
  switch (action.type) {

    case FETCH_ALL_REGION_SUCCESS: {
      return {
        ...state,
        loader: false,
        allRegions: action.payload,
      }
    }

    default:
      return state;
  }
}
