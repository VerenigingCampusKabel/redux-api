import humps from 'humps';
import {normalize} from 'normalizr';
import qs from 'qs';

import {InternalError} from './errors';

/**
 * Determine the type of a JavaScript object.
 *
 * @param {object} obj Input object
 * @return {string} Type of the JavaScript object
 */
export const determineObjectType = (obj) => {
    if (obj[Symbol.toStringTag]) {
        return obj[Symbol.toStringTag];
    }
    const str = obj.toString();
    return str.substring(8, str.length - 1);
};

/**
 * Normalizes a configuration object by converting all propert values to functions.
 *
 * @param {object} config A configuration object
 * @return {object} The normalized configuration object
 */
export const normalizeConfig = (config) => {
    const newConfig = {};
    for (const [key, value] of Object.entries(config)) {
        newConfig[key] = typeof value === 'function' ? value : () => value;
    }
    return newConfig;
};

/**
 * Converts a query object to a query string using qs.
 * Also accepts query strings, but those are ignored.
 *
 * @param {string|object} value A query object
 * @return {string} The resulting query string
 */
export const toQueryString = (value) => {
    if (typeof value === 'object') {
        return qs.stringify(value);
    }
    return value.toString();
};

/**
 * List of HTTP status codes with empty responses.
 */
export const HTTP_STATUS_EMPTY = [204, 205];

/**
 * Parse a Fetch API response as JSON.
 *
 * @param {Response} response A Fetch API response
 * @param {object} request Object containing request information
 * @param {object} request.api API configuration
 * @param {object} schema A normalizr schema to use for parsing the data or null
 * @return {Promise} A promise resolving the parsed JSON or null
 */
export const getJSON = async (response, {api}, schema = null) => {
    if (!response) {
        throw new InternalError('No response object passed to getJSON');
    }

    const contentType = response.headers.get('Content-Type');

    if (HTTP_STATUS_EMPTY.indexOf(response.status) !== -1 || !contentType || contentType.indexOf('json') === -1) {
        return null;
    }

    let data = await response.json();

    // Check for camelize options
    if (api.options.camelize && api.options.camelize.response) {
        data = humps.camelizeKeys(data);
    }

    // Check for decamelize options
    if (api.options.decamelize && api.options.decamelize.response) {
        data = humps.decamelizeKeys(data);
    }

    // Parse the data using normalizr
    if (schema) {
        data = normalize(data, schema);
    }

    return data;
};
