/** @format */

import React from "react";
import { Input } from "antd";
import { IoKeyOutline } from "react-icons/io5";

const UserInformation: React.FunctionComponent = () => {
    return (
        <section className="h-full relative text-[#333]">
            <div className="!mb-4 font-semibold text-3xl text-center">Thông tin cá nhân</div>
            <div className="!mb-4">
                <div className="!mb-1">
                    <span className="font-semibold !pr-1">Họ và tên khách hàng</span>
                    <span className="text-[#c10000]">*</span>
                </div>
                <div className="flex items-center justify-start gap-4">
                    <Input className="max-w-75" size="large" required placeholder="e.g. Nguyễn Văn A" />
                    <p className="flex-1 text-[#c10000]">Vui lòng nhập trường này</p>
                </div>
            </div>
            <div className="!mb-4">
                <div className="!mb-1">
                    <span className="font-semibold !pr-1">Email cá nhân</span>
                    <span className="text-[#c10000]">*</span>
                </div>
                <div className="flex items-center justify-start gap-4">
                    <Input className="max-w-75" size="large" required placeholder="e.g. nguyenA123@gmail.com" />
                    <p className="flex-1 text-[#c10000]">Vui lòng nhập trường này</p>
                </div>
            </div>
            <div className="!mb-4">
                <div className="!mb-1">
                    <span className="font-semibold !pr-1">Số điện thoại</span>
                    <span className="text-[#c10000]">*</span>
                </div>
                <div className="flex items-center justify-start gap-4">
                    <Input className="max-w-75" size="large" required placeholder="e.g. 0123456789" />
                    <p className="flex-1 text-[#c10000]">Vui lòng nhập trường này</p>
                </div>
            </div>
            <div className="!mb-4">
                <div className="!mb-1">
                    <span className="font-semibold !pr-1">Địa chỉ</span>
                    {/* <span className="text-[#c10000]">*</span> */}
                </div>
                <div className="flex items-center justify-start gap-4">
                    <Input className="max-w-75" size="large" required placeholder="e.g. Ngõ A, phường B, thành phố C" />
                </div>
            </div>
            <div className="w-auto inline-flex items-center gap-2 cursor-pointer text-[#357ebd] hover:text-[#2a6395]">
                <IoKeyOutline />
                <span className="hover:underline">Thay đổi mật khẩu</span>
            </div>

            <div className="absolute bottom-0 left-0 inline-flex items-center justify-start">
                <div className="w-28 h-auto !py-1.5 uppercase text-center bg-[#002d3a] hover:bg-[#a2ff00] font-medium transition-colors duration-300 text-white hover:text-[#333] cursor-pointer">Cập nhật</div>
            </div>
        </section>
    );
};

export { UserInformation };
