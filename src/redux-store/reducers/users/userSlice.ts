/** @format */

import { createSlice } from "@reduxjs/toolkit";
import { IUserInformation } from "@/types";
import { RootState } from "@/redux-store/store";

export interface IAuthenticationState {
    user: IUserInformation | null;
}

const initialState: IAuthenticationState = {
    user: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            window.localStorage.setItem("accessToken", action.payload.accessToken);
        },
        logout: (state) => {
            state.user = null;
            window.localStorage.removeItem("accessToken");
            window.location.href = "/login";
        },
        updateUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const userState = (state: RootState) => state.user;

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
