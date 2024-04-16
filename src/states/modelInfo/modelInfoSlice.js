import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCookie } from 'cookies-next';

const initialUserInfoString = getCookie('modelInfo');
const initialState = {
    modelInfo: initialUserInfoString ? JSON.parse(initialUserInfoString) : [],
};

const modelInfoSlice = createSlice({
    name: 'model',
    initialState,
    reducers: {
        addModel: (state, action) => {
            const isDuplicate = state.modelInfo.some(
                (item) => item._id === action.payload._id,
            );

            if (!isDuplicate) {
                state.modelInfo.push(action.payload);
            }
        },
        removeModel: (state, action) => {
            state.modelInfo = state.modelInfo.filter(
                (item) => item._id !== action.payload._id,
            );
        },
        removeAllModels: (state) => {
            state.modelInfo = [];
        },
        addAllModels: (state, action) => {
            state.modelInfo = action.payload;
        },
    },
});

export const { addModel, removeModel, removeAllModels, addAllModels } =
    modelInfoSlice.actions;

export default modelInfoSlice.reducer;
