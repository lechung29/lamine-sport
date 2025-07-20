/** @format */

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/redux-store/store";

export interface IBreadcrumbItem {
    title: string;
    href?: string;
}

export interface IBreadcrumbState {
    breadcrumbList: IBreadcrumbItem[];
}

const initialState: IBreadcrumbState = {
    breadcrumbList: [
        {
            title: "Trang chủ",
            href: "/",
        },
    ],
};

const breadcrumbSlice = createSlice({
    name: "breadcrumb",
    initialState,
    reducers: {
        addBreadcrumb: (state, action) => {
            const newItems: IBreadcrumbItem[] = action.payload;
            newItems.forEach((item) => {
                if (state.breadcrumbList.length === 0 || state.breadcrumbList[state.breadcrumbList.length - 1].title !== item.title) {
                    state.breadcrumbList.push(item);
                }
            });
        },
        removeBreadcrumb: (state) => {
            if (state.breadcrumbList.length > 1) {
                state.breadcrumbList.pop();
            }
        },
    },
});

export const breadcrumbState = (state: RootState) => state.breadcrumb;

export const { addBreadcrumb, removeBreadcrumb } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;
