import {applyMiddleware, compose, createStore} from 'redux';
import reducers from '../reducers/index';
import createHistory from 'history/createHashHistory';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas/index';
import {routerMiddleware} from 'react-router-redux';
import persistState from 'redux-localstorage';

const history = createHistory();
const routeMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

//every redux store from the whitelist (first parameter) is automatically stored and reloaded from local storage
const persistEnhancer = persistState(['tour', 'auth'], {key: 'unchainet-data'});

const middlewares = [sagaMiddleware, routeMiddleware];

export default function configureStore(initialState) {
    const store = createStore(reducers, initialState,
        compose(applyMiddleware(...middlewares), persistEnhancer));

    sagaMiddleware.run(rootSaga);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers/index', () => {
            const nextRootReducer = require('../reducers/index');
            store.replaceReducer(nextRootReducer);
        });
    }
    return store;
}
export {history};
