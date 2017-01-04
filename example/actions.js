import {createApiActions} from '../lib';

import api from './api';

// Create API models with their actions
const {
    entities: {
        user,
        device
    },
    endpoints
} = createApiActions(api);

// Define custom model actions
user.customAction = () => ({
    type: Symbol('USER_CUSTOM_ACTION')
});

// Export entity actions and endpoint actions
export {
    endpoints as api,
    user,
    device
};
