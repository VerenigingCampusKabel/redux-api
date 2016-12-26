import {Schema} from 'normalizr';
import {Record} from 'immutable';

import {InvalidConfigError} from './errors';

/**
 * Validate an API entity
 *
 * @param {object} entity The entity to validate
 * @throws {InvalidConfigError}
 */
export const validateEntity = (entity) => {
    // Validate entity schema
    if (!entity.schema) {
        throw new InvalidConfigError(`Missing entitiy schema`);
    }
    if (!(entity.schema instanceof Schema)) {
        throw new InvalidConfigError(`Invalid entity schema, should be an instance of "normalizr.Schema"`);
    }
    const key = entity.schema.getKey();

    // Validate entity record
    if (!entity.record) {
        throw new InvalidConfigError(`Missing entitiy record for "${key}"`);
    }
    if (!(entity.record instanceof Record)) {
        throw new InvalidConfigError(`Invalid entity record for "${key}", should be an instance of "immutable.Record"`);
    }
};

export const VALID_REQUEST_PROPERTIES = ['url', 'method', 'headers', 'query', 'body', 'mode', 'credentials', 'cache', 'redirect', 'referer', 'integrity'];
export const VALID_RESPONSE_PROPERTIES = ['bailout', 'payload', 'error'];

/**
 * Validate an API request configuration
 *
 * @param {object} config The request configuration to validate
 * @param {string} name Name of the request configuration (only displayed in the error)
 * @throws {InvalidConfigError}
 */
export const validateRequestConfig = (config, name) => {
    for (const property of Object.keys(config)) {
        if (VALID_REQUEST_PROPERTIES.indexOf(property) === -1 && VALID_RESPONSE_PROPERTIES.indexOf(property) === -1) {
            throw new InvalidConfigError(`Invalid request property "${property}" for ${name}`);
        }
    }
};

/**
 * Validate an API endpoint
 *
 * @param {string} endpointName Name of the endpoint
 * @param {object} endpoint The endpoint to validate
 * @throws {InvalidConfigError}
 */
export const validateEnpoint = (endpointName, endpoint) => {
    // Validate endpoint URL
    if (!endpoint.url) {
        throw new InvalidConfigError(`Missing request URL for endpoint "${endpointName}"`);
    }
};
