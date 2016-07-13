import store from './store';
import {user} from './actions';

store.dispatch(user.getAll());
