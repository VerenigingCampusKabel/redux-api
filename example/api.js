import {createApi, getJSON} from '../lib';

import * as entities from './entities';

// Define API
export default createApi({
    name: 'EXAMPLE_API',
    // url: 'https://api.example.com/api/v1',
    url: 'https://jsonplaceholder.typicode.com',
    options: {
        // Strip trailing slash from URL
        stripTrailingSlash: true,

        // How should body objects be parsed (json or urlencoded), however this does not set the content type header
        bodyType: 'json',

        // Camelize response data after request
        camelize: {
            response: true
        },

        // Decamelize query and body objects before request
        decamelize: {
            query: true,
            body: true
        }
    },

    // Request/response defaults
    defaults: {
        // Request defaults
        headers: {
            'Content-Type': 'application/json'
        },
        body: (payload) => payload,
        credentials: 'include',

        // Reseponse options
        payload: getJSON,
        error: getJSON
    },

    // Entities
    entities,

    // Entity endpoints (usually CRUD)
    entityEndpoints: {
        getAll: {
            url: '/',
            method: 'GET',
            schema: (entitySchema) => [entitySchema]
        },
        createSingle: {
            url: '/',
            method: 'POST',
            schema: (entitySchema) => entitySchema
        },
        getSingle: {
            url: (payload) => `/${payload.id}`,
            method: 'GET',
            schema: (entitySchema) => entitySchema
        },
        updateSingle: {
            url: (payload) => `/${payload.id}`,
            method: 'PUT',
            schema: (entitySchema) => entitySchema
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
