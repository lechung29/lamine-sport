/** @format */

import { FOOTER_SHOP_DES, SUB_LOGO_URL } from "@/constants";
import React from "react";
import { BsFillHouseFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
    const socialButtonItem = React.useMemo(
        () => [
            {
                name: "Facebook",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/facebook_2.svg?1745145147644",
            },
            {
                name: "Instagram",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/instagram_1.svg?1745145147644",
            },
            {
                name: "Shopee",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/shopee.svg?1745145147644",
            },
            {
                name: "Lazada",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/lazada.svg?1745145147644",
            },
            {
                name: "Tiktok",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/tiktok.svg?1745145147644",
            },
        ],
        []
    );

    const payMethodButtonItem = React.useMemo(
        () => [
            {
                name: "Momo",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_1.png?1745145147644",
            },
            {
                name: "ZaloPay",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_2.png?1745145147644",
            },
            {
                name: "VNPay",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_3.png?1745145147644",
            },
            {
                name: "Moca",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_4.png?1745145147644",
            },
            {
                name: "Visa",
                imgSrc: "http://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_5.png?1745145147644",
            },
            {
                name: "ATM",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_6.png?1745145147644",
            },
        ],
        []
    );
    return (
        <div className="flex flex-col xl:flex-row xl:flex-wrap gap-4">
            {/* Two first column group*/}
            <div className="flex flex-col sm:flex-row gap-6 w-full xl:flex-[2]">
                <div className="flex-1 min-w-[230px] flex flex-col items-start justify-start !p-2">
                    <img src={SUB_LOGO_URL} alt="app-logo" className="!h-16 cursor-pointer object-cover" />
                    <div className="!mb-4 text-[#333]">{FOOTER_SHOP_DES}</div>
                    <div className="flex items-center justify-start gap-2">
                        {socialButtonItem.map((item) => (
                            <img key={item.name} src={item.imgSrc} alt={item.name} className="!h-9 !w-9 cursor-pointer filter hover:!brightness-125 transition duration-300" />
                        ))}
                    </div>
                </div>

                <div className="flex-1 min-w-[300px] flex flex-col items-start justify-start !p-2">
                    <div className="w-full font-semibold uppercase text-xl text-[#333] !py-4">Liên hệ</div>
                    <div className="text-[#333] !mb-1">
                        <span className="font-semibold">Địa chỉ: </span>
                        <span className="hover:!text-[#77e322]">Số 70 Lữ Gia, Phường 15, Quận 11, TP. Hồ Chí Minh</span>
                    </div>
                    <div className="text-[#333] !mb-1">
                        <span className="font-semibold">Điện thoại: </span>
                        <span className="hover:!text-[#77e322]">1900 1900</span>
                    </div>
                    <div className="text-[#333] !mb-1">
                        <span className="font-semibold">Zalo: </span>
                        <span className="hover:!text-[#77e322]">0123456789</span>
                    </div>
                    <div className="text-[#333] !mb-1">
                        <span className="font-semibold">Email: </span>
                        <span className="hover:!text-[#77e322]">support@lamine-sport.vn</span>
                    </div>
                    <div className="w-full !mt-4 flex items-center justify-center gap-1 !text-white !bg-[#002932] !px-2 !py-2 transition-colors duration-300 hover:!bg-[#77e322] hover:!text-[black] [clip-path:polygon(3%_0%,100%_0%,97%_100%,0%_100%)] cursor-pointer">
                        <BsFillHouseFill className="text-xl" />
                        <span className="font-semibold text-[16px]">Chuỗi cửa hàng Lamine Sport</span>
                    </div>
                </div>
            </div>

            {/* Last three column group */}
            <div className="flex flex-col sm:flex-row gap-6 w-full xl:flex-[3]">
                <div className="flex-1 min-w-[150px] flex flex-col items-start justify-start !p-2">
                    <div className="w-full font-semibold uppercase text-xl text-[#333] !py-4">Chính sách</div>
                    <Link to={"/"} className="text-[#333] hover:!text-[#77e322] !mb-2.5">
                        Chính sách mua hàng
                    </Link>
                    <Link to={"/"} className="text-[#333] hover:!text-[#77e322] !mb-2.5">
                        Chính sách thanh toán
                    </Link>
                    <Link to={"/"} className="text-[#333] hover:!text-[#77e322] !mb-2.5">
                        Chính sách vận chuyển
                    </Link>
                    <Link to={"/"} className="text-[#333] hover:!text-[#77e322] !mb-2.5">
                        Chính sách bảo mật
                    </Link>
                    <Link to={"/"} className="text-[#333] hover:!text-[#77e322] !mb-2.5">
                        Chính sách thành viên
                    </Link>
                    <Link to={"/"} className="text-[#333] hover:!text-[#77e322] !mb-2.5">
                        Cam kết cửa hàng
                    </Link>
                </div>
                <div className="flex-1 min-w-[150px] flex flex-col items-start justify-start !p-2">
                    <div className="w-full font-semibold uppercase text-xl text-[#333] !py-4">Hướng dẫn</div>
                    <Link to={"/"} className="text-[#333] hover:!text-[#77e322] !mb-2.5">
                        Hướng dẫn mua hàng
                    </Link>
                    <Link to={"/"} className="text-[#333] hover:!text-[#77e322] !mb-2.5">
                        Hướng dẫn đổi trả
                    </Link>
                    <Link to={"/"} className="text-[#333] hover:!text-[#77e322] !mb-2.5">
                        Hướng dẫn chuyển khoản
                    </Link>
                    <Link to={"/"} className="text-[#333] hover:!text-[#77e322] !mb-2.5">
                        Hướng dẫn trả góp
                    </Link>
                    <Link to={"/"} className="text-[#333] hover:!text-[#77e322] !mb-2.5">
                        Hướng dẫn hoàn hàng
                    </Link>
                    <Link to={"/"} className="text-[#333] hover:!text-[#77e322] !mb-2.5">
                        Kiểm tra đơn hàng
                    </Link>
                </div>
                <div className="flex-1 min-w-[200px] flex flex-col items-start justify-start !p-2">
                    <div className="w-full font-semibold uppercase text-xl text-[#333] !py-4">Hỗ trợ thanh toán</div>
                    <div className="w-full flex items-center justify-start gap-2 flex-wrap">
                        {payMethodButtonItem.map((item) => (
                            <img key={item.name} src={item.imgSrc} alt={item.name} className="!h-7 filter hover:!brightness-125 transition duration-300" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Footer };
