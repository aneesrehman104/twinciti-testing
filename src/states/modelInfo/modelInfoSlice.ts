import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";

interface ModelInfo {
  createdAt: string;
  email: string;
  password: string;
  stripeCustomerId: string;
  updatedAt: string;
  username: string;
  __v: number;
  _id: string;
}
interface ModelState {
  modelInfo?: any;
}
const initialUserInfoString = getCookie("modelInfo");
const initialState: ModelState = {
  modelInfo: initialUserInfoString ? JSON.parse(initialUserInfoString) : [],
};

const modelInfoSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    addModel: (state, action: PayloadAction<ModelInfo>) => {
      const isDuplicate = state.modelInfo.some(
        (item: any) => item._id === action.payload._id,
      );

      if (!isDuplicate) {
        state.modelInfo.push(action.payload);
      }
    },
    removeModel: (state, action: PayloadAction<ModelInfo>) => {
      state.modelInfo = state.modelInfo.filter(
        (item: any) => item._id !== action.payload._id,
      );
    },
    removeAllModels: (state) => {
      state.modelInfo = [];
    },
    addAllModels: (state, action: PayloadAction<ModelInfo[]>) => {
      state.modelInfo = action.payload;
    },
  },
});
export const { addModel, removeModel, removeAllModels, addAllModels } =
  modelInfoSlice.actions;

export default modelInfoSlice.reducer;
