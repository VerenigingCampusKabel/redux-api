import {createApiAction} from './actions';
import {InvalidConfigError} from './errors';
import {camelCaseToUpperUnderscore, capatalize} from './util';
import {validateEnpoint} from './validation';

const ACTION_STATES = ['REQUEST', 'SUCCESS', 'FAILED'];

export const createApi = (config) => {
    // Validate API name
    if (typeof config.name !== 'string') {
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
    if (typeof config.url !== 'string') {
        throw new InvalidConfigError(`Invalid API base url: ${config.url}`);
    }
    let url = config.url.trim();
    if (url.charAt(url.length - 1) === '/') {
        url = url.substring(0, url.length - 1);
    }
    // TODO: check if url is valid

    // Validate API model list
    if (!config.models) {
        throw new InvalidConfigError('Missing API model list');
    }
    const invalidModels = config.models.filter((model) => typeof model !== 'string');
    if (invalidModels.length > 0) {
        throw new InvalidConfigError(`Invalid API model name(s): ${invalidModels.join(', ')}`);
    }

    // Validate default endpoint configuration
    if (config.defaults) {
        validateEnpoint('defaults', config.defaults, true);
    } else {
        config.defaults = {};
    }

    for (const [endpointName, endpoint] of Object.entries(config.endpoints)) {
        // Validate endpoint configuration
        validateEnpoint(endpointName, endpoint);

        // Set endpoint name
        endpoint.name = endpointName;

        // Create endpoint action types
        endpoint.actionTypes = {};
        const actionType = camelCaseToUpperUnderscore(endpointName);
        for (const state of ACTION_STATES) {
            endpoint.actionTypes[state] = actionType + '_' + state;
        }
    }

    // Generate API configuration object
    const api = {
        ...config,
        name,
        url,
        models: {},
        actionTypes: {
            all: {},
            request: [],
            success: [],
            failed: []
        },
        actions: []
    };

    for (const modelName of config.models) {
        // Generate model object
        const model = {
            url: modelName,
            actionTypes: {},
            actions: {}
        };
        api.models[modelName] = model;

        // Generate model endpoints
        for (const [endpointName, endpoint] of Object.entries(config.endpoints)) {
            model.actionTypes[endpointName] = {};
            for (const [state, type] of Object.entries(endpoint.actionTypes)) {
                const upperModelName = camelCaseToUpperUnderscore(modelName);
                const symbol = Symbol(api.name + '_' + upperModelName + '_' + type);
                model.actionTypes[endpointName][state] = symbol;
                api.actionTypes.all[upperModelName + '_' + type] = symbol;
                api.actionTypes[state.toLowerCase()].push(symbol);
            }

            const action = createApiAction(modelName, endpointName);
            model.actions[endpointName] = action;
            api.actions[endpointName + capatalize(modelName)] = action;
        }
    }

    // Validate and parse custom endpoints
    if (config.customEndpoints) {
        for (const [endpointName, endpoint] of Object.entries(config.customEndpoints)) {
            // Validate endpoint configuration
            validateEnpoint(endpointName, endpoint);

            // Set endpoint name
            endpoint.name = endpointName;

            // Create endpoint action types
            endpoint.actionTypes = {};
            const actionType = camelCaseToUpperUnderscore(endpointName);
            for (const state of ACTION_STATES) {
                endpoint.actionTypes[state] = actionType + '_' + state;
            }
        }
    }

    return api;
};
