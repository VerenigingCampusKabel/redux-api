import {InvalidConfigError, RequestError} from './errors';
import {_makeApiRequest} from './request';
import {API_SIGNATURE} from './types';

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
    return ({getState}) => (next) => async (action) => {
        // Only process our request actions
        if (requestTypes.indexOf(action.type) === -1) {
            return next(action);
        }

        // Make sure the reducers receive the request action
        next(action);

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
        const dispatchAction = ({type, isError = false, error = null, payload = null, hasPayloadError = false, payloadError = null}) => next({
            signature: API_SIGNATURE,
            api: apiName,
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

        const information = {
            api,
            type: action.type,
            isEntity,
            entity,
            entityName,
            endpoint,
            endpointName,
            endpointDefaults,
            requestPayload
        };

        // Attempt to find bailout function on the endpoint or endpoint defaults
        const bailoutFunc = endpoint.bailout || endpointDefaults.bailout || api.defaults.bailout;
        if (bailoutFunc) {
            try {
                // Invoke the bailout function with the relevant request information and Redux state
                const bailoutPayload = await bailoutFunc(information, getState());

                if (bailoutPayload !== undefined && bailoutPayload !== null && bailoutPayload !== false) {
                    // Dispatch success action
                    return dispatchAction({
                        type: types.success,
                        payload: bailoutPayload
                    });
                }
            } catch (err) {
                // Dispatch failure action
                const result = dispatchAction({
                    types: types.failure,
                    isError: true,
                    error: err
                });

                // Return the failure action for the resulting promise
                return result;
            }
        }

        let response = null;
        try {
            // Perform the API request
            response = await _makeApiRequest(api.url, endpoint, endpointDefaults, api.defaults, requestPayload, {
                urlPrefix: isEntity ? entity.urlPrefix : '',
                urlPostfix: isEntity ? entity.urlPostfix : '',
                camelize: api.options.camelize,
                decamelize: api.options.decamelize,
                bodyType: api.options.bodyType,
                information
            });
        } catch (err) {
            // Dispatch failure action
            const result = dispatchAction({
                type: types.failure,
                isError: true,
                error: err
            });

            // Return the failure action for the resulting promise
            return result;
        }

        // The server responded with a status code outside the 200-399 range (i.e. error)
        const isError = response.status < 200 || response.status > 399;
        let responsePayload = null;
        let responsePayloadError = null;
        try {
            // Attempt to find payload or error function
            const payloadFunc = isError ? endpoint.error || endpointDefaults.error || api.defaults.error :
                endpoint.payload || endpointDefaults.payload || api.defaults.error;

            // Attempt to find a schema function
            let schema = null;
            const schemaFunc = isError ? null : endpoint.schema || endpointDefaults.schema || api.defaults.schema;
            if (schemaFunc) {
                // Invoke the property function with the entity schema
                schema = schemaFunc(isEntity ? entity.schema : null);
            }

            if (payloadFunc) {
                // Invoke payload/error function with the response and request information
                responsePayload = await payloadFunc(response, information, schema);
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
            hasPayloadError: responsePayloadError !== undefined && responsePayloadError !== null,
            payloadError: responsePayloadError
        });

        // Return the success/failure action for the resulting promise
        return result;
    };
};
