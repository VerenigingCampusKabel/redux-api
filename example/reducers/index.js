import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import users from './users';
import devices from './devices';

export default combineReducers({
    routing: routerReducer,
    users,
    devices
});
