import {InvalidConfigError} from './errors';
import {getJSON} from './util';

export const VALID_REQUEST_PROPERTIES = ['url', 'method', 'headers', 'query', 'body', 'mode', 'credentials', 'cache', 'redirect', 'referer', 'integrity'];
export const VALID_RESPONSE_PROPERTIES = ['payload'];
const VALID_METHOD = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'];
const VALID_MODE = ['cors', 'no-cors', 'same-origin'];
const VALID_CREDENTIALS = ['omit', 'same-origin', 'include'];
const VALID_CACHE = ['default', 'no-store', 'reload', 'no-cache', 'force-cache', 'only-if-cached'];
const VALID_REDIRECT = ['follow', 'error', 'manual'];

export const validateEnpoint = (endpointName, endpoint) => {
    for (const property of Object.keys(endpoint)) {
        if (VALID_REQUEST_PROPERTIES.indexOf(property) === -1 && VALID_RESPONSE_PROPERTIES.indexOf(property) === -1) {
            throw new InvalidConfigError(`Invalid endpoint property (${property}) on ${endpointName}`);
        }

        // Normalize properties
        if (typeof endpoint[property] !== 'function') {
            endpoint[property] = () => endpoint[property];
        }
    }

    // Validate url
    if (!endpoint.url) {
        throw new InvalidConfigError(`Missing endpoint url on ${endpointName}`);
    }

    if (!endpoint.payload) {
        endpoint.payload = getJSON;
    }

    // if (Object.keys(other) !== 0) {
    //     throw new InvalidConfigError(`Invalid endpoint properties (${Object.keys(other).join(', ')}) on ${endpointName}`);
    // }
    //
    // if (!method) {
    //     throw new InvalidConfigError(`Missing endpoint method on ${endpointName}`);
    // } else if (typeof method !== 'string' || VALID_METHOD.indexOf(method) === -1) {
    //     throw new InvalidConfigError(`Invalid endpoint method (${method}) on endpoint ${endpointName}`);
    // }
    //
    // if (headers && typeof headers !== 'object') {
    //     throw new InvalidConfigError(`Invalid endpoint headers (${headers}) on endpoint ${endpointName}`);
    // }
    //
    // if (query && (typeof query !== 'string' && typeof query !== 'object')) {
    //     throw new InvalidConfigError(`Invalid endpoint query (${query}) on endpoint ${endpointName}`);
    // }
};
