import {InvalidConfigError} from './errors';
import {camelCaseToUpperUnderscore} from './util';

const createApiActions = (api, modelName) => {
    // TODO: create actions

    const model = {
        name: modelName,
        actionType: camelCaseToUpperUnderscore(modelName)
    };

    return {};
};

export default createApiActions;
