/** @format */

import React from "react";
import { Outlet } from "react-router-dom";
import { Redirect } from "../redirect";
import { useAppSelector, userState } from "@/redux-store";
import { NotFound } from "@/pages";

const ProtectedRoute: React.FunctionComponent = () => {
    const { user } = useAppSelector(userState);

    return !user ? (
        <Redirect to="/login" message="Bạn chưa đăng nhập. Chuyển đến trang đăng nhập" />
    ) : user.role === "user" ? (
        <Outlet />
    ) : (
        <NotFound errorMessage="Trang bạn đang chuyển hướng không khả dụng với tài khoản này" />
    );
};

const AdminProtectedRoute: React.FunctionComponent = () => {
    const { user } = useAppSelector(userState);

    return !user ? (
        <Redirect to="/login" message="Bạn chưa đăng nhập. Chuyển đến trang đăng nhập" />
    ) : user.role === "admin" ? (
        <Outlet />
    ) : (
        <NotFound errorMessage="Trang bạn đang chuyển hướng không khả dụng với tài khoản này" />
    );
};

export { ProtectedRoute, AdminProtectedRoute };
