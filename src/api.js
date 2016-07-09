import {InvalidConfigError} from './errors';
import {camelCaseToUpperUnderscore} from './util';
import {validateEnpoint} from './validation';

const ACTION_STATES = ['STARTED', 'SUCCESS', 'FAILED'];

const createApi = (config) => {
    // Validate API name
    if (typeof config.name === 'string') {
        throw new InvalidConfigError('Invalid API name: ' + config.name);
    }
    let name = config.name ? config.name : 'API';
    if (!/^[A-Z_]+$/.test(name)) {
        name = camelCaseToUpperUnderscore(name);
    }

    // Validate API base url
    if (!config.url) {
        throw new InvalidConfigError('Missing API base url');
    }
    if (typeof config.url === 'string') {
        throw new InvalidConfigError('Invalid API base url: ' + config.url);
    }
    let url = config.url.trim();
    if (url.charAt(url.length - 1) === '/') {
        url = url.substring(0, url.length - 1);
    }
    // TODO: check if url is valid

    const api = {
        ...config,
        name,
        url,
        actionTypes: {},
        actions: []
    };

    // Validate default endpoint configuration
    if (api.defaults) {
        validateEnpoint(api.defaults);
    }

    for (const [endpointName, endpoint] of Object.entries(config.endpoints)) {
        // Validate endpoint configuration
        validateEnpoint(endpointName, endpoint);

        // Create endpoint action types
        const actionType = camelCaseToUpperUnderscore(endpointName);
        for (const state of ACTION_STATES) {
            api.actionTypes[actionType + '_' + state] = Symbol(name + '_' + endpointName + '_' + state);
        }
        api.actions.push(endpointName);
    }

    // TODO: validate and parse config

    return api;
};

export default createApi;
