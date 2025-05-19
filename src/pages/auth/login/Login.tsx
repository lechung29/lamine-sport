/** @format */
import React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const Login: React.FunctionComponent = () => {
    const [isOpenForgotPassword, setIsOpenForgotPassword] = React.useState<boolean>(false);
    return (
        <div className="w-full flex items-center justify-center">
            <div className="!my-10 !px-5 !py-4 shadow-primary w-full max-w-[420px]">
                <div className="w-full !mb-4 text-xl text-center uppercase !text-[#333]">Đăng nhập</div>
                <input
                    className="w-full h-10 !px-5 !mb-4 text-sm !text-[#333] placeholder:!text-[#333] placeholder:!text-[13px] outline-none !border-1 !border-[#e1e1e1] !bg-white"
                    type="text"
                    placeholder="Email"
                />
                <input
                    className="w-full h-10 !px-5 !mb-4 text-sm !text-[#333] placeholder:!text-[#333] placeholder:!text-[13px] outline-none !border-1 !border-[#e1e1e1] !bg-white"
                    type="text"
                    placeholder="Mật khẩu"
                />
                <button className="w-full !mb-3 flex items-center justify-center gap-1 !text-white !bg-[#002932] !px-2 !py-2 transition-colors duration-300 hover:!bg-[#77e322] hover:!text-[black] cursor-pointer">
                    <span className="uppercase text-[16px]">Đăng nhập</span>
                </button>
                <div className="w-full !mb-4 flex items-center justify-between">
                    <div className="text-[#333] hover:!text-[#77e322] cursor-pointer" onClick={() => setIsOpenForgotPassword(!isOpenForgotPassword)}>
                        Quên mật khẩu?
                    </div>
                    <Link to="/sign-up" className="!text-[#333] hover:!text-[#77e322]">
                        Đăng ký tại đây
                    </Link>
                </div>
                <AnimatePresence initial={false}>
                    {isOpenForgotPassword && (
                        <motion.div
                            key="forgot"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="w-full !mb-6 flex flex-col items-center">
                                <input
                                    className="w-full h-10 !px-5 !mb-4 text-sm !text-[#333] placeholder:!text-[#333] placeholder:!text-[13px] outline-none !border-1 !border-[#e1e1e1] !bg-white"
                                    type="text"
                                    placeholder="Email"
                                />
                                <div className="w-35 flex items-center justify-center gap-1 !text-white !bg-[#002932] !px-2 !py-2 transition-colors duration-300 hover:!bg-[#77e322] hover:!text-[black] [clip-path:polygon(3%_0%,100%_0%,97%_100%,0%_100%)] cursor-pointer">
                                    <span className="font-semibold text-[16px]">Lấy lại mật khẩu</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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

export { Login };
