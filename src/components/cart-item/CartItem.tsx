/** @format */

import React from "react";
import { TooltipLabel } from "../tooltip-label";
import { IoTrashOutline } from "react-icons/io5";
import { LuMinus, LuPlus } from "react-icons/lu";

const CartItem: React.FunctionComponent = () => {
    return (
        <div className="w-full flex items-center justify-center !px-2 !py-2.5">
            <div className="flex-1 flex items-start justify-start gap-3">
                <img
                    src="https://bizweb.dktcdn.net/thumb/large/100/490/431/products/p2153206-29707430-823a-4953-a110-d76779a25e57.jpg?v=1693677894677"
                    className="w-25 h-25 cursor-pointer object-cover"
                />
                <div className="h-full flex-1 flex flex-col justify-center gap-1 !pr-4 overflow-hidden">
                    <TooltipLabel className="cursor-pointer hover:!text-[#77e322]" lineDisplayed={2} text="SẢN PHẨM KALENJI Giày chạy bộ JOGFLOW 500.1 cho nam" />
                    <div className="text-[#7f7f7f] text-sm">38 / Xanh dương</div>
                    <IoTrashOutline className="w-5 h-5 cursor-pointer hover:text-[#c10000]" />
                </div>
            </div>
            <div className="font-bold text-[#c10000] w-30">175.000đ</div>
            <div className="w-30 flex items-center">
                <div className="w-7 h-7 flex items-center justify-center !border !border-gray-200 cursor-pointer hover:!bg-gray-100">
                    <LuMinus className="!text-[10px]" />
                </div>
                <input type="text" className="h-7 w-9 text-center outline-none !border-y !border-gray-200" />
                <div className="w-7 h-7 flex items-center justify-center !border !border-gray-200 cursor-pointer hover:!bg-gray-100">
                    <LuPlus className="!text-[10px]" />
                </div>
            </div>
            <div className="font-bold text-[#c10000] w-30">350.000đ</div>
        </div>
    );
};

export { CartItem };
