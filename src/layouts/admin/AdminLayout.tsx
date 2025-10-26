/** @format */

import React from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { Flex } from "antd";
import { SUB_LOGO_URL } from "@/constants";
import { BaseButton, Box, Container, ExpiredDialog, Image, Text } from "@/components";
import { adminSidebarMenu, classNames } from "@/utils";
import { clearCart, logout, resetFavoriteProducts, useAppDispatch } from "@/redux-store";
import { useNotification } from "@/context";
import { AuthService } from "@/services";
import { IResponseStatus } from "@/types";

const Navbar: React.FunctionComponent<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const notify = useNotification();

    const endProcessLogout = (): void => {
        dispatch(resetFavoriteProducts());
        dispatch(clearCart());
        dispatch(logout());
        navigate("/login");
    };

    const handleLogout = async () => {
        const result = await AuthService.logoutCustomer();
        if (result.status === IResponseStatus.Success) {
            notify.success(result.message);
        }
        endProcessLogout();
    };

    return (
        <Flex align="center" justify="space-between" className="w-full">
            <Flex align="center">
                <Box className="block md:hidden" margin={[0, 8, 0, 0]}>
                    <BaseButton
                        colors={{
                            normal: {
                                textColor: "#334153",
                                bgColor: "transparent",
                            },
                            hover: {
                                textColor: "black",
                                bgColor: "transparent",
                            },
                        }}
                        padding={[8, 8, 8, 8]}
                        displayText={
                            <svg className="!h-6 !w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        }
                        onClick={toggleSidebar}
                    />
                </Box>
                <Box className="!flex-shrink-0">
                    <Image clickable height="48px" src={SUB_LOGO_URL} alt="app-logo" className="object-cover" onClick={() => navigate("/")} />
                </Box>
            </Flex>

            <Flex align="center" className="!space-x-4">
                <Text as="span" size="sm" color="#364153" fontWeight="semibold" className="!bg-gray-200 !hover:bg-gray-300 !rounded-md cursor-pointer" titleText="Admin" padding={[8, 12, 8, 12]} />
                <BaseButton
                    className="relative overflow-hidden logout-button-underline transition-colors duration-300"
                    displayText="Đăng xuất"
                    textProps={{
                        size: "sm",
                        fontWeight: 500,
                        textTransform: "normal-case",
                    }}
                    colors={{
                        normal: {
                            textColor: "#101828",
                            bgColor: "transparent",
                        },
                        hover: {
                            textColor: "#fb2c36",
                            bgColor: "transparent",
                        },
                    }}
                    padding={[8, 8, 8, 8]}
                    onClick={handleLogout}
                />
            </Flex>
        </Flex>
    );
};

const Sidebar: React.FunctionComponent<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
    return (
        <Box padding={[16, 16, 16, 16]} className="relative">
            <BaseButton
                className="block md:!hidden absolute top-2 right-2"
                padding={[8, 8, 8, 8]}
                colors={{
                    normal: {
                        textColor: "#334153",
                        bgColor: "transparent",
                    },
                    hover: {
                        textColor: "black",
                        bgColor: "transparent",
                    },
                }}
                onClick={toggleSidebar}
                displayText={
                    <svg className="!h-6 !w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                }
            />
            <Box className="!space-y-2 md:!mt-0" margin={[32, 0, 0, 0]}>
                {adminSidebarMenu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center !p-2 !rounded-md cursor-pointer ${isActive ? "!bg-gray-700 !text-white" : "!text-gray-900 hover:!bg-gray-700 hover:!text-white"}`
                        }
                        onClick={toggleSidebar}
                    >
                        <Text as="span" titleText={item.icon} margin={[0, 8, 0, 0]} />
                        <Text as="span" size="sm" fontWeight="medium" titleText={item.label} margin={[0, 8, 0, 0]} />
                    </NavLink>
                ))}
            </Box>
        </Box>
    );
};

const AdminLayout: React.FunctionComponent = () => {
    const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(false);

    const toggleSidebar = (): void => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <Flex vertical className="h-screen bg-[#e7e7e3]">
            <Flex align="center" justify="space-between" className="w-full h-16 flex-shrink-0 !px-4 md:!px-6 bg-white shadow-md z-10">
                <Navbar toggleSidebar={toggleSidebar} />
            </Flex>

            <Flex className="flex-1 !overflow-hidden">
                <Container
                    bgColor="white"
                    className={classNames(
                        "h-screen !w-64 fixed top-0 left-0 overflow-y-auto transition-transform duration-300 z-50 md:h-auto md:!w-64 md:flex-shrink-0 md:block md:static md:translate-x-0 md:z-auto ",
                        {
                            "translate-x-0": sidebarVisible,
                        },
                        {
                            "-translate-x-full": !sidebarVisible,
                        }
                    )}
                >
                    <Sidebar toggleSidebar={toggleSidebar} />
                </Container>

                {sidebarVisible && <Box className="!block md:!hidden !fixed !inset-0 !z-40" onClick={toggleSidebar} />}

                <Container bgColor="transparent" padding={[24, 24, 24, 24]} className="flex-1 relative overflow-y-auto md:!p-8">
                    <Outlet />
                </Container>
            </Flex>
            <ExpiredDialog />
        </Flex>
    );
};

export { AdminLayout, Sidebar, Navbar };
