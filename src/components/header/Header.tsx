/** @format */

import React from "react";
import { MenuIcon } from "../menu-icon";
import { LOGO_URL } from "@/constants";
import { IoMdSearch } from "react-icons/io";
import { LuPhoneCall, LuStore, LuUser } from "react-icons/lu";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";
import { Badge, Popover } from "antd";
import { AccountMenu } from "../account-menu";
import { CartMenu } from "../cart-menu";

const Header: React.FC = () => {
    return (
        <div className="w-full h-full !px-[45px]">
            <div className="w-full h-full flex items-center justify-between gap-6">
                <div className="h-full flex flex-row items-center gap-6">
                    <MenuIcon />
                    <img src={LOGO_URL} alt="app-logo" className="!h-16 cursor-pointer object-cover" />
                </div>
                <div className="relative group max-[950px]:hidden flex flex-1 h-10 overflow-visible">
                    <input type="text" placeholder="Tìm sản phẩm..." className="flex-1 !px-3 text-sm !text-black outline-none border-none !bg-white" />
                    <div className="relative w-10 overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gray-200 group-hover:bg-[#77e322] transition-all duration-300 
                            before:absolute before:top-0 before:left-0 before:h-full before:w-full 
                            before:bg-[#77e322] before:transform before:scale-x-0 group-hover:before:scale-x-100 
                            before:origin-left before:transition-transform before:duration-300"
                        />
                        <div className="relative z-10 h-full flex items-center justify-center text-xl cursor-pointer">
                            <IoMdSearch className="text-gray-800 group-hover:text-white" />
                        </div>
                    </div>

                    <div className="absolute top-full left-0 w-full h-[50px] bg-white shadow-primary z-50 hidden group-focus-within:block">Hello</div>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <Link className="max-[1200px]:hidden flex items-center justify-center gap-1.5" to="tel:19001900">
                        <LuPhoneCall className="text-3xl text-white" />
                        <div className="flex flex-col items-start">
                            <span className="text-[12px]">Hotline hỗ trợ:</span>
                            <span className="text-lg leading-5 !font-medium text-[#77e322]">1900 1900</span>
                        </div>
                    </Link>
                    <Link className="flex items-center justify-center gap-1.5" to="/store">
                        <LuStore className="text-3xl text-white" />
                        <div className="flex flex-col items-start">
                            <span className="text-[12px]">Hệ thống cửa hàng</span>
                            <span className="text-sm leading-4 !font-medium">7 cửa hàng</span>
                        </div>
                    </Link>
                    <Popover placement="bottomRight" content={<AccountMenu />} trigger="hover">
                        <div className="flex items-center justify-center gap-1.5 cursor-pointer">
                            <LuUser className="text-3xl text-white" />
                            <div className="flex flex-col items-start">
                                <span className="text-[12px]">Thông tin</span>
                                <span className="flex items-center gap-0.5 text-sm leading-4 !font-medium">
                                    Tài khoản <IoMdArrowDropdown className="text-white" />
                                </span>
                            </div>
                        </div>
                    </Popover>
                    <Popover placement="bottomRight" content={<CartMenu />} trigger="hover">
                        <div className="flex items-center justify-center gap-1.5 cursor-pointer">
                            <Badge count={4} color="#77e322" style={{ color: "black", boxShadow: "none" }}>
                                <MdOutlineShoppingCart className="text-3xl text-white" />
                            </Badge>
                            <span className="text-[12px]">Giỏ hàng</span>
                        </div>
                    </Popover>
                </div>
            </div>
            <div className="relative group max-[950px]:flex hidden h-10 !mt-2 !mb-1 overflow-visible">
                <input type="text" placeholder="Tìm sản phẩm..." className="flex-1 !px-3 text-sm !text-black outline-none border-none !bg-white" />
                <div className="relative w-10 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gray-200 group-hover:bg-[#77e322] transition-all duration-300 
                            before:absolute before:top-0 before:left-0 before:h-full before:w-full 
                            before:bg-[#77e322] before:transform before:scale-x-0 group-hover:before:scale-x-100 
                            before:origin-left before:transition-transform before:duration-300"
                    />
                    <div className="relative z-10 h-full flex items-center justify-center text-xl cursor-pointer">
                        <IoMdSearch className="text-gray-800 group-hover:text-white" />
                    </div>
                </div>

                <div className="absolute top-full left-0 w-full h-[50px] bg-white shadow-primary z-50 hidden group-focus-within:block">Hello</div>
            </div>
        </div>
    );
};

export { Header };
