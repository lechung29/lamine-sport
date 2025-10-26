/** @format */

import { createSlice } from "@reduxjs/toolkit";
import { IProductInfo } from "@/types";
import { RootState } from "@/redux-store/store";

export interface ICartItem extends IProductInfo {
    selectedProductColorValue: number;
    selectedProductSize: string;
    selectedProductCount: number;
}

export interface ICartState {
    cartList: ICartItem[];
}

const initialState: ICartState = {
    cartList: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem: ICartItem = action.payload;
            if (!state.cartList.some((item) => item._id === newItem._id && item.selectedProductColorValue === newItem.selectedProductColorValue)) {
                state.cartList.push(newItem);
            } else {
                const existingItem = state.cartList.find((item) => item._id === newItem._id && item.selectedProductColorValue === newItem.selectedProductColorValue);
                if (existingItem) {
                    existingItem.selectedProductCount += newItem.selectedProductCount;
                }
            }
        },
        removeFromCart: (state, action) => {
            const deleteItem = action.payload;
            state.cartList = state.cartList.filter((item) => item._id !== deleteItem._id || item.selectedProductColorValue !== deleteItem.selectedProductColorValue);
        },
        clearCart: (state) => {
            state.cartList = [];
        },
        changeCartItemCountByInput: (state, action) => {
            const { productId, selectedProductColorValue, count } = action.payload;
            const existingItem = state.cartList.find((item) => item._id === productId && item.selectedProductColorValue === selectedProductColorValue);
            if (existingItem) {
                existingItem.selectedProductCount = count;
            }
        },
        increaseCartItemCount: (state, action) => {
            const { productId, selectedProductColorValue, count } = action.payload;
            const existingItem = state.cartList.find((item) => item._id === productId && item.selectedProductColorValue === selectedProductColorValue);
            if (existingItem) {
                existingItem.selectedProductCount = existingItem.selectedProductCount + count;
            }
        },
        reduceCartItemCount: (state, action) => {
            const { productId, selectedProductColorValue, count } = action.payload;
            const existingItem = state.cartList.find((item) => item._id === productId && item.selectedProductColorValue === selectedProductColorValue);
            if (existingItem) {
                existingItem.selectedProductCount = existingItem.selectedProductCount - count;
            }
        },
    },
});

export const cartState = (state: RootState) => state.cart;

export const { addToCart, removeFromCart, changeCartItemCountByInput, increaseCartItemCount, reduceCartItemCount, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
