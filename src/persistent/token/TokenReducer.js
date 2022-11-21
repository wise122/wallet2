import {createSlice} from '@reduxjs/toolkit';

const TokenReducer = createSlice({
    name: 'token',
    initialState: {
        tokens: [],
    },
    reducers: {
        getTokensSuccess(state, {payload}) {
            state.tokens = payload;
        },
        addCustomTokenSuccess(state, {payload}) {
            state.tokens = [payload,...state.tokens];
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = TokenReducer;
// Extract and export each action creator by name
export const {getTokensSuccess,addCustomTokenSuccess} = actions;
// Export the reducer, either as a default or named export
export default reducer;
