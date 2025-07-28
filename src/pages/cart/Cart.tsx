/** @format */

import { Breadcrumbs, CartItem, Calendar, TimeRangeSelect } from "@/components";
import React from "react";

const paymentMethods = [
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
];

const Cart: React.FunctionComponent = () => {
    return (
        <section className="w-full">
            <Breadcrumbs />
            <div className="w-full h-auto !px-[45px]">
                <div className="w-full !py-2.5 text-lg uppercase font-semibold">Giỏ hàng của bạn</div>
                <div className="flex flex-wrap max-md:gap-4 !mb-10">
                    <div className="w-full lg:!pr-2 lg:w-2/3 overflow-x-hidden">
                        <div className="relative w-full h-6.5 !mb-4 flex items-center justify-center bg-[#e1e1e1] !rounded-md" role="progressbar">
                            <p className="text-sm z-10 text-[#333]">
                                Mua tối thiểu 450.000đ để được <span className="uppercase font-semibold">miễn phí vận chuyển</span>
                            </p>
                            <div className="absolute left-0 h-full bg-amber-400 !rounded-md" style={{ width: "45%" }} />
                        </div>
                        <div className="w-full scroll-horizontal">
                            <div className="w-full min-w-[700px] !border !border-[#eee]">
                                <div className="w-full flex items-center justify-center !px-2 !py-2.5 bg-[#eee]">
                                    <div className="uppercase font-semibold flex-1">Thông tin sản phẩm</div>
                                    <div className="uppercase font-semibold w-30">Đơn giá</div>
                                    <div className="uppercase font-semibold w-30">Số lượng</div>
                                    <div className="uppercase font-semibold w-30">Thành tiền</div>
                                </div>
                                {Array.from({ length: 3 }).map(() => (
                                    <CartItem />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:!pl-2 lg:w-1/3">
                        <div className="w-full !border !border-[#ebebeb]">
                            <div className="!p-3 text-center uppercase font-bold bg-[#eee]">Thông tin đơn hàng</div>
                            <div className="!px-3 bg-[#f8f8f8]">
                                <div className="flex items-center justify-between !py-3 !border-b !border-b-[#ddd]">
                                    <span className="font-semibold">Tổng tiền</span>
                                    <span className="font-semibold text-[#c30000] text-xl">175.000đ</span>
                                </div>
                                <div className="!py-3 !border-b !border-b-[#ddd]">
                                    <div className="flex items-center justify-between !mb-1">
                                        <span className="font-semibold">Giảm giá</span>
                                        <span className="text-[#6b6b6b]">Áp dụng tại trang thanh toán</span>
                                    </div>
                                    <div className="flex items-center justify-between !mb-1">
                                        <span className="font-semibold">Phí vận chuyển</span>
                                        <span className="text-[#6b6b6b]">Được tính tại trang thanh toán</span>
                                    </div>
                                </div>
                                <div className="!py-3 !border-b !border-b-[#ddd]">
                                    <div className="font-semibold !mb-3">Thời gian giao hàng</div>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex-1/2">
                                            <Calendar />
                                        </div>
                                        <div className="flex-1/2">
                                            <TimeRangeSelect />
                                        </div>
                                    </div>
                                </div>
                                <div className="!py-3">
                                    <div
                                        className="!mt-1 h-11 flex items-center justify-center font-semibold uppercase bg-[#002d3a] text-white cursor-pointer hover:text-[#333] hover:bg-[#a2ff00] transition-colors duration-400"
                                        role="button"
                                    >
                                        Thanh toán
                                    </div>
                                    <div
                                        className="!mt-3 h-11 flex items-center justify-center font-semibold text-lg bg-[#646464] text-white cursor-pointer hover:bg-[#8b8b8b] transition-colors duration-400"
                                        role="button"
                                    >
                                        Tiếp tục mua hàng
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full !mt-5">
                            <div className="font-semibold text-center text-xl text-[#333]">Hỗ trợ thanh toán với</div>
                            <div className="!mt-1 flex items-center justify-center gap-2 flex-wrap">
                                {paymentMethods.map((item) => (
                                    <img key={item.name} src={item.imgSrc} alt={item.name} className="!h-9 filter hover:!brightness-125 transition duration-300" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Cart };
