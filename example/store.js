import util from 'util';

import {createStore, applyMiddleware} from 'redux';
import {createApiMiddleware} from '../lib';

import api from './api';
import rootReducer from './reducers';

console.log(util.inspect(api, false, null));

const middleware = applyMiddleware(
    ({getState, dispatch}) => (next) => async (action) => {
        console.log('action', util.inspect(action, true, null));
        next(action);
    },
    createApiMiddleware(api)
);

const store = createStore(
    rootReducer,
    {},
    middleware
);

export default store;
