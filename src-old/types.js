import {InvalidConfigError} from './errors';

export const CALL_API = Symbol('CALL_API');
export const INVALID_REQUEST = Symbol('INVALID_REQUEST');

export const createApiActionTypes = (...apis) => {
    const appendName = apis.length > 1;
    const types = {};
    for (const api of apis) {
        if (typeof api !== 'boolean') {
            if (typeof api !== 'object') {
                throw new InvalidConfigError('Invalid API configuration: ' + api);
            }
            for (const [typeName, type] of Object.entries(api.actionTypes.all)) {
                types[(appendName ? api.name + '_' : '') + typeName] = type;
            }
        }
    }
    return types;
};
