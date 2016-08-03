import fetch from 'isomorphic-fetch';

import {RequestError, InternalError} from './errors';
import {CALL_API, INVALID_REQUEST} from './types';
import {VALID_REQUEST_PROPERTIES} from './validation';

const actionWith = async (action, endpoint, ...args) => {
    // Only execute payload function on response action types
    if (action.payload && !(action.payload instanceof Error)) {
        try {
            action.payload = await endpoint.payload(...args);
        } catch (err) {
            action.error = true;
            action.payload = new InternalError(err.message);
        }
    }

    return action;
};

// TODO: pagination
// TODO: caching

export const createApiMiddleware = (config) => {
    return ({getState, dispatch}) => {
        return (next) => async (action) => {
            // Do not procecss actions without a CALL_API property
            if (!action[CALL_API]) {
                return next(action);
            }

            // Validate endpoint
            const {model: modelName, endpoint: endpointName, payload, options} = action[CALL_API];
            if (!endpointName || (typeof endpointName === 'string' && !config.endpoints[endpointName])) {
                return next(await actionWith({
                    type: INVALID_REQUEST,
                    error: true,
                    payload: new RequestError(`Invalid endpoint: ${endpointName}`)
                }, endpointName, getState(), dispatch));
            }
            if (typeof endpointName === 'string' && (!modelName || !config.models[modelName])) {
                return next(await actionWith({
                    type: INVALID_REQUEST,
                    error: true,
                    payload: new RequestError(`Invalid endpoint model (${modelName}) on ${endpointName}`)
                }, endpointName, getState(), dispatch));
            }

            // Fetch endpoint and model configuration
            const endpoint = typeof endpointName === 'object' ? endpointName : config.endpoints[endpointName];
            const model = typeof endpointName === 'object' ? null : config.models[modelName];

            // Generate the request configuration
            const request = {};
            try {
                for (const property of VALID_REQUEST_PROPERTIES) {
                    if (endpoint[property]) {
                        request[property] = endpoint[property](payload, options);
                    } else if (config.defaults[property]) {
                        request[property] = config.defaults[property](payload, options);
                    }
                }

                // Normalize url
                if (request.url.charAt(0) !== '/') {
                    request.url = '/' + request.url;
                }

                // Append API and model url prefixes
                request.url = config.url + (model ? '/' + model.url : '') + request.url;

                // Check if the request should be canceled
                if (endpoint.bailout) {
                    if (await endpoint.bailout(getState(), dispatch, request)) {
                        return;
                    }
                } else if (config.defaults.bailout) {
                    if (await config.defaults.bailout(getState(), dispatch, request)) {
                        return;
                    }
                }
            } catch (err) {
                 // An error occurred when executing an endpoint property function
                return next(await actionWith({
                    type: model ? model.actionTypes[endpointName].REQUEST : endpoint.actionTypes.REQUEST,
                    error: true,
                    payload: new InternalError(err)
                }, endpoint, getState(), dispatch));
            }

            // Dispatch request action type
            next(await actionWith({
                type: model ? model.actionTypes[endpointName].REQUEST : endpoint.actionTypes.REQUEST,
                error: false
            }, endpoint, getState(), dispatch));

            try {
                // Strip the last slash if configured
                if (config.stripSlash && request.url.charAt(request.url.length - 1) === '/') {
                    request.url = request.url.substring(0, request.url.length - 1);
                }

                // Make the API call
                const result = await fetch(request.url, request);

                // The server responded with a status code outside the 200-299 range
                if (!result.ok) {
                    return next(await actionWith({
                        type: model ? model.actionTypes[endpointName].FAILED : endpoint.actionTypes.FAILED,
                        error: true,
                        payload: {}
                    }, endpoint, getState(), dispatch, result));
                }

                // The request was successful
                return next(await actionWith({
                    type: model ? model.actionTypes[endpointName].SUCCESS : endpoint.actionTypes.SUCCESS,
                    error: false,
                    payload: {}
                }, endpoint, getState(), dispatch, result));
            } catch (err) {
                // The request was invalid or a network error occurred
                return next(await actionWith({
                    type: model.actionTypes[endpointName].FAILED,
                    error: true,
                    payload: new RequestError(err)
                }, endpoint, getState(), dispatch));
            }
        };
    };
};
