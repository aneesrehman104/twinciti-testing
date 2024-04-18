import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    roomList: [],
    roomModels: [],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChatroomList: (state, action) => {
            state.roomList = action?.payload?.length ? action.payload : [];
        },
        setChatroomModelList: (state, action) => {
            state.roomModels = action?.payload?.length ? action.payload : [];
        },
    },
});

export const { setChatroomList, setChatroomModelList } = chatSlice.actions;

export default chatSlice.reducer;
