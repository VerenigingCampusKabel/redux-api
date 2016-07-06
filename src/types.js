import {camelCaseToUpperUnderscore} from './util';

const createApiActionTypes = (api, model) => {
    const name = camelCaseToUpperUnderscore(model);
    const types = {};

    // TODO: get actions list from api object (see api.js)

    // for (const action of actions) {
    //     const type = name + '_' + action;
    //     types[type] = Symbol(type);
    // }

    return types;
};

export default createApiActionTypes;
