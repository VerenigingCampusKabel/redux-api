import {InvalidConfigError, RequestError} from './errors';
import {_makeApiRequest} from './request';

/**
 * Create an API endpoint action. (Internal function)
 *
 * @param {object} entity Entity configuration
 * @param {string} endpointName Name of the endpoint
 * @param {object} endpoint Endpoint configuration
 * @param {object} endpointDefaults Default endpoint configuration
 * @param {object} defaults Default API configuration
 * @param {object} types Object containing the endpoint action types
 * @return {function} The created endpoint action
 */
export const _createApiAction = (entity, endpointName, endpoint, endpointDefaults, defaults, types) => {
    return (payload) => async (dispatch) => {
        // Dispatch request action
        dispatch({
            type: types.request,
            entity: entity.name,
            endpoint: endpointName,
            requestPayload: payload
        });

        // Attempt to find bailout function on the endpoint or endpoint defaults
        const bailoutFunc = endpoint.bailout || endpointDefaults.bailout || defaults.bailout;
        if (bailoutFunc) {
            try {
                // Invoke the bailout function with the relevant request information
                const bailoutPayload = await bailoutFunc({
                    entity: entity.name,
                    endpoint: endpointName,
                    requestPayload: payload
                });

                if (bailoutPayload !== undefined && bailoutPayload !== null && bailoutPayload !== false) {
                    // Dispatch success action
                    return dispatch({
                        type: types.failure,
                        entity: entity.name,
                        endpoint: endpointName,
                        requestPayload: payload,
                        isError: false,
                        error: null,
                        payload: bailoutPayload,
                        hasPayloadError: false,
                        payloadError: null
                    });
                }
            } catch (err) {
                // Dispatch failure action
                dispatch({
                    type: types.failure,
                    entity: entity.name,
                    endpoint: endpointName,
                    requestPayload: payload,
                    isError: true,
                    payload: err,
                    hasPayloadError: false,
                    payloadError: null
                });

                // Throw the error for the resulting promise
                throw err;
            }
        }

        try {
            // Perform the API request
            const response = await _makeApiRequest(endpoint, endpointDefaults, defaults, payload, {urlPrefix: entity.urlPrefix, urlPostfix: entity.urlPostfix});

            // The server responded with a status code outside the 200-399 range (i.e. error)
            const isError = response.status < 200 || response.status > 399;
            let responsePayload = null;
            let responsePayloadError = null;
            try {
                // Attempt to find payload or error function
                const payloadFunc = isError ? endpoint.error || endpointDefaults.error || defaults.error :
                    endpoint.payload || endpointDefaults.payload || defaults.error;

                if (payloadFunc) {
                    // Invoke payload/error function with the response
                    responsePayload = await payloadFunc(response);
                }
            } catch (err) {
                // An error occurred while parsing the response (soft fail)
                responsePayloadError = err;
            }

            // Generate error if necessary
            const error = isError ? new RequestError(`Request failed, the server responded with status ${response.status}`) : null;

            // Dispatch action
            const result = dispatch({
                type: isError ? types.failure : types.success,
                entity: entity.name,
                endpoint: endpointName,
                requestPayload: payload,
                isError,
                error,
                payload: responsePayload,
                hasPayloadError: responsePayloadError !== undefined || responsePayload !== null,
                payloadError: responsePayloadError
            });

            if (isError) {
                // Throw the error for the resulting promise
                throw error;
            } else {
                // Return the result for the resulting promise
                return result;
            }
        } catch (err) {
            // Dispatch failure action
            dispatch({
                type: types.failure,
                entity: entity.name,
                endpoint: endpointName,
                requestPayload: payload,
                isError: true,
                error: err,
                payload: null,
                hasPayloadError: false,
                payloadError: null
            });

            // Throw the error for the resulting promise
            throw err;
        }
    };
};

/**
 * Create API actions.
 *
 * @param {object} api API configuration
 * @return {object} An object containing all endpoint actions
 */
export const createApiActions = (api) => {
    if (typeof api !== 'object') {
        throw new InvalidConfigError(`Invalid API configuration: ${api}`);
    }

    const apiActions = {};

    for (const entity of Object.values(api.entities)) {
        const actions = {};

        for (const [endpointName, endpoint] of Object.entries(api.entityEndpoints)) {
            const types = api.types.entitites[entity.name][endpointName];
            actions[endpointName] = _createApiAction(entity, endpoint, api.entityEndpointDefaults, api.defaults, types);
        }

        apiActions[entity.name] = actions;
    }

    return apiActions;
};
