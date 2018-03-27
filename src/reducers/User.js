import {
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,
  FETCH_USER
} from '../constants/ActionTypes';

const INIT_STATE = {
  loader: false,
  data: null
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {

    case FETCH_USER: {
      return {
        ...state,
        loader: true,
        data: null,
        error: null
      }
    }

    case FETCH_USER_SUCCESS: {
      return {
        ...state,
        loader: false,
        data: action.payload,
      }
    }

    case FETCH_USER_ERROR: {
      return {
        ...state,
        loader: false,
        data: null,
        error: action.payload
      }
    }

    default:
      return state;
  }
}
