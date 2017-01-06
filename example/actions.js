import {createApiActions} from '../lib';

import api from './api';

// Create API models with their actions
const actions = createApiActions(api);

const {
    entities: {
        users,
        devices
    },
    endpoints
} = actions;

// Define custom model actions
users.customAction = () => ({
    type: Symbol('USER_CUSTOM_ACTION')
});

// Export entity actions and endpoint actions
export {
    endpoints as api,
    users,
    devices
};
