import {CALL_API} from './types';

export const createApiAction = (modelName, endpointName) => {
    return (payload, options) => ({
        [CALL_API]: {
            model: modelName,
            endpoint: endpointName,
            payload: payload,
            options: options
        }
    });
};

export const createApiActions = (api) => {
    const models = {};
    for (const [modelName, model] of Object.entries(api.models)) {
        models[modelName] = model.actions;
    }
    return models;
};
