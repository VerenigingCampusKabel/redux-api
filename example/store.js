import util from 'util';

import {createStore, applyMiddleware} from 'redux';
import {createApiMiddleware} from '../lib';

import api from './api';
import rootReducer from './reducers';

console.log(util.inspect(api, false, null));

const middleware = applyMiddleware(
    ({getState, dispatch}) => (next) => async (action) => {
        try {
            console.log('action', util.inspect(action, true, null));
            return next(action);
        } catch (err) {
            console.error(err);
        }
    },
    createApiMiddleware(api)
);

const store = createStore(
    rootReducer,
    {},
    middleware
);

export default store;
