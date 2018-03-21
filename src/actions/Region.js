import {
  FETCH_ALL_REGION,
  FETCH_ALL_REGION_SUCCESS,
  SHOW_MESSAGE,
} from 'constants/ActionTypes';

export const fetchAllRegion = () => {
  return {
    type: FETCH_ALL_REGION
  };
};

export const fetchAllRegionSuccess = (allRegion) => {
  return {
    type: FETCH_ALL_REGION_SUCCESS,
    payload: allRegion
  }
};

export const showRegionMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};