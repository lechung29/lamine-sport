/** @format */

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

export interface IAuthState {
    isOpenDialog: boolean;
    errorMessage: string;
    isOpenCreatePasswordDialog: boolean;
}

const initialState: IAuthState = {
    isOpenDialog: false,
    errorMessage: "",
    isOpenCreatePasswordDialog: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        handleUnauthorized: (state, action) => {
            state.isOpenDialog = true;
            state.errorMessage = action.payload;
        },
        handleNavigate: (state) => {
            state.isOpenDialog = false;
            state.errorMessage = "";
        },
        handleVisiblePasswordDialog: (state, action) => {
            state.isOpenCreatePasswordDialog = action.payload;
        },
    },
});

export const authState = (state: RootState) => state.auth;
export const { handleNavigate, handleUnauthorized, handleVisiblePasswordDialog } = authSlice.actions;
export default authSlice.reducer;
