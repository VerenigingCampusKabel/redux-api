import {CALL_API} from './types';

export const createApiAction = (modelName, endpointName) => {
    return (payload) => ({
        [CALL_API]: {
            model: modelName,
            endpoint: endpointName,
            payload: payload
        }
    });
};

export const createApiActions = (api) => {
    const models = {};
    for (const [modelName, model] of Object.entries(api.models)) {
        models[modelName] = model.actions;
    }

    const actions = {
        ...models
    };
    for (const endpointName of Object.keys(api.customEndpoints)) {
        actions[endpointName] = createApiAction(undefined, endpointName);
    }
    return actions;
};
