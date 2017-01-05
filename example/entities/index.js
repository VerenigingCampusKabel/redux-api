import {schema} from 'normalizr';

import users from './users';
import devices from './devices';

// Define associations
users.schema.define({
    devices: new schema.Array(devices)
});

devices.schema.define({
    user: users
});

// Export entities
export {
    users,
    devices
};
