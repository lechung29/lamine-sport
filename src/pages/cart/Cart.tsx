/** @format */

import { Breadcrumbs } from "@/components";
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
                        <div className="w-full min-w-[650px] overflow-x-auto !border !border-[#eee]">
                            <div className="w-full flex items-center justify-center !px-2 !py-2.5 bg-[#eee]">
                                <div className="uppercase font-semibold flex-1">Thông tin sản phẩm</div>
                                <div className="uppercase font-semibold w-30">Đơn giá</div>
                                <div className="uppercase font-semibold w-30">Số lượng</div>
                                <div className="uppercase font-semibold w-30">Thành tiền</div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:!pl-2 lg:w-1/3">Payment</div>
                </div>
            </div>
        </section>
    );
};

export { Cart };
