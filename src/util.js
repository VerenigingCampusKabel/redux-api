import {InternalError} from './errors';

export const HTTP_STATUS_EMPTY = [204, 205];

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
