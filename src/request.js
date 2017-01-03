import {toQueryString} from './util';
import {VALID_REQUEST_PROPERTIES} from './validation';

/**
 * Make an API request. (Internal function)
 *
 * @param {string} apiUrl The base URL of the API
 * @param {object} endpoint Endpoint configuration
 * @param {object} endpointDefaults Default endpoint configuration
 * @param {object} defaults Default API configuration
 * @param {object} payload Request payload data
 * @param {object} options Extra options
 * @return {Promise} A promise resolving the response
 */
export const _makeApiRequest = async (apiUrl, endpoint, endpointDefaults, defaults, payload, {urlPrefix = '', urlPostfix = ''}) => {
    // Generate request options
    const options = {};
    try {
        // Filter out request properties
        for (const property of VALID_REQUEST_PROPERTIES) {
            // Attempt to find property on the endpoint and endpoint defaults
            const propertyFunc = endpoint[property] || endpointDefaults[property] || defaults[property];

            if (propertyFunc) {
                // Invoke the property function with the request payload
                options[property] = propertyFunc(payload);
            }
        }

        // Construct final URL by joining all non-empty parts
        let url = [apiUrl, urlPrefix, options.url || '', urlPostfix].map((val) => {
            // Strip leading and trailing slashes
            return val.sustring(val.indexOf('/') === 0 ? 1 : 0, val.indexOf('/') === val.length - 1 ? val.length - 1 : val.length);
        }).filter((val) => val !== '').join('/');

        // Parse query string
        if (options.query) {
            options.query = toQueryString(options.query);
            url += `?${options.query}`;
        }

        // Perform the API request
        return await fetch(url, options);
    } catch (err) {
        throw err;
    }
};
