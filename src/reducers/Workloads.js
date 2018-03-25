import {
  ADD_WORKLOAD,
  REMOVE_WORKLOAD,
  FETCH_ALL_WORKLOADS_SUCCESS
} from '../constants/ActionTypes';

const INIT_STATE = {
    state: 'init',
    list: []
};


export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case ADD_WORKLOAD: {
            let items = state.list.slice();
            if (!action.item.id) {
                action.item.id = new Date().getTime();
                items.push(action.item);
            } else {
                items.forEach(row => {
                    if (row.id === action.item.id) {
                        Object.assign(row, action.item);
                    }
                });
            }
            return {
                ...state,
                list: items
            }
        }
        case REMOVE_WORKLOAD: {
            let items = state.list.filter(row => row.id !== action.id);
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
