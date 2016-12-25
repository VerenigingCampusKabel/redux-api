import {Schema} from 'normalizr';
import {Record} from 'immutable';

import {InvalidConfigError} from './errors';
import {getJSON} from './util';

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
 * Validate an API endpoint
 *
 * @param {string} endpointName Name of the endpoint
 * @param {object} endpoint The endpoint to validate
 * @param {boolean} isDefaults Indicates whether the endpoint is actually a default endpoint configuration
 * @throws {InvalidConfigError}
 */
export const validateEnpoint = (endpointName, endpoint, isDefaults = false) => {
    for (const property of Object.keys(endpoint)) {
        if (VALID_REQUEST_PROPERTIES.indexOf(property) === -1 && VALID_RESPONSE_PROPERTIES.indexOf(property) === -1) {
            throw new InvalidConfigError(`Invalid endpoint property (${property}) on ${endpointName}`);
        }

        // Normalize properties
        if (typeof endpoint[property] !== 'function') {
            const value = endpoint[property];
            endpoint[property] = () => value;
        }
    }

    if (!isDefaults) {
        // Validate url
        if (!endpoint.url) {
            throw new InvalidConfigError(`Missing endpoint url on ${endpointName}`);
        }

        if (!endpoint.payload) {
            endpoint.payload = getJSON;
        }
    }
};
