import {isUri} from 'valid-url';

import {InvalidConfigError} from './errors';
import {_createApiTypes} from './types';
import {normalizeConfig, getJSON} from './util';
import {_validateEntity, _validateRequestConfig, _validateEndpoint} from './validation';

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

    // Ensure the API has a name
    const name = config.name || 'API';

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
    Object.values(entities).forEach((entity) => _validateEntity(entity));

    // Normalize entites
    Object.values(entities).forEach((entity) => {
        // Normalize url prefix and postfix
        entity.urlPrefix = entity.urlPrefix || '';
        entity.urlPostfix = entity.urlPostfix || '';
    });

    // Validate default endpoint configuration
    const defaults = normalizeConfig(config.defaults || {});
    _validateRequestConfig(defaults, 'API defaults');

    // Set default payload and erorr handlers (setting them to false disabled this behaviour)
    if (defaults.payload === undefined || defaults.payload === null) {
        defaults.payload = getJSON;
    }
    if (defaults.error === undefined || defaults.error === null) {
        defaults.error = getJSON;
    }

    // Validate default entity endpoint configuration
    const entityEndpointDefaults = normalizeConfig(config.entityEndpointDefaults || {});
    _validateRequestConfig(entityEndpointDefaults, 'entity endpoint defaults');
    const hasDefaultEntityUrl = entityEndpointDefaults.url !== undefined && entityEndpointDefaults.url !== null;

    // Validate entity endpoints
    const entityEndpoints = {};
    for (const [endpointName, endpoint] of Object.entries(config.entityEndpoints || {})) {
        _validateRequestConfig(endpoint, 'entity endpoint');
        _validateEndpoint(endpointName, endpoint, hasDefaultEntityUrl);

        entityEndpoints[endpointName] = normalizeConfig(endpoint);
    }

    // Validate default custom endpoint configuration
    const endpointDefaults = normalizeConfig(config.endpointDefaults || {});
    _validateRequestConfig(endpointDefaults, 'custom endpoint defaults');
    const hasDefaultUrl = endpointDefaults.url !== undefined && endpointDefaults.url !== null;

    // Validate custom endpoints
    const endpoints = {};
    for (const [endpointName, endpoint] of Object.entries(config.endpoints || {})) {
        _validateRequestConfig(endpoint, 'custom endpoint');
        _validateEndpoint(endpointName, endpoint, hasDefaultUrl);

        endpoints[endpointName] = normalizeConfig(endpoint);
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
