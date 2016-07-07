import {InvalidConfigError} from './errors';

const createApiActions = (...apis) => {
    const appendName = apis.length > 1;
    const types = {};
    for (const api of apis) {
        if (typeof api !== 'boolean') {
            if (typeof api !== 'object') {
                throw new InvalidConfigError('Invalid API configuration: ' + api);
            }
            for (const [typeName, type] of Object.entries(api.actionTypes)) {
                types[(appendName ? api.name + '_' : '') + typeName] = type;
            }
        }
    }
    return types;
};

export default createApiActions;
