export const createApiSelectors = (api) => {
    const models = {};
    for (const [modelName, model] of Object.entries(api.models)) {
        models[modelName] = model.selectors;
    }
    return models;
};
