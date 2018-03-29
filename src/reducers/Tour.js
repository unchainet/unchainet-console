import {
  UPDATE_TOUR_STEP,
  GO_TO_TOUR_STEP,
} from '../constants/ActionTypes';

const INIT_STATE = {
    state: 'init',
    lastVisitedStep: -1,
    goToStep: 0,
};


export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case UPDATE_TOUR_STEP: {
            if (state.lastVisitedStep < action.payload.lastVisitedStep){
              state.lastVisitedStep = action.payload.lastVisitedStep;
            }
            return {
                ...state
            }
        }
        case GO_TO_TOUR_STEP: {
            state.goToStep = action.payload.goToStep;
            return {
              ...state
            }
        }

        default:
            return state;
    }
}
