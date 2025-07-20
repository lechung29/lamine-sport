/** @format */

import { createRoot } from "react-dom/client";
import { PhotoProvider } from "react-photo-view";
import { Provider } from "react-redux";
import { store } from "./redux-store";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <PhotoProvider>
            <App />
        </PhotoProvider>
    </Provider>
);
