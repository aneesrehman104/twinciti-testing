import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCookie } from 'cookies-next';

const initialUserInfoString = getCookie('user');

const initialState = {
    isUserLogin: !!getCookie('accessToken'),
    userInfo: initialUserInfoString
        ? JSON.parse(initialUserInfoString)
        : undefined,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.isUserLogin = true;
            state.userInfo = action.payload;
        },
        deleteUser: (state) => {
            state.isUserLogin = false;
            state.userInfo = undefined;
        },
    },
});

export const { loginUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
