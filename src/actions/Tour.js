import {
  UPDATE_TOUR_STEP,
  GO_TO_TOUR_STEP,
} from 'constants/ActionTypes';

export const updateTourStep = (lastVisitedStep, goToStep) => {
  return {
    type: UPDATE_TOUR_STEP,
    payload: { lastVisitedStep, goToStep }
  }
};

export const goToTourStep = (goToStep) => {
  return {
    type: GO_TO_TOUR_STEP,
    payload: { goToStep }
  }
};