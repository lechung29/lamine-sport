/** @format */

import { Box, Breadcrumbs, Container, Text } from "@/components";
import { classNames } from "@/utils";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { GrDeliver } from "react-icons/gr";
import { RiCouponLine } from "react-icons/ri";
import { Flex } from "antd";

const userManagementRoute = [
    {
        label: "Thông tin cá nhân",
        to: "/user-management/my-information",
        subTo: "/user-management",
        icon: <FaRegUser />,
    },
    {
        label: "Đơn hàng",
        to: "/user-management/my-orders",
        icon: <GrDeliver />,
    },
    {
        label: "Mã giảm giá",
        to: "/user-management/my-coupons",
        icon: <RiCouponLine />,
    },
];

const UserManagement: React.FunctionComponent = () => {
    const navigation = useNavigate();
    const location = useLocation();

    return (
        <Container className="w-full">
            <Breadcrumbs />
            <Box className="w-full !px-4 sm:!px-8 lg:!px-[45px] !pb-5">
                <Flex className="flex-wrap md:flex-nowrap !mb-10 gap-4 md:gap-0">
                    <Box className="w-full md:!pr-4 md:w-1/3 xl:w-1/5">
                        <Box className="w-full h-full !p-2 !py-3 flex flex-row overflow-x-auto whitespace-nowrap md:flex-col md:justify-start gap-2 !bg-[#f8f8f8] !rounded-xl">
                            {userManagementRoute.map((item, key) => (
                                <Flex
                                    key={key}
                                    align="center"
                                    gap={8}
                                    className={classNames(
                                        "!py-2 !px-4 gap-2 cursor-pointer !rounded-lg hover:!bg-[#01112f] hover:text-white transition-colors duration-200 text-center",
                                        {
                                            "!bg-[#01112f] text-white": location.pathname === item.to || location.pathname === item.subTo,
                                        }
                                    )}
                                    onClick={() => navigation(item.to)}
                                >
                                    {item.icon}
                                    <Text as="span" titleText={item.label}/>
                                </Flex>
                            ))}
                        </Box>
                    </Box>
                    <Box className="w-full md:!pl-4 xl:w-4/5 md:w-2/3">
                        <Box padding={[16, 16, 16, 16]} bgColor="#f8f8f8" className="h-full !rounded-xl">
                            <Outlet />
                        </Box>
                    </Box>
                </Flex>
            </Box>
        </Container>
    );
};

export { UserManagement };
