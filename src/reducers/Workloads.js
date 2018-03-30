import {
  SAVE_WORKLOAD,
  REMOVE_WORKLOAD,
  LAUNCH_WORKLOAD,
  FETCH_ALL_WORKLOADS_SUCCESS,
  LAUNCH_WORKLOAD_SUCCESS,
} from '../constants/ActionTypes';

const INIT_STATE = {
    state: 'init',
    list: []
};


export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case SAVE_WORKLOAD: {
            let items = state.list.slice();
            if (!action.payload._id) {
                action.payload._id = new Date().getTime().toString();
                items.push(action.payload);
            } else {
                items.forEach(row => {
                    if (row._id === action.payload._id) {
                        Object.assign(row, action.payload);
                    }
                });
            }
            return {
                ...state,
                list: items
            }
        }
        case LAUNCH_WORKLOAD_SUCCESS: {
          let items = state.list.slice();
          items.forEach(row => {
            //if (row._id === action.payload._id) {//todo enable after workload creation in db is up and running
              Object.assign(row, action.payload);
            //}
          });
        }
        case REMOVE_WORKLOAD: {
            let items = state.list.filter(row => row._id !== action.id);
            return {
                ...state,
                list: items
            }
        }
        case FETCH_ALL_WORKLOADS_SUCCESS: {
            return {
              ...state,
              state: 'loaded',
              list: action.payload
            }
        }
        default:
            return state;
    }
}
