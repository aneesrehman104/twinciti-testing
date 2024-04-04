import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";

interface UserInfo {
  createdAt: string;
  email: string;
  password: string;
  stripeCustomerId: string;
  updatedAt: string;
  username: string;
  __v: number;
  _id: string;
  profileImage: any;
}
interface UserState {
  isUserLogin: boolean;
  userInfo?: UserInfo;
}
const initialUserInfoString = getCookie("user");

const initialState: UserState = {
  isUserLogin: !!getCookie("accessToken"),
  userInfo: initialUserInfoString
    ? JSON.parse(initialUserInfoString)
    : undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<UserInfo>) => {
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
