import {createApi} from '../lib';

export default createApi({
    name: 'EXAMPLE_API',
    url: 'http://api.example.com/api/v1',
    stripSlash: true,
    models: [
        'user',
        'device'
    ],
    defaults: {
        headers: {
            'Content-Type': 'application/json'
        },
        body: (payload) => JSON.stringify(payload),
        credentials: 'include'
    },
    endpoints: {
        getAll: {
            url: '/',
            method: 'GET'
        },
        get: {
            url: (payload) => `/${payload.id}`,
            method: 'GET'
        },
        create: {
            url: '/',
            method: 'POST'
        },
        update: {
            url: (payload) => `/${payload.id}`,
            method: 'PUT'
        },
        delete: {
            url: (payload) => `/${payload.id}`,
            method: 'DELETE'
        }
    },
    customEndpoints: {
        login: {
            url: '/login',
            method: 'POST'
        },
        register: {
            url: '/register',
            method: 'POST'
        }
    }
});
