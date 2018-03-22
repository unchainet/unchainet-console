import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import Settings from './Settings';
import ChatData from './Chat';
import Contact from './Contact';
import Mail from './Mail';
import ToDo from './ToDo';
import Auth from './Auth';
import Billing from './Billing';
import Workloads from './Workloads';
import PriceHistory from './PriceHistory';
import Datacenter from './Datacenter';
import Region from './Region';


const reducers = combineReducers({
    routing: routerReducer,
    settings: Settings,
    chatData: ChatData,
    contacts: Contact,
    mail: Mail,
    toDo: ToDo,
    auth: Auth,
    billing: Billing,
    workloads: Workloads,
    priceHistory: PriceHistory,
    datacenter: Datacenter,
    region: Region,
});

export default reducers;
