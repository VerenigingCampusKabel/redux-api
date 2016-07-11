import {CALL_API} from './types';

export const createApiAction = (modelName, endpointName) => {
    return (payload) => ({
        [CALL_API]: {
            model: modelName,
            endpint: endpointName,
            payload: payload
        }
    });
};

const createApiActions = (api) => {
    const models = {};
    for (const [modelName, model] of Object.entries(api.models)) {
        models[modelName] = model.actions;
    }
    return models;
};

export default createApiActions;
