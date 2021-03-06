import {Map, fromJS} from 'immutable';

import {InvalidConfigError} from './errors';
import {API_SIGNATURE, RESET_ENDPOINT} from './types';

/**
 * Create a Redux reducer for an API.
 *
 * @param {object} api API configuration
 * @param {object} isImmutable Whether to convert payload data to an Immutable object
 * @return {function} The created Redux reducer
 */
export const createApiReducer = (api, isImmutable = false) => {
    // Validate API configuration
    if (typeof api !== 'object') {
        throw new InvalidConfigError(`Invalid API configuration: ${api}`);
    }

    // Gather relevant information
    const {
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
                    .setIn(['endpoints', action.endpoint, 'data'], isImmutable ? fromJS(action.payload) : action.payload)
                    .setIn(['endpoints', action.endpoint, 'error'], action.payloadError);
            } else if (failureTypes.indexOf(action.type) !== -1) {
                return state
                    .setIn(['endpoints', action.endpoint, 'loading'], false)
                    .setIn(['endpoints', action.endpoint, 'finished'], true)
                    .setIn(['endpoints', action.endpoint, 'data'], isImmutable ? fromJS(action.payload) : action.payload)
                    .setIn(['endpoints', action.endpoint, 'error'], action.hasPayloadError ? action.payloadError : action.error);
            } else if (action.type === RESET_ENDPOINT) {
                return state
                    .setIn(['endpoints', action.endpoint, 'loading'], false)
                    .setIn(['endpoints', action.endpoint, 'finished'], false)
                    .setIn(['endpoints', action.endpoint, 'data'], null)
                    .setIn(['endpoints', action.endpoint, 'error'], null);
            }
        }

        return state;
    };
};
