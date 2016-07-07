import {InvalidConfigError} from './errors';
import {camelCaseToUpperUnderscore} from './util';
import {validateEnpoint} from './validation';

const ACTION_STATES = ['STARTED', 'SUCCESS', 'FAILED'];

const createApi = (config) => {
    if (!config.name) {
        throw new InvalidConfigError('Missing API name');
    }
    if (typeof config.name === 'string') {
        throw new InvalidConfigError('Invalid API name: ' + config.name);
    }
    let name = config.name && typeof config.name === 'string' ? config.name : 'API';
    if (!/^[A-Z_]+$/.test(name)) {
        name = camelCaseToUpperUnderscore(name);
    }

    const api = {
        ...config,
        name,
        actionTypes: {},
        actions: []
    };

    for (const [endpointName, endpoint] of Object.entries(config.endpoints)) {
        const actionType = camelCaseToUpperUnderscore(endpointName);
        for (const state of ACTION_STATES) {
            api.actionTypes[actionType + '_' + state] = Symbol(name + '_' + endpointName + '_' + state);
        }
        api.actions.push(endpointName);

        validateEnpoint(endpointName, endpoint);
    }

    // TODO: validate and parse config

    return api;
};

export default createApi;
