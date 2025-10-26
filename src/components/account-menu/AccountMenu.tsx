/** @format */

import React from "react";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { BsPersonPlus } from "react-icons/bs";
import { IoHeartOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { Container, Text } from "../elements";
import { Flex } from "antd";
import { clearCart, logout, resetFavoriteProducts, useAppDispatch, useAppSelector, userState } from "@/redux-store";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/context";
import { AuthService } from "@/services";
import { IResponseStatus } from "@/types";

interface IAccountMenuProps {
    onOpenChange: (isOpen: boolean) => void;
}

const AccountMenu: React.FunctionComponent<IAccountMenuProps> = (props) => {
    const { onOpenChange } = props;
    const { user } = useAppSelector(userState);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const notify = useNotification();
    const handleLogout = async () => {
        const result = await AuthService.logoutCustomer();
        if (result.status === IResponseStatus.Success) {
            notify.success(result.message);
        }
        endProcessLogout();
    };

    const endProcessLogout = () => {
        dispatch(resetFavoriteProducts());
        dispatch(clearCart());
        dispatch(logout());
        navigate("/login");
    };

    const getMenuList = () => {
        return !user
            ? [
                  {
                      label: "Đăng nhập",
                      Icon: IoIosLogIn,
                      onClick: () => navigate("/login"),
                  },
                  {
                      label: "Đăng ký",
                      Icon: BsPersonPlus,
                      onClick: () => navigate("/sign-up"),
                  },
                  {
                      label: "Danh sách yêu thích",
                      Icon: IoHeartOutline,
                      onClick: () => navigate("/favorite"),
                  },
              ]
            : user.role === "admin"
            ? [
                  {
                      label: "Quản lý cửa hàng",
                      Icon: LuLayoutDashboard,
                      onClick: () => navigate("/admin"),
                  },
                  {
                      label: "Cá nhân",
                      Icon: VscAccount,
                      onClick: () => navigate("/admin/settings"),
                  },

                  {
                      label: "Đăng xuất",
                      Icon: IoIosLogOut,
                      onClick: handleLogout,
                  },
              ]
            : [
                  {
                      label: "Tài khoản của tôi",
                      Icon: VscAccount,
                      onClick: () => navigate("/user-management"),
                  },
                  {
                      label: "Danh sách yêu thích",
                      Icon: IoHeartOutline,
                      onClick: () => navigate("/favorite"),
                  },
                  {
                      label: "Đăng xuất",
                      Icon: IoIosLogOut,
                      onClick: handleLogout,
                  },
              ];
    };
    return (
        <Container bgColor="white" className="flex flex-col gap-1 w-50 h-auto" padding={[8, 8, 8, 8]}>
            {getMenuList().map((item, index) => (
                <Flex
                    key={index}
                    align="center"
                    justify="flex-start"
                    gap={4}
                    onClick={() => {
                        item.onClick();
                        onOpenChange(false);
                    }}
                    className="w-full !p-2 !py-1.5 cursor-pointer text-[#333] hover:bg-[#1c2635] hover:text-white transition-all duration-300"
                >
                    <item.Icon className="text-xl" />
                    <Text size="sm" titleText={item.label} />
                </Flex>
            ))}
        </Container>
    );
};

export { AccountMenu };
