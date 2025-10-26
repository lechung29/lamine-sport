/** @format */

import { clearCart, logout, resetFavoriteProducts, useAppDispatch, useAppSelector } from "@/redux-store";
import { authState, handleNavigate } from "@/redux-store/reducers/auth";
import { delayTime } from "@/utils";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "../dialog";
import { Text } from "../elements";

const ExpiredDialog: React.FunctionComponent = () => {
    const { errorMessage, isOpenDialog } = useAppSelector(authState);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async (): Promise<void> => {
        dispatch(logout());
        dispatch(resetFavoriteProducts());
        dispatch(clearCart());
        dispatch(handleNavigate());
        await delayTime(500).then(() => navigate("/login"));
    };

    const handleClose = async () => {
        dispatch(handleNavigate());
        await delayTime(500).then(() => navigate("/"));
    };
    return (
        <Dialog title="Thông báo quyền truy cập" isOpen={isOpenDialog} onClose={handleClose} onConfirm={handleLogout} confirmText="Xác nhận" confirmButtonStyle="primary">
            <Text as="span" size="base" titleText={errorMessage} />
        </Dialog>
    );
};

export { ExpiredDialog };
