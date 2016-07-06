import {camelCaseToUpperUnderscore} from './util';

const createApi = (config) => {
    let name = config.name ? config.name : 'API';
    if (!/^[A-Z_]+$/.test(name)) {
        name = camelCaseToUpperUnderscore(name);
    }

    // TODO: validate and parse config

    return config;
};

export default createApi;
