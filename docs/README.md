# Documentation
*Work in progress*

## Basic usage
```javascript
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {createApi, createApiMiddleware, createApiActions, createApiActionTypes} from 'rdx-api';

// Create an API
const api = createApi({
    name: 'EXAMPLE_API',
    url: 'https://example.com/api/v1',
    options: {
        // Strip trailing slash from URL
        stripTrailingSlash: true,

        // How should body objects be parsed (json or urlencoded), however this does not set the content type header
        bodyType: 'json',

        // Camelize response data after request (e.g. profile_image (server) --> profileImage (our client))
        camelize: {
            response: true
        },

        // Decamelize query and body objects before request (e.g. profileImage (our client) --> profile_image (server))
        decamelize: {
            query: true,
            body: true
        }
    },

    // Default Fetch API arguments
    defaults: {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    },

    entities: {
        users: {
            name: 'user',
            urlPrefix: '/users',
            urlPostfix: ''
        }
    },

    // Entity endpoints (usually CRUD)
    entityEndpoints: {
        getAll: {
            url: '/',
            method: 'GET'
        },
        createSingle: {
            url: '/',
            method: 'POST',
            body: (payload) => payload,
        },
        getSingle: {
            url: (payload) => `/${payload.id}`,
            method: 'GET'
        },
        updateSingle: {
            url: (payload) => `/${payload.id}`,
            method: 'PUT',
            body: (payload) => payload
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
    endpointDefaults: {
        body: (payload) => payload
    }
});

// Generate Redux actions
const actions = createApiActions(api);
const {
    entities: {
        users
    },
    endpoints,
    resetEndpoint
} = actions;

// Generate Redux action types
const types = createApiActionTypes(api);

// Create Redux reducers
const initialUserState = {
    loading: {},
    idMap: {}
};
const userReducer = (state = initialUserState, action) => {
    switch (action.type) {
        case types.all.USERS_GET_SINGLE_REQUEST:
            console.log('request', action);
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.requestPayload.id]: true
                }
            };
        case types.all.USERS_GET_SINGLE_SUCCESS:
            console.log('success', action);
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.requestPayload.id]: false
                },
                idMap: {
                    ...state.idMap,
                    [action.payload.data.id]: action.payload.data
                }
            };
        case types.all.USERS_GET_SINGLE_FAILURE:
            console.log('failure', action);
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.requestPayload.id]: false
                }
            };
    }
    return state;
};

// Initialize Redux store with API middleware
const middleware = createApiMiddleware(api);
const store = createStore(combineReducers({
    users: userReducer
}), applyMiddleware(middleware));

// Waiting for the dispatch to complete using async/await is optional, but useful in this example
(async () => {
    console.log('Initial state:', store.getState());

    // Dispatch an action
    const result = await store.dispatch(users.getSingle({id: '1'}));

    // Print the request result and new Redux store state
    console.log('Final state:', store.getState(), 'Result:', result);
})();
```
