/** @format */

import React from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import { IoIosCloseCircleOutline } from "react-icons/io";

const CartMenu: React.FC = () => {
    return (
        <div className="!bg-white w-84 h-auto">
            <div className="w-full !px-4 !py-2 uppercase text-[15px] font-bold !border-b !border-gray-200">Giỏ hàng</div>
            <div className="w-full max-h-100 scroll-on-hover !px-4 flex flex-col !border-b !border-gray-200">
                <div className="w-full flex items-start justify-between gap-4 !py-3 not-last:!border-b not-last:!border-gray-200">
                    <div className="flex items-center justify-center !py-2 !px-1 !border !border-gray-200">
                        <img src="https://bizweb.dktcdn.net/thumb/1024x1024/100/490/431/products/p1640075.jpg?v=1694061857890" alt="product" className="w-15 h-15 object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                        <div className="w-full flex flex-row items-start justify-between gap-1">
                            <div className="flex-1">
                                <div className="text-[#333] hover:!text-[#77e322] cursor-pointer">SẢN PHẨM KALENJI Giày chạy bộ JOGFLOW 500.1 cho nam</div>
                                <div className="text-[12px] text-gray-500">Xanh / 36</div>
                            </div>
                            <div className="w-6 flex items-center justify-end">
                                <IoIosCloseCircleOutline className="text-xl text-[#333] hover:!text-red-500 cursor-pointer" />
                            </div>
                        </div>
                        <div className="w-full flex flex-row items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-7 h-7 flex items-center justify-center !border !border-gray-200 cursor-pointer hover:!bg-gray-100">
                                    <LuMinus className="!text-[10px]" />
                                </div>
                                <input type="text" className="h-7 w-9 text-center outline-none !border-y !border-gray-200" />
                                <div className="w-7 h-7 flex items-center justify-center !border !border-gray-200 cursor-pointer hover:!bg-gray-100">
                                    <LuPlus className="!text-[10px]" />
                                </div>
                            </div>
                            <div className="text-red-600 font-semibold">969.000đ</div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex items-start justify-between gap-4 !py-3 not-last:!border-b not-last:!border-gray-200">
                    <div className="flex items-center justify-center !py-2 !px-1 !border !border-gray-200">
                        <img src="https://bizweb.dktcdn.net/thumb/1024x1024/100/490/431/products/p1640075.jpg?v=1694061857890" alt="product" className="w-15 h-15 object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                        <div className="w-full flex flex-row items-start justify-between gap-1">
                            <div className="flex-1">
                                <div className="text-[#333] hover:!text-[#77e322] cursor-pointer">SẢN PHẨM KALENJI Giày chạy bộ JOGFLOW 500.1 cho nam</div>
                                <div className="text-[12px] text-gray-500">Xanh / 36</div>
                            </div>
                            <div className="w-6 flex items-center justify-end">
                                <IoIosCloseCircleOutline className="text-xl text-[#333] hover:!text-red-500 cursor-pointer" />
                            </div>
                        </div>
                        <div className="w-full flex flex-row items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-7 h-7 flex items-center justify-center !border !border-gray-200 cursor-pointer hover:!bg-gray-100">
                                    <LuMinus className="!text-[10px]" />
                                </div>
                                <input type="text" className="h-7 w-9 text-center outline-none !border-y !border-gray-200" />
                                <div className="w-7 h-7 flex items-center justify-center !border !border-gray-200 cursor-pointer hover:!bg-gray-100">
                                    <LuPlus className="!text-[10px]" />
                                </div>
                            </div>
                            <div className="text-red-600 font-semibold">969.000đ</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-auto !p-4 flex items-center justify-between bg-gray-100">
                <div className="flex flex-col">
                    <span className="text-[15px]">Tổng tiền:</span>
                    <span className="text-red-600 text-xl font-semibold">1.242.000đ</span>
                </div>
                <button className="!text-white !bg-[#002932] !px-6 !py-2.5 font-semibold transition-colors duration-400 hover:!bg-[#77e322] hover:!text-[#333] [clip-path:polygon(10%_0%,100%_0%,100%_100%,0%_100%)] cursor-pointer">
                    THANH TOÁN
                </button>
            </div>
        </div>
    );
};

export { CartMenu };
