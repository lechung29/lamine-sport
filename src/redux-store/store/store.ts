/** @format */

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { createLogger } from "redux-logger";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";
import { useDispatch, useSelector } from "react-redux";
import userSlice from "../reducers/users/user";
import BreadcrumbSlice from "../reducers/breadcrumb/breadCrumbSlice";
import FavoriteProductSlice from "../reducers/favorite-products/favoriteProduct";
import CartSlice from "../reducers/cart/cart";
import AuthSlice from "../reducers/auth/authSlice";

const persistConfig: any = {
    key: "root",
    storage: storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ["user", "favoriteProduct", "cart"],
};

const rootReducer = combineReducers({
    user: userSlice,
    breadcrumb: BreadcrumbSlice,
    favoriteProduct: FavoriteProductSlice,
    cart: CartSlice,
    auth: AuthSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const logger = createLogger();

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(logger),
});

export const persister = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
