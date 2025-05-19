/** @format */
import React from "react";
import { Link } from "react-router-dom";

const SignUp: React.FunctionComponent = () => {
    return (
        <div className="w-full flex items-center justify-center">
            <div className="!my-10 !px-5 !py-4 shadow-primary w-full max-w-[420px]">
                <div className="w-full !mb-4 text-xl text-center uppercase text-[#333]">Đăng ký</div>
                <div className="w-full !mb-4 text-center text-[#333]">Đã có tài khoản, đăng nhập <Link to="/login" className="hover:!text-[#77e322]">tại đây</Link></div>
                <input
                    className="w-full h-10 !px-5 !mb-4 text-sm !text-[#333] placeholder:!text-[#333] placeholder:!text-[13px] outline-none !border-1 !border-[#e1e1e1] !bg-white"
                    type="text"
                    placeholder="Họ"
                />
                <input
                    className="w-full h-10 !px-5 !mb-4 text-sm !text-[#333] placeholder:!text-[#333] placeholder:!text-[13px] outline-none !border-1 !border-[#e1e1e1] !bg-white"
                    type="text"
                    placeholder="Tên"
                />
                <input
                    className="w-full h-10 !px-5 !mb-4 text-sm !text-[#333] placeholder:!text-[#333] placeholder:!text-[13px] outline-none !border-1 !border-[#e1e1e1] !bg-white"
                    type="text"
                    placeholder="Email"
                />
                <input
                    className="w-full h-10 !px-5 !mb-4 text-sm !text-[#333] placeholder:!text-[#333] placeholder:!text-[13px] outline-none !border-1 !border-[#e1e1e1] !bg-white"
                    type="text"
                    placeholder="Số diện thoại"
                />
                <input
                    className="w-full h-10 !px-5 !mb-4 text-sm !text-[#333] placeholder:!text-[#333] placeholder:!text-[13px] outline-none !border-1 !border-[#e1e1e1] !bg-white"
                    type="text"
                    placeholder="Mật khẩu"
                />
                <button className="w-full !mb-4 flex items-center justify-center gap-1 !text-white !bg-[#002932] !px-2 !py-2 transition-colors duration-300 hover:!bg-[#77e322] hover:!text-[black] cursor-pointer">
                    <span className="uppercase text-[16px]">Đăng ký</span>
                </button>
                <div className="w-full !mb-4 text-center text-[#333]">Hoặc đăng nhập bằng</div>
                <div className="w-full flex items-center justify-center gap-1">
                    <button className="cursor-pointer">
                        <img className="w-30 h-9" src="https://bizweb.dktcdn.net/assets/admin/images/login/fb-btn.svg" alt="facebook-login" />
                    </button>
                    <button className="cursor-pointer">
                        <img className="w-30 h-9" src="https://bizweb.dktcdn.net/assets/admin/images/login/gp-btn.svg" alt="google-login" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export { SignUp };
