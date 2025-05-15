/** @format */

import React from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import { IoIosCloseCircleOutline } from "react-icons/io";

const CartMenu: React.FC = () => {
    return (
        <div className="!bg-white w-84 h-auto">
            <div className="w-full !px-4 !py-2 uppercase text-[15px] font-bold !border-b !border-gray-200">Giỏ hàng</div>
            <div className="w-full !px-4 flex flex-col">
                <div className="w-full flex items-start justify-between gap-4 !py-3 not-last:!border-b not-last:!border-gray-200">
                    <div className="flex items-center justify-center !py-2 !px-1 !border !border-gray-200">
                        <img src="https://bizweb.dktcdn.net/thumb/1024x1024/100/490/431/products/p1640075.jpg?v=1694061857890" alt="product" className="w-15 h-15 object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                        <div className="w-full flex flex-row items-start justify-between">
                            <div className="flex-1">
                                <div className="text-black hover:!text-[#77e322] cursor-pointer">SẢN PHẨM KALENJI Giày chạy bộ JOGFLOW 500.1 cho nam</div>
                                <div className="text-[12px] text-gray-500">Xanh / 36</div>
                            </div>
                            <div className="w-6">
                                <IoIosCloseCircleOutline className="text-xl text-black hover:!text-red-500 cursor-pointer" />
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
                        <div className="w-full flex flex-row items-start justify-between">
                            <div className="flex-1">
                                <div className="text-black hover:!text-[#77e322] cursor-pointer">SẢN PHẨM KALENJI Giày chạy bộ JOGFLOW 500.1 cho nam</div>
                                <div className="text-[12px] text-gray-500">Xanh / 36</div>
                            </div>
                            <div className="w-6">
                                <IoIosCloseCircleOutline className="text-xl text-black hover:!text-red-500 cursor-pointer" />
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
                        <div className="w-full flex flex-row items-start justify-between">
                            <div className="flex-1">
                                <div className="text-black hover:!text-[#77e322] cursor-pointer">SẢN PHẨM KALENJI Giày chạy bộ JOGFLOW 500.1 cho nam</div>
                                <div className="text-[12px] text-gray-500">Xanh / 36</div>
                            </div>
                            <div className="w-6">
                                <IoIosCloseCircleOutline className="text-xl text-black hover:!text-red-500 cursor-pointer" />
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
        </div>
    );
};

export { CartMenu };
