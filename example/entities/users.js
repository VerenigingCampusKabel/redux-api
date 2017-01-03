import {Schema} from 'normalizr';
import {Record} from 'immutable';

const schema = new Schema('users');

const record = new Record({
    // Fields
    id: null,
    initials: null,
    firstName: null,
    lastName: null,
    lastNamePrefix: null,
    email: null,
    password: null,
    seed: null,
    image: null,
    language: null,

    // Associations
    devices: null
});

export default {
    urlPrefix: '/user',
    urlPostfix: '',
    schema,
    record
};
