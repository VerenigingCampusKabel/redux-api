import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import users from './users';
import posts from './posts';

export default combineReducers({
    routing: routerReducer,
    users,
    posts
});
