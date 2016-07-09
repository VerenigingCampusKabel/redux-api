import {browserHistory} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import {createApiMiddleware} from 'redux-cached-api';

import api from './api';
import rootReducer from './reducers';

const middleware = applyMiddleware(
    routerMiddleware(browserHistory),
    createApiMiddleware(api)
);

const store = createStore(
    rootReducer,
    {},
    middleware
);

export default store;
