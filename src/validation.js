import {InvalidConfigError} from './errors';
import {getJSON} from './util';

export const VALID_REQUEST_PROPERTIES = ['url', 'method', 'headers', 'query', 'body', 'mode', 'credentials', 'cache', 'redirect', 'referer', 'integrity'];
export const VALID_RESPONSE_PROPERTIES = ['bailout', 'payload'];

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
