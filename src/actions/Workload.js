import {
  FETCH_ALL_WORKLOADS,
  FETCH_ALL_WORKLOADS_SUCCESS,
  SHOW_MESSAGE,
} from '../constants/ActionTypes';

export const fetchAllWorkloads = () => {
  return {
    type: FETCH_ALL_WORKLOADS
  };
};

export const fetchAllWorkloadsSuccess = (all) => {
  return {
    type: FETCH_ALL_WORKLOADS_SUCCESS,
    payload: all
  }
};

export const fetchAllWorkloadsMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};