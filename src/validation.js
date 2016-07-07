import {InvalidConfigError} from './errors';

const VALID_PROPERTIES = ['method', 'headers', 'query', 'body', 'mode', 'credentials', 'cache', 'redirect', 'referer', 'integrity'];
const VALID_METHOD = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'];
const VALID_MODE = ['cors', 'no-cors', 'same-origin'];
const VALID_CREDENTIALS = ['omit', 'same-origin', 'include'];
const VALID_CACHE = ['default', 'no-store', 'reload', 'no-cache', 'force-cache', 'only-if-cached'];
const VALID_REDIRECT = ['follow', 'error', 'manual'];

export const validateEnpoint = (endpointName, endpoint) => {
    for (const property of Object.keys(endpoint)) {
        if (VALID_PROPERTIES.indexOf(property) === -1) {
            throw new InvalidConfigError(`Invalid endpoint property (${property}) on ${endpointName}`);
        }

        // Normalize properties
        if (typeof endpoint[property] !== 'function') {
            endpoint[property] = () => endpoint[property];
        }
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
