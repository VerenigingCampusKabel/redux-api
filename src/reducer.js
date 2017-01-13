import {Map} from 'immutable';

import {InvalidConfigError} from './errors';
import {API_SIGNATURE} from './types';

/**
 * Create a Redux reducer for an API.
 *
 * @param {object} api API configuration
 * @return {function} The created Redux reducer
 */
export const createApiReducer = (api) => {
    // Validate API configuration
    if (typeof api !== 'object') {
        throw new InvalidConfigError(`Invalid API configuration: ${api}`);
    }

    // Gather relevant information
    const {
        // entityReducer: options,
        mergedTypes: {
            request: requestTypes,
            success: successTypes,
            failure: failureTypes
        }
    } = api;

    const initialState = new Map();

    // Return the reducer
    return (state = initialState, action) => {
        // Check if this is one of our actions (quicker than looping through 3 arrays)
        if (action.signature === API_SIGNATURE) {
            if (action.isEntity) {
                // Succes type
                // if (successTypes.indexOf(action.type) !== -1) {
                //
                // }
                return state;
            }

            // Endpoint action
            if (requestTypes.indexOf(action.type) !== -1) {
                return state
                    .setIn(['endpoints', action.endpoint, 'loading'], true)
                    .setIn(['endpoints', action.endpoint, 'finished'], false)
                    .setIn(['endpoints', action.endpoint, 'data'], null)
                    .setIn(['endpoints', action.endpoint, 'error'], null);
            } else if (successTypes.indexOf(action.type) !== -1) {
                return state
                    .setIn(['endpoints', action.endpoint, 'loading'], false)
                    .setIn(['endpoints', action.endpoint, 'finished'], true)
                    .setIn(['endpoints', action.endpoint, 'data'], action.payload)
                    .setIn(['endpoints', action.endpoint, 'error'], action.payloadError);
            } else if (failureTypes.indexOf(action.type) !== -1) {
                return state
                    .setIn(['endpoints', action.endpoint, 'loading'], false)
                    .setIn(['endpoints', action.endpoint, 'finished'], true)
                    .setIn(['endpoints', action.endpoint, 'data'], action.payload)
                    .setIn(['endpoints', action.endpoint, 'error'], action.hasPayloadError ? action.payloadError : action.error);
            }
        }

        return state;
    };
};
