/** @format */

import { createRoot } from "react-dom/client";
import { PhotoProvider } from "react-photo-view";
import { Provider } from "react-redux";
import { store } from "./redux-store";
import "./index.css";
import { App } from "./App";
import { App as AntdApp } from "antd";
import { NotificationProvider } from "./context";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <PhotoProvider>
                <AntdApp>
                    <NotificationProvider>
                        <App />
                    </NotificationProvider>
                </AntdApp>
            </PhotoProvider>
        </GoogleOAuthProvider>
    </Provider>
);
