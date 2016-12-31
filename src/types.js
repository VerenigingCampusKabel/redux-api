import {decamelize} from 'humps';

import {InvalidConfigError} from './errors';

export const requestStages = {
    request: 'REQUEST',
    success: 'SUCCESS',
    failure: 'FAILURE'
};

/**
 * Create action types for an API endpoint. (Interal function)
 *
 * @param {object} endpoints Object containing endpoint information
 * @param {string} prefix Action type prefix
 * @param {string} suffix Action type suffix
 * @return {object} The generated action types
 */
export const _createEndpointTypes = (endpoints, prefix = '', suffix = '') => {
    const types = {};
    for (const endpoint of Object.keys(endpoints)) {
        const endpointName = decamelize(endpoint).toUpperCase();
        for (const [stageKey, stage] of Object.entries(requestStages)) {
            types[endpoint][stageKey] = Symbol(`${prefix}${endpointName}_${stage}${suffix}`);
        }
    }
    return types;
};

/**
 * Create action types for an API configuration. (Interal function)
 *
 * @param {object} api API configuration
 */
export const _createApiTypes = (api) => {
    const types = {
        entities: {},
        custom: {}
    };

    if (typeof api !== 'object') {
        throw new InvalidConfigError(`Invalid API configuration: ${api}`);
    }

    for (const entity of api.entities) {
        const name = decamelize(entity.name).toUpperCase();
        types.entities[entity.name] = _createEndpointTypes(api.entityEndpoints, `${api.name}_${name}_`);
    }

    types.custom = _createEndpointTypes(api.endpoints, `${api.name}_`);

    api.types = types;
};

/**
 * Create action types for one or more API configurations.
 *
 * @param {object[]} apis One or more API configurations
 * @return {object} The generated action types
 */
export const createApiTypes = (...apis) => {
    const types = {
        all: {},
        request: [],
        success: [],
        failure: []
    };

    for (const api of apis) {
        if (typeof api !== 'object') {
            throw new InvalidConfigError(`Invalid API configuration: ${api}`);
        }

        for (const [entityName, entity] of Object.entries(api.types.entities)) {
            for (const [endpointName, endpoint] of Object.entries(entity)) {
                for (const [stageKey, type] of Object.entries(endpoint)) {
                    types.all[`${api.name}_${entityName}_${endpointName}_${requestStages[stageKey]}`] = type;
                    types[stageKey].push(type);
                }
            }
        }
    }

    return types;
};
