import {InternalError} from './errors';

export const camelCaseToUnderscore = (value) => value.replace(/([A-Z])/g, (p1) => '_' + p1).toLowerCase();

export const camelCaseToUpperUnderscore = (value) => value.replace(/([A-Z])/g, (p1) => '_' + p1).toUpperCase();

export const underscoreToCamelCase = (value) => value.replace(/_([a-z])/g, (p1) => p1.toUpperCase());

export const upperUnderscoreToCamelCase = (value) => value.toLowerCase().replace(/_([a-z])/g, (p1) => p1.toUpperCase());

export const capatalize = (value) => value.substring(0, 1).toUpperCase() + value.substring(1, value.length);

const HTTP_STATUS_EMPTY = [204, 205];

export const getJSON = async (state, dispatch, response) => {
    if (!response) {
        throw new InternalError('No response object passed to getJSON');
    }

    const contentType = response.headers.get('Content-Type');

    if (HTTP_STATUS_EMPTY.indexOf(response.status) !== -1 || !contentType || contentType.indexOf('json') === -1) {
        return null;
    }

    return await response.json();
};
