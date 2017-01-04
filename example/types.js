import {createApiActionTypes} from '../lib';

import api from './api';

// Generate action types
const {
    all,
    request,
    success,
    failure
} = createApiActionTypes(api);

// Export action types
export {
    all as default,
    request,
    success,
    failure
};
