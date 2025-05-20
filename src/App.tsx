/** @format */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout, TitleResolver } from "./layouts";
import { ProtectedRoute } from "./components";
import { Login, SignUp } from "./pages";
import { Home } from "./pages/home";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<TitleResolver />}>
                    <Route element={<MainLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="sign-up" element={<SignUp />} />
                        <Route index element={<Home />} />
                    </Route>
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                        </Route>
                    </Route>
                    <Route path="*" element={<div className="text-[orange]">Page not found</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export { App };
