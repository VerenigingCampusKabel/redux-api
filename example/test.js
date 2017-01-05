import store from './store';
import {users} from './actions';

store.dispatch(users.getAll({}));
