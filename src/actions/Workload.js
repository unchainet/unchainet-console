import {
  FETCH_ALL_WORKLOADS,
  FETCH_ALL_WORKLOADS_SUCCESS,
  SAVE_WORKLOAD,
  SHOW_MESSAGE,
  LAUNCH_WORKLOAD_SUCCESS, PROCESS_WORKLOAD,
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
  };
};

export const fetchAllWorkloadsMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};

export const processWorkload = (data) => {
  return {
    type: PROCESS_WORKLOAD,
    payload: data
  };
};

export const saveWorkload = (data) => {
  return {
    type: SAVE_WORKLOAD,
    payload: data
  };
}

export const launchWorkloadSuccess = (data) => {
  return {
    type: LAUNCH_WORKLOAD_SUCCESS,
    payload: data
  };
};
