/** @format */

import React from "react";
import { MenuIcon } from "../menu-icon";
import { LOGO_URL } from "@/constants";
import { LuPhoneCall, LuStore, LuUser } from "react-icons/lu";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";
import { Badge, Popover } from "antd";
import { AccountMenu } from "../account-menu";
import { CartMenu } from "../cart-menu";
import { SearchBox } from "../search-box";

const Header: React.FC = () => {
    return (
        <div className="w-full h-full !px-[45px]">
            <div className="w-full h-full flex items-center justify-between gap-6">
                <div className="h-full flex flex-row items-center gap-6">
                    <MenuIcon />
                    <img src={LOGO_URL} alt="app-logo" className="!h-16 cursor-pointer object-cover" />
                </div>
                <SearchBox device="computer" />
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
                    <Popover placement="bottomRight" content={<AccountMenu />} getPopupContainer={() => document.body} overlayStyle={{ zIndex: 9999 }} trigger="hover">
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
                    <Popover placement="bottomRight" content={<CartMenu />} getPopupContainer={() => document.body} overlayStyle={{ zIndex: 9999 }} trigger="hover">
                        <div className="flex items-center justify-center gap-1.5 cursor-pointer">
                            <Badge count={4} color="#77e322" style={{ color: "black", boxShadow: "none" }}>
                                <MdOutlineShoppingCart className="text-3xl text-white" />
                            </Badge>
                            <span className="text-[12px]">Giỏ hàng</span>
                        </div>
                    </Popover>
                </div>
            </div>
            <SearchBox device="tablet" />
        </div>
    );
};

export { Header };
