import {createApiActionTypes} from 'redux-cached-api';

import {api} from './api';

export default createApiActionTypes(api);
