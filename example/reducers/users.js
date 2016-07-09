import types from '../types';

const initialState = {

};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.USER_GET_SUCCESS: {
            return state;
        }
        default: {
            return state;
        }
    }
};
