import {InvalidConfigError, RequestError} from './errors';
import {_makeApiRequest} from './request';

/**
 * Create Redux middleware for one or more API's
 *
 * @param {object[]} apis One or more API configurations
 * @return {function} The created Redux middleware
 */
export const createApiMiddleware = (...apis) => {
    // Validate API configuration(s)
    for (const api of apis) {
        if (typeof api !== 'object') {
            throw new InvalidConfigError(`Invalid API configuration: ${api}`);
        }
    }

    // Create API lookup table
    const apiLookup = apis.reduce((final, api) => ({...final, [api.name]: api}), {});

    // Merge request action types
    const requestTypes = apis.reduce((final, api) => final.concat(api.mergedTypes.request), []);

    // Redux middleware
    return ({dispatch, getState}) => (next) => async (action) => {
        // Only process our request actions
        if (requestTypes.indexOf(action.type) === -1) {
            return next(action);
        }

        // Look up required information
        const {api: apiName, isEntity, entity: entityName, endpoint: endpointName, requestPayload} = action;
        const api = apiLookup[apiName];
        let entity = null;
        let endpoint = null;
        let endpointDefaults = null;
        let types = null;

        if (isEntity) {
            entity = api.entities[entityName];
            endpoint = api.entityEndpoints[endpointName];
            endpointDefaults = api.entityEndpointDefaults;
            types = api.types.entities[entityName][endpointName];
        } else {
            endpoint = api.endpoints[endpointName];
            endpointDefaults = api.endpointDefaults;
            types = api.types.custom[endpointName];
        }

        // Generate dispatch action function (improves readability of the code below)
        const dispatchAction = ({type, isError = false, error = null, payload = null, hasPayloadError = false, payloadError = null}) => dispatch({
            type,
            isEntity,
            entity: entityName,
            endpoint: endpointName,
            requestPayload,
            isError,
            error,
            payload,
            hasPayloadError,
            payloadError
        });

        // Attempt to find bailout function on the endpoint or endpoint defaults
        const bailoutFunc = endpoint.bailout || endpointDefaults.bailout || api.defaults.bailout;
        if (bailoutFunc) {
            try {
                // Invoke the bailout function with the relevant request information and Redux state
                const bailoutPayload = await bailoutFunc({
                    api,
                    type: action.type,
                    isEntity,
                    entity,
                    entityName,
                    endpoint,
                    endpointName,
                    endpointDefaults,
                    requestPayload
                }, getState());

                if (bailoutPayload !== undefined && bailoutPayload !== null && bailoutPayload !== false) {
                    // Dispatch success action
                    return dispatchAction({
                        type: types.success,
                        payload: bailoutPayload
                    });
                }
            } catch (err) {
                // Dispatch failure action
                dispatchAction({
                    types: types.failure,
                    isError: true,
                    error: err
                });

                // Throw the error for the resulting promise
                throw err;
            }
        }

        try {
            // Perform the API request
            const response = await _makeApiRequest(api.url, endpoint, endpointDefaults, api.defaults, requestPayload, {
                urlPrefix: isEntity ? entity.urlPrefix : '',
                urlPostfix: isEntity ? entity.urlPostfix : '',
                camelize: api.options.camelize,
                decamelize: api.options.decamelize,
                bodyType: api.options.bodyType
            });

            // The server responded with a status code outside the 200-399 range (i.e. error)
            const isError = response.status < 200 || response.status > 399;
            let responsePayload = null;
            let responsePayloadError = null;
            try {
                // Attempt to find payload or error function
                const payloadFunc = isError ? endpoint.error || endpointDefaults.error || api.defaults.error :
                    endpoint.payload || endpointDefaults.payload || api.defaults.error;

                if (payloadFunc) {
                    // Invoke payload/error function with the response and request information
                    responsePayload = await payloadFunc(response, {
                        api,
                        type: action.type,
                        isEntity,
                        entity,
                        entityName,
                        endpoint,
                        endpointName,
                        endpointDefaults,
                        requestPayload
                    });
                }
            } catch (err) {
                // An error occurred while parsing the response (soft fail)
                responsePayloadError = err;
            }

            // Generate error if necessary
            const error = isError ? new RequestError(`Request failed, the server responded with status ${response.status}`) : null;

            // Dispatch action
            const result = dispatchAction({
                type: isError ? types.failure : types.success,
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
            dispatchAction({
                type: types.failure,
                isError: true,
                error: err
            });

            // Throw the error for the resulting promise
            throw err;
        }
    };
};
