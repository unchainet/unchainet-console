import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import Settings from './Settings';
import Auth from './Auth';
import Billing from './Billing';
import Workloads from './Workloads';
import PriceHistory from './PriceHistory';
import Datacenter from './Datacenter';
import Region from './Region';
import Wallet from './Wallet';
import User from './User';
import Tour from './Tour';

import {
  SIGNOUT_USER_SUCCESS,
} from 'constants/ActionTypes';


const reducers = combineReducers({
    routing: routerReducer,
    settings: Settings,
    auth: Auth,
    billing: Billing,
    workloads: Workloads,
    priceHistory: PriceHistory,
    datacenter: Datacenter,
    region: Region,
    wallet: Wallet,
    user: User,
    tour: Tour
});

const initialState = reducers({}, {});

const rootReducer = (state, action) => {
  if (action.type === SIGNOUT_USER_SUCCESS) {
    state = initialState
  }

  return reducers(state, action);
};

export default rootReducer;
