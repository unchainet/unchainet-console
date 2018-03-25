import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import Settings from './Settings';
import Auth from './Auth';
import Billing from './Billing';
import Workloads from './Workloads';
import PriceHistory from './PriceHistory';
import Datacenter from './Datacenter';
import Region from './Region';


const reducers = combineReducers({
    routing: routerReducer,
    settings: Settings,
    auth: Auth,
    billing: Billing,
    workloads: Workloads,
    priceHistory: PriceHistory,
    datacenter: Datacenter,
    region: Region,
});

export default reducers;
