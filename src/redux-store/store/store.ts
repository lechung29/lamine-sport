/** @format */

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { createLogger } from "redux-logger";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";
import { useDispatch, useSelector } from "react-redux";
import UserSlice from "../reducers/users/userSlice";
import ThemeSlice from "../reducers/themes/themeSlice";
import BreadcrumbSlice from "../reducers/breadcrumb/breadCrumbSlice";

const persistConfig: any = {
    key: "root",
    storage: storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ["user"],
};

const rootReducer = combineReducers({
    user: UserSlice,
    theme: ThemeSlice,
    breadcrumb: BreadcrumbSlice
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
