import {schema} from 'normalizr';
// import {Record} from 'immutable';

import {InvalidConfigError} from './errors';

/**
 * Validate an API entity. (Internal function)
 *
 * @param {object} entity The entity to validate
 * @throws {InvalidConfigError}
 */
export const _validateEntity = (entity) => {
    // Validate entity name or schema
    if (!entity.name && !entity.schema) {
        throw new InvalidConfigError(`Missing entity name or schema`);
    }

    // Find the entity name
    const key = entity.schema ? entity.schema.key : entity.name;

    // Validate entity schema if available
    if (entity.schema && !(entity.schema instanceof schema.Entity)) {
        throw new InvalidConfigError(`Invalid entity schema for "${key}", should be an instance of "normalizr.schema.Entity"`);
    }

    // Validate entity record
    // if (entity.record && !(entity.record instanceof Record)) {
    //     throw new InvalidConfigError(`Invalid entity record for "${key}", should be an instance of "immutable.Record"`);
    // }

    // Validate url prefix
    if (entity.urlPrefix && typeof entity.urlPrefix !== 'string') {
        throw new InvalidConfigError(`Invalid entity url prefix for "${key}", should be a string`);
    }

    // Validate url postfix
    if (entity.urlPostfix && typeof entity.urlPostfix !== 'string') {
        throw new InvalidConfigError(`Invalid entity url postfix for "${key}", should be a string`);
    }
};

/**
 * List of valid Fetch API request option properties.
 */
export const VALID_REQUEST_PROPERTIES = ['url', 'method', 'headers', 'query', 'body', 'mode', 'credentials', 'cache', 'redirect', 'referer', 'integrity'];

/**
 * List of valid redux-cached-api response properties.
 */
export const VALID_RESPONSE_PROPERTIES = ['bailout', 'payload', 'error', 'schema'];

/**
 * Validate an API request configuration. (Internal function)
 *
 * @param {object} config The request configuration to validate
 * @param {string} name Name of the request configuration (only displayed in the error)
 * @throws {InvalidConfigError}
 */
export const _validateRequestConfig = (config, name) => {
    for (const property of Object.keys(config)) {
        if (VALID_REQUEST_PROPERTIES.indexOf(property) === -1 && VALID_RESPONSE_PROPERTIES.indexOf(property) === -1) {
            throw new InvalidConfigError(`Invalid request property "${property}" for ${name}`);
        }
    }
};

/**
 * Validate an API endpoint. (Internal function)
 *
 * @param {string} endpointName Name of the endpoint
 * @param {object} endpoint The endpoint to validate
 * @param {boolean} hasDefaultUrl Indicates if the endpoint already has a default URL
 * @throws {InvalidConfigError}
 */
export const _validateEndpoint = (endpointName, endpoint, hasDefaultUrl = false) => {
    // Validate endpoint URL
    if (!endpoint.url && !hasDefaultUrl) {
        throw new InvalidConfigError(`Missing request URL for endpoint "${endpointName}"`);
    }
};
