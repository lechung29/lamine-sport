/** @format */

import { createSlice } from "@reduxjs/toolkit";
import { IProductInfo } from "@/types";
import { RootState } from "@/redux-store/store";

export interface IFavoriteProductState {
    favoriteProducts: IProductInfo[];
}

const initialState: IFavoriteProductState = {
    favoriteProducts: [],
};

const favoriteProductSlice = createSlice({
    name: "favoriteProduct",
    initialState,
    reducers: {
        replaceFavoriteProducts: (state, action) => {
            const productList: IProductInfo[] = action.payload;
            state.favoriteProducts = productList;
        },
        addFavoriteProduct: (state, action) => {
            const productList: IProductInfo = action.payload;
            state.favoriteProducts = [...state.favoriteProducts, productList];
        },
        removeFavoriteProduct: (state, action) => {
            const productId: string = action.payload;
            state.favoriteProducts = state.favoriteProducts.filter((product) => product._id !== productId);
        },
        resetFavoriteProducts: (state) => {
            state.favoriteProducts = [];
        }
    },
});

export const favoriteProductState = (state: RootState) => state.favoriteProduct;

export const { addFavoriteProduct, removeFavoriteProduct, replaceFavoriteProducts, resetFavoriteProducts } = favoriteProductSlice.actions;
export default favoriteProductSlice.reducer;
