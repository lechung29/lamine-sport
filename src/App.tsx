/** @format */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout, TitleResolver } from "./layouts";
import { ProtectedRoute } from "./components";
import { Login, SignUp, Home, Product, ProductDetails, Cart, Payment, UserManagement } from "./pages";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<TitleResolver />}>
                    <Route element={<MainLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="sign-up" element={<SignUp />} />
                        <Route path="product" element={<Product />} />
                        <Route path="product/:id" element={<ProductDetails />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="user-management/*" element={<UserManagement />}>
                            <Route index element={<>Hi</>} />
                        </Route>
                        <Route index element={<Home />} />
                    </Route>
                    <Route path="payment" element={<Payment />}/>
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
