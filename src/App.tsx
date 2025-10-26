/** @format */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminLayout, MainLayout, TitleResolver } from "./layouts";
import { AdminProtectedRoute, ProtectedRoute } from "./components";
import {
    Login,
    SignUp,
    Home,
    Product,
    Cart,
    Payment,
    UserManagement,
    UserInformation,
    ProductDetails,
    ReviewManagement,
    DiscountEvent,
    CustomerManagement,
    SettingsPage,
    ProductManagement,
    CreateProduct,
    OrderManagement,
    OrderDetail,
    CouponManagement,
    Dashboard,
    UserCoupon,
    UserOrders,
    AllStore,
    RecoveryPassword,
    NotFound,
    About,
    Contact,
    PurchasingPolicy,
    PaymentPolicy,
    ShippingPolicy,
    PrivacyPolicy,
    ShopCommitment,
    MembershipPolicy,
    Favorite,
    Search,
    TemplateManagement,
} from "./pages";
import { ScrollToTop } from "./components/scroll-to-top";
import { InstallmentInstruction, PurchaseInstruction, RefundInstruction, ReturnInstruction, TransferInstruct } from "./pages/instruction";
import { useAppDispatch, useAppSelector, userState } from "./redux-store";
import React from "react";
import { handleVisiblePasswordDialog } from "./redux-store/reducers/auth";
function App() {
    const { user } = useAppSelector(userState);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        if (user && user.isFirstLogin) {
            dispatch(handleVisiblePasswordDialog(true));
        }
    }, [user]);
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route path="/*" element={<TitleResolver />}>
                    <Route element={<MainLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="sign-up" element={<SignUp />} />
                        <Route index element={<Home />} />
                        <Route path="products" element={<Product />} />
                        <Route path="product/:id" element={<ProductDetails />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="all-our-store" element={<AllStore />} />
                        <Route path="search" element={<Search />} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="payment" element={<Payment />} />
                        <Route path="policy" element={<PurchasingPolicy />} />
                        <Route path="policy/purchasing" element={<PurchasingPolicy />} />
                        <Route path="policy/payment" element={<PaymentPolicy />} />
                        <Route path="favorite" element={<Favorite />} />
                        <Route path="policy/shipping" element={<ShippingPolicy />} />
                        <Route path="policy/privacy" element={<PrivacyPolicy />} />
                        <Route path="policy/commitment" element={<ShopCommitment />} />
                        <Route path="policy/membership" element={<MembershipPolicy />} />
                        <Route path="instruction" element={<PurchaseInstruction />} />
                        <Route path="instruction/purchasing" element={<PurchaseInstruction />} />
                        <Route path="instruction/return" element={<ReturnInstruction />} />
                        <Route path="instruction/refund" element={<RefundInstruction />} />
                        <Route path="instruction/transfer" element={<TransferInstruct />} />
                        <Route path="instruction/installment" element={<InstallmentInstruction />} />
                    </Route>
                    <Route path="recovery-password" element={<RecoveryPassword />} />
                    <Route element={<AdminProtectedRoute />}>
                        <Route path="admin/*" element={<AdminLayout />}>
                            <Route path="products" element={<ProductManagement />} />
                            <Route path="products/product-details" element={<CreateProduct />} />
                            <Route path="orders" element={<OrderManagement />} />
                            <Route path="orders/:id" element={<OrderDetail />} />
                            <Route path="coupons" element={<CouponManagement />} />
                            <Route path="customer-reviews" element={<ReviewManagement />} />
                            <Route path="discount-event" element={<DiscountEvent />} />
                            <Route path="customer-management" element={<CustomerManagement />} />
                            <Route path="templates" element={<TemplateManagement />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route index element={<Dashboard />} />
                        </Route>
                    </Route>
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="user-management/*" element={<UserManagement />}>
                                <Route index element={<UserInformation />} />
                                <Route path="my-information" element={<UserInformation />} />
                                <Route path="my-coupons" element={<UserCoupon />} />
                                <Route path="my-orders" element={<UserOrders />} />
                            </Route>
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export { App };
