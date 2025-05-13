/** @format */

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/redux-store/store";

export interface IThemeState {
    theme: "light" | "dark";
}

const initialTheme = document.documentElement.classList.contains("dark") ? "dark" : "light"

const initialState: IThemeState = {
    theme: initialTheme
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            if (action.payload === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
            } else {
                document.documentElement.classList.add('light');
                document.documentElement.classList.remove('dark');
            }
        },
    },
});

export const themeState = (state: RootState) => state.theme;

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
