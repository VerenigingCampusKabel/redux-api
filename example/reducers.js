import util from 'util';

const initialState = {

};

export default (state = initialState, action) => {
    switch (action.type) {
        default: {
            console.log('reducer', util.inspect(action, true, null));
            if (action.isError) {
                console.error('error', action.error);
            }
            return state;
        }
    }
};
