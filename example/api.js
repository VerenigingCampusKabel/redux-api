import {createApi} from '../lib';

import * as entities from './entities';

// Define API
export default createApi({
    name: 'EXAMPLE_API',
    url: 'https://api.example.com/api/v1',
    options: {
        // Strip trailing slash from URL
        stripTrailingSlash: true,

        // Camalize response data after request
        camalize: {
            response: true
        },

        // Decamlize query and body objects before request
        decamalize: {
            query: true,
            body: true
        }
    },

    // Request defaults
    defaults: {
        headers: {
            'Content-Type': 'application/json'
        },
        body: (payload) => JSON.stringify(payload),
        credentials: 'include'
    },

    // Entities
    entities,

    // Entity endpoints (usually CRUD)
    entityEndpoints: {
        getAll: {
            url: '/',
            method: 'GET'
        },
        createSingle: {
            url: '/',
            method: 'POST'
        },
        getSingle: {
            url: (payload) => `/${payload.id}`,
            method: 'GET'
        },
        updateSingle: {
            url: (payload) => `/${payload.id}`,
            method: 'PUT'
        },
        deleteSingle: {
            url: (payload) => `/${payload.id}`,
            method: 'DELETE'
        }
    },
    entityEndpointDefaults: {},

    // Custom endpoints
    endpoints: {
        signIn: {
            url: '/signin',
            method: 'POST'
        },
        signUp: {
            url: '/signup',
            method: 'POST'
        }
    },
    endpointDefaults: {}
});
