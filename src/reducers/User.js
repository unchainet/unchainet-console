import {
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,
  FETCH_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  UPDATE_USER,
  UPDATE_USER_MESSAGE_HIDE
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
        error: null
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

    case UPDATE_USER: {
      return {
        ...state,
        loader: true,
        error: null,
        showMessage: false
      }
    }

    case UPDATE_USER_SUCCESS: {
      return {
        ...state,
        loader: false,
        data: action.payload,
        error: null,
        showMessage: true
      }
    }

    case UPDATE_USER_ERROR: {
      return {
        ...state,
        loader: false,
        error: action.payload,
        showMessage: true
      }
    }

    case UPDATE_USER_MESSAGE_HIDE: {
      return {
        ...state,
        showMessage: false
      }
    }

    default:
      return state;
  }
}
