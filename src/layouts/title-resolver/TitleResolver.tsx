/** @format */

import { addBreadcrumb, resetBreadcrumb, useAppDispatch } from "@/redux-store";
import React, { PropsWithChildren, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export const TitleResolver = (props: PropsWithChildren) => {
    const { children } = props;
    const dispatch = useAppDispatch();
    const location = useLocation();
    const prefix = "Lamine Sport";

    const currentPath = (pathName: string) => {
        return location.pathname.includes(pathName);
    };

    useEffect(() => {
        let title = "";

        // Main routes
        if (location.pathname === "/") {
            title = "Trang chủ";
        } else if (location.pathname === "/login") {
            title = "Đăng nhập";
        } else if (location.pathname === "/sign-up") {
            title = "Đăng ký";
        } else if (location.pathname === "/products") {
            title = "Tất cả sản phẩm";
        } else if (currentPath("/product/")) {
            title = "Chi tiết sản phẩm";
        } else if (location.pathname === "/cart") {
            title = "Giỏ hàng";
        } else if (location.pathname === "/payment") {
            title = "Thanh toán";
        } else if (location.pathname === "/all-our-store") {
            title = "Tất cả cửa hàng";
        } else if (location.pathname === "/search") {
            title = "Tìm kiếm";
        } else if (location.pathname === "/about") {
            title = "Về chúng tôi";
        } else if (location.pathname === "/contact") {
            title = "Liên hệ";
        } else if (location.pathname === "/favorite") {
            title = "Sản phẩm yêu thích";
        } else if (location.pathname === "/recovery-password") {
            title = "Khôi phục mật khẩu";
        }
        // Policy routes
        else if (location.pathname === "/policy" || location.pathname === "/policy/purchasing") {
            title = "Chính sách mua hàng";
        } else if (location.pathname === "/policy/payment") {
            title = "Chính sách thanh toán";
        } else if (location.pathname === "/policy/shipping") {
            title = "Chính sách vận chuyển";
        } else if (location.pathname === "/policy/privacy") {
            title = "Chính sách bảo mật";
        } else if (location.pathname === "/policy/commitment") {
            title = "Cam kết của shop";
        } else if (location.pathname === "/policy/membership") {
            title = "Chính sách thành viên";
        }
        // Instruction routes
        else if (location.pathname === "/instruction" || location.pathname === "/instruction/purchasing") {
            title = "Hướng dẫn mua hàng";
        } else if (location.pathname === "/instruction/return") {
            title = "Hướng dẫn đổi trả";
        } else if (location.pathname === "/instruction/refund") {
            title = "Hướng dẫn hoàn hàng";
        } else if (location.pathname === "/instruction/transfer") {
            title = "Hướng dẫn chuyển khoản";
        } else if (location.pathname === "/instruction/installment") {
            title = "Hướng dẫn trả góp";
        }
        // User management routes
        else if (location.pathname === "/user-management" || location.pathname === "/user-management/my-information") {
            title = "Thông tin cá nhân";
        } else if (location.pathname === "/user-management/my-coupons") {
            title = "Mã giảm giá của tôi";
        } else if (location.pathname === "/user-management/my-orders") {
            title = "Đơn hàng của tôi";
        }
        // Admin routes
        else if (currentPath("/admin/products") && !currentPath("/admin/products/product-details")) {
            title = "Quản lý sản phẩm";
        } else if (currentPath("/admin/products/product-details")) {
            title = "Tạo sản phẩm";
        } else if (currentPath("/admin/orders") && !currentPath("/admin/orders/")) {
            title = "Quản lý đơn hàng";
        } else if (currentPath("/admin/orders/")) {
            title = "Chi tiết đơn hàng";
        } else if (currentPath("/admin/coupons")) {
            title = "Quản lý mã giảm giá";
        } else if (currentPath("/admin/customer-reviews")) {
            title = "Quản lý đánh giá";
        } else if (currentPath("/admin/discount-event")) {
            title = "Sự kiện giảm giá";
        } else if (currentPath("/admin/customer-management")) {
            title = "Quản lý khách hàng";
        } else if (currentPath("/admin/templates")) {
            title = "Quản lý mẫu";
        } else if (currentPath("/admin/settings")) {
            title = "Cài đặt";
        } else if (currentPath("/admin/dashboard") || location.pathname === "/admin" || location.pathname === "/admin/") {
            title = "Tổng quan";
        }
        else {
            title = "Trang không tồn tại";
        }

        dispatch(resetBreadcrumb());
        dispatch(
            addBreadcrumb([
                {
                    title,
                    href: location.pathname,
                },
            ])
        );

        document.title = title ? `${prefix} | ${title}` : prefix;
    }, [location.pathname, dispatch]);

    return <React.Fragment>{children ? children : <Outlet />}</React.Fragment>;
};
