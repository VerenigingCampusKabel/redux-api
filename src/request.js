import humps from 'humps';
import fetch from 'isomorphic-fetch';

import {toQueryString} from './util';
import {VALID_REQUEST_PROPERTIES} from './validation';

/**
 * List of Fetch API body types
 */
export const FETCH_BODY_TYPES = ['Blob', 'BufferSource', 'FormData', 'URLSearchParams', 'USVString'];

/**
 * Make an API request. (Internal function)
 *
 * @param {string} apiUrl The base URL of the API
 * @param {object} endpoint Endpoint configuration
 * @param {object} endpointDefaults Default endpoint configuration
 * @param {object} defaults Default API configuration
 * @param {object} payload Request payload data
 * @param {object} options Extra options
 * @param {string} options.urlPrefix URL prefix
 * @param {string} options.urlPrefix URL prefix
 * @param {string} options.urlPostfix URL postfix
 * @param {object} options.camelize Camelization options
 * @param {boolean} options.camelize.query Should the query be camelized
 * @param {boolean} options.camelize.body Should the request body be camelized
 * @param {boolean} options.camelize.response Should the response be camelized
 * @param {object} options.decamelize Decamelization options
 * @param {boolean} options.decamelize.query Should the query be decamelized
 * @param {boolean} options.decamelize.body Should the request body be decamelized
 * @param {boolean} options.decamelize.response Should the response be decamelized
 * @param {object} options.bodyType Request body type (json or urlencoded)
 * @return {Promise} A promise resolving the response
 */
export const _makeApiRequest = async (apiUrl, endpoint, endpointDefaults, defaults, payload,
    {urlPrefix = '', urlPostfix = '', camelize, decamelize, bodyType, information = null}) => {
    // Generate request options
    const options = {};
    try {
        // Filter out request properties
        for (const property of VALID_REQUEST_PROPERTIES) {
            // Attempt to find property on the endpoint and endpoint defaults
            const propertyFunc = endpoint[property] || endpointDefaults[property] || defaults[property];

            if (propertyFunc) {
                // Invoke the property function with the request payload
                options[property] = propertyFunc(payload, information);
            }
        }

        // Construct final URL by joining all non-empty parts
        let url = [apiUrl, urlPrefix, options.url || '', urlPostfix].map((val) => {
            // Strip leading and trailing slashes
            return val === '/' ? '' : val.substring(val.indexOf('/') === 0 ? 1 : 0, val.indexOf('/') === val.length - 1 ? val.length - 1 : val.length);
        }).filter((val) => val !== '').join('/');

        // Parse query
        if (options.query) {
            // Check for camelize options
            if (camelize && camelize.query) {
                options.query = humps.camelizeKeys(options.query);
            }

            // Check for decamelize options
            if (decamelize && decamelize.query) {
                options.query = humps.decamelizeKeys(options.query);
            }

            options.query = toQueryString(options.query);
            url += `?${options.query}`;
        }

        // Parse request body
        if (options.body) {
            // Check if it's not a Fetch API supported object already
            if (typeof options.body === 'object' && FETCH_BODY_TYPES.indexOf(options.body[Symbol.toStringTag]) === -1) {
                // Check for camelize options
                if (camelize && camelize.body) {
                    options.body = humps.camelizeKeys(options.body);
                }

                // Check for decamelize options
                if (decamelize && decamelize.body) {
                    options.body = humps.decamelizeKeys(options.body);
                }

                // Convert request body to query string or JSON string
                if (bodyType === 'urlencoded') {
                    options.body = toQueryString(options.body);
                } else {
                    options.body = JSON.stringify(options.body);
                }
            }
        }

        // Perform the API request
        return await fetch(url, options);
    } catch (err) {
        throw err;
    }
};
