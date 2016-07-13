import util from 'util';

import types from './types';

const initialState = {

};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.INVALID_REQUEST: {
            console.log('invalid', util.inspect(action, true, null));
            break;
        }
        default: {
            console.log('reducer', util.inspect(action, true, null));
            if (action.error) {
                console.log('error', action.payload);
            }
            return state;
        }
    }
};
