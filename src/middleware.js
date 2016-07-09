import fetch from 'isomorphic-fetch';

import {RequestError, InternalError} from './errors';
import {CALL_API, INVALID_REQUEST} from './types';
import {VALID_REQUEST_PROPERTIES} from './validation';

const actionWith = async (action, endpoint, ...args) => {
    // Only execute payload function on response action types
    if (!action.payload) {
        try {
            action.payload = await endpoint.payload(...args);
        } catch (err) {
            action.error = true;
            action.payload = new InternalError(err.message);
        }
    }

    return action;
};

const createApiMiddleware = (config) => {
    return ({getState}) => {
        return (next) => async (action) => {
            // Do not procecss actions without a CALL_API property
            if (!action[CALL_API]) {
                return next(action);
            }

            // Validate endpoint
            const {endpoint} = action[CALL_API];
            if (config.actions.indexOf(endpoint) === -1 || !config.endpoints[endpoint]) {
                next({
                    type: INVALID_REQUEST,
                    error: true,
                    payload: new RequestError(`Invalid endpoint: ${endpoint}`)
                });
            }

            // Fetch endpoint configuration
            const endpointConfig = config.endpoints[endpoint];

            // Generate the request configuration
            const request = {};
            try {
                for (const property of VALID_REQUEST_PROPERTIES) {
                    if (endpointConfig[property]) {
                        request[property] = endpointConfig[property]();
                    } else if (config.defaults[property]) {
                        request[property] = config.defaults[property]();
                    }
                }

                // Normalize url
                if (request.url.chartAt(0) !== '/') {
                    request.url = '/' + request.url;
                }
            } catch (err) {
                // An error occurred when executing an endpoint property function
                next(await actionWith({
                    type: endpoint.actionTypes.REQUEST,
                    error: true,
                    payload: new InternalError(err.message)
                }, endpoint, getState()));
            }

            // Dispatch request action type
            next(await actionWith({
                type: endpoint.actionTypes.REQUEST,
                error: false
            }, endpoint, getState()));

            try {
                // Make the API call
                const result = await fetch(config.url + request.url, request);

                // The server responded with a status code outside the 200-299 range
                if (!result.ok) {
                    return next(await actionWith({
                        type: endpoint.actionTypes.FAILED,
                        error: true
                    }, endpoint, getState(), result));
                }

                // The request was successful
                return next(await actionWith({
                    type: endpoint.actionTypes.SUCCESS,
                    error: false
                }, endpoint, getState(), result));
            } catch (err) {
                // The request was invalid or a network error occurred
                return next(await actionWith({
                    type: endpoint.actionTypes.FAILED,
                    error: true,
                    payload: new RequestError(err.message)
                }, endpoint, getState()));
            }
        };
    };
};

export default createApiMiddleware;
