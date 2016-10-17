import {fromJS} from 'immutable';

import {INVALID_REQUEST} from './types';

export const createApiReducer = (api) => {
    const {
        actionTypes: {
            request: requestTypes,
            success: successTypes,
            failed: failedTypes
        }
    } = api;

    const initialState = fromJS({
        models: {},
        pages: {}
    });

    return (state = initialState, action) => {
        if (action.type === INVALID_REQUEST) {
            console.error('Invalid API request:', action);
        } else if (requestTypes.indexOf(action.type) !== -1) {

        } else if (successTypes.indexOf(action.type) !== -1) {
            const data = action.payload;

            switch (action.endpoint) {
                case 'getAll': {
                    let instances = {};
                    for (const instance of data.objects) {
                        instances[instance.id] = instance;
                    }
                    const instanceKeys = fromJS(Object.keys(instances));
                    instances = fromJS(instances);

                    return state.mergeDeepIn(['models', action.model], instances).setIn(['pages', action.model, data.page], instanceKeys);
                }
                case 'get':
                case 'update': {
                    return state.setIn(['models', action.model, data.get('id')], fromJS({
                        timestamp: new Date(),
                        instance: data
                    }));
                }
                case 'delete': {
                    return state.deleteIn(['models', action.model, data.get('id')]);
                }
                default: {
                    return state;
                }
            }
        } else if (failedTypes.indexOf(action.type) !== -1) {

        }
        return state;
    };
};
