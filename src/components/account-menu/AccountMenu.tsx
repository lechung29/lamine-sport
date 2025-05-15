/** @format */

import React from "react";
import { IoIosLogIn } from "react-icons/io";
import { BsPersonPlus } from "react-icons/bs";
import { IoHeartOutline } from "react-icons/io5";

const AccountMenu: React.FC = () => {
    return (
        <div className="!p-3 !bg-white flex flex-col gap-1 w-50 h-auto">
            <div className="w-full !p-2 !py-1.5 flex items-center justify-start gap-1 cursor-pointer text-[#333] hover:bg-[#1c2635] hover:text-white transition-all duration-300">
                <IoIosLogIn className="text-xl" />
                <span className="text-sm">Đăng nhập</span>
            </div>
            <div className="w-full !p-2 !py-1.5 flex items-center justify-start gap-1 cursor-pointer text-[#333] hover:bg-[#1c2635] hover:text-white transition-all duration-300">
                <BsPersonPlus className="text-xl" />
                <span className="text-sm">Đăng ký</span>
            </div>
            <div className="w-full !p-2 !py-1.5 flex items-center justify-start gap-1 cursor-pointer text-[#333] hover:bg-[#1c2635] hover:text-white transition-all duration-300">
                <IoHeartOutline className="text-xl" />
                <span className="text-sm">Danh sách yêu thích</span>
            </div>
        </div>
    );
};

export { AccountMenu };
