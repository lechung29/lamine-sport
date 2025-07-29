/** @format */

import { Breadcrumbs } from "@/components";
import { classNames } from "@/utils";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { GrDeliver } from "react-icons/gr";
import { RiCouponLine } from "react-icons/ri";
import { SlLogout } from "react-icons/sl";

const userManagementRoute = [
    {
        label: "Thông tin cá nhân",
        to: "/user-management",
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
        <section className="w-full">
            <Breadcrumbs />
            <div className="w-full !px-[45px] !pb-5" style={{ height: "calc(100vh - 144px)" }}>
                <div className="h-full flex flex-wrap !mb-10">
                    <div className="w-full h-full md:!pr-4 md:w-1/3 lg:w-1/4">
                        <div className="relative !p-4 h-full flex md:flex-col flex-row gap-2 !bg-[#f8f8f8] !rounded-xl">
                            {userManagementRoute.map((item, key) => (
                                <div
                                    key={key}
                                    role="button"
                                    className={classNames("!py-2 !px-4 flex items-center gap-2 cursor-pointer !rounded-lg hover:!bg-[#01112f] hover:text-white", {
                                        "!bg-[#01112f] text-white": location.pathname === item.to,
                                    })}
                                    onClick={() => navigation(item.to)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                            ))}
                            <div className="absolute bottom-4 !py-2 !px-4 cursor-pointer flex items-center gap-2 font-medium text-[#c30000] hover:text-[#7bb841] group">
                                <span className="transition-transform duration-200 group-hover:-translate-x-1">
                                    <SlLogout />
                                </span>
                                <span>Đăng xuất</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-full md:!pl-4 lg:w-3/4 md:w-2/3">
                        <div className="h-full !p-4 !bg-[#f8f8f8] !rounded-xl">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { UserManagement };
