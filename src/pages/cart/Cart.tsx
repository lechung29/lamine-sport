/** @format */

import { Breadcrumbs, CartItem, Calendar } from "@/components";
import React from "react";

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
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1/2">
                                            <Calendar />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Cart };
