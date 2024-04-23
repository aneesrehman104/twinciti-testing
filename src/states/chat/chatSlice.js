import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    roomList: [],
    roomModels: [],
    showNewModal: false,
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
        setAddNewModel: (state, action) => {
            state.showNewModal = Boolean(action?.payload);
        },
    },
});

export const { setChatroomList, setChatroomModelList, setAddNewModel } =
    chatSlice.actions;

export default chatSlice.reducer;
