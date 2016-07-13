import {createApiActions} from '../lib';

import api from './api';

// Create API models with their actions
const {
    user,
    device
} = createApiActions(api);

// Define custom model actions
user.customAction = () => ({
    type: Symbol('USER_CUSTOM_ACTION')
});

// Export models
export {
    user,
    device
};
