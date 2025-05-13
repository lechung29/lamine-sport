import React from "react";
import { Outlet } from "react-router-dom";
import { Redirect } from "../redirect";
import { useAppSelector, userState } from "@/redux-store";

const ProtectedRoute: React.FunctionComponent = () => {
	const { user } = useAppSelector(userState)
	return user ? <Outlet /> : <Redirect to="/login" message={"Bạn chưa đăng nhập. Chuyển đến trang đăng nhập"} />;
};

export {
	ProtectedRoute
}