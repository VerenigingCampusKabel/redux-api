import {arrayOf} from 'normalizr';

import users from './users';
import devices from './devices';

// Define associations
users.define({
    devices: arrayOf(devices)
});

devices.define({
    user: users
});

// Export entities
export {
    users,
    devices
};
