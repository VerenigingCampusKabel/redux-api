import {decamelize} from 'humps';
import {isUri} from 'valid-url';

import {InvalidConfigError} from './errors';
import {_createApiTypes} from './types';
import {normalizeConfig} from './util';
import {validateEntity, validateRequestConfig, validateEndpoint} from './validation';

/**
 * Define an API
 *
 * @param {object} config API configuration
 * @return {object} API definition
 */
export const createApi = (config) => {
    // Validate API name
    if (config.name && typeof config.name !== 'string') {
        throw new InvalidConfigError('Invalid API name: ' + config.name);
    }

    // Enforce upper camelcase
    const name = config.name ? decamelize(config.name).toUpperCase() : 'API';

    // Validate API base url
    if (!config.url) {
        throw new InvalidConfigError('Missing API base url');
    }
    if (typeof config.url !== 'string') {
        throw new InvalidConfigError(`Invalid API base url: ${config.url}`);
    }
    if (!isUri(config.url)) {
        throw new InvalidConfigError(`Invalid API base url: ${config.url}`);
    }

    // Trim url and remove possible trailing slash
    let url = config.url.trim();
    if (url.charAt(url.length - 1) === '/') {
        url = url.substring(0, url.length - 1);
    }

    // Validate options
    const options = config.options || {};

    // Validate entities
    const entities = config.entities || {};
    Object.values(entities).forEach((entity) => validateEntity(entity));

    // Define entity names
    entities.forEach((entity) => {
        entity.name = entity.schema.getKey();
    });

    // Validate default endpoint configuration
    const defaults = normalizeConfig(config.defaults || {});
    validateRequestConfig(defaults, 'API defaults');

    // Validate default entity endpoint configuration
    const entityEndpointDefaults = normalizeConfig(config.entityEndpointDefaults || {});
    validateRequestConfig(entityEndpointDefaults, 'entity endpoint defaults');
    const hasDefaultEntityUrl = entityEndpointDefaults.url !== undefined && entityEndpointDefaults.url !== null;

    // Validate entity endpoints
    const entityEndpoints = config.entityEndpoints || {};
    for (const [endpointName, endpoint] of Object.entries(entityEndpoints)) {
        validateRequestConfig(endpoint, 'entity endpoint');
        validateEndpoint(endpointName, endpoint, hasDefaultEntityUrl);
    }

    // Validate default custom endpoint configuration
    const endpointDefaults = normalizeConfig(config.endpointDefaults || {});
    validateRequestConfig(endpointDefaults, 'custom endpoint defaults');
    const hasDefaultUrl = endpointDefaults.url !== undefined && endpointDefaults.url !== null;

    // Validate custom endpoints
    const endpoints = config.endpoints || {};
    for (const [endpointName, endpoint] of Object.entries(endpoints)) {
        validateRequestConfig(endpoint, 'custom endpoint');
        validateEndpoint(endpointName, endpoint, hasDefaultUrl);
    }

    // Create final API configuration
    const api = {
        name,
        url,
        options,
        entities,
        defaults,
        entityEndpoints,
        entityEndpointDefaults,
        endpoints,
        endpointDefaults
    };

    // Create action types
    _createApiTypes(api);

    return api;
};
