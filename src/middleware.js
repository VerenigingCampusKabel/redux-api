const createApiMiddleware = (config) => {
    return (next) => async ({getState}) => {
        return next();
    };
};

export default createApiMiddleware;
