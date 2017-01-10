import {schema as Schema} from 'normalizr';
import {Record} from 'immutable';

const schema = new Schema.Entity('devices');

const record = new Record({
    // Fields
    id: null,
    deviceType: null,
    serial: null,
    hardwareAddress: null,
    hostname: null,
    token: null,
    expiry: null,

    // Associations
    user: null
});

export default {
    urlPrefix: '/devices',
    urlPostfix: '',
    schema,
    record
};
