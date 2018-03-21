import {
  FETCH_ALL_DATACENTER,
  FETCH_ALL_DATACENTER_SUCCESS,
  SHOW_MESSAGE,
} from 'constants/ActionTypes';

export const fetchAllDatacenter = () => {
  return {
    type: FETCH_ALL_DATACENTER
  };
};

export const fetchAllDatacenterSuccess = (allDatacenter) => {
  return {
    type: FETCH_ALL_DATACENTER_SUCCESS,
    payload: allDatacenter
  }
};

export const showDatacenterMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};