/** @format */

import React from "react";

const ProductSortMenu: React.FC = () => {
    return (
        <div className="!p-1.5 !bg-white flex flex-col gap-1 w-44 h-auto">
            <div className="w-full !p-2 !py-1.5 cursor-pointer text-[#333] hover:bg-[#1c2635] hover:text-white transition-all duration-300">
                <span className="text-sm">Mặc định</span>
            </div>
            <div className="w-full !p-2 !py-1.5 cursor-pointer text-[#333] hover:bg-[#1c2635] hover:text-white transition-all duration-300">
                <span className="text-sm">Tên A-Z</span>
            </div>
            <div className="w-full !p-2 !py-1.5 cursor-pointer text-[#333] hover:bg-[#1c2635] hover:text-white transition-all duration-300">
                <span className="text-sm">Tên Z-A</span>
            </div>
            <div className="w-full !p-2 !py-1.5 cursor-pointer text-[#333] hover:bg-[#1c2635] hover:text-white transition-all duration-300">
                <span className="text-sm">Hàng mới</span>
            </div>
            <div className="w-full !p-2 !py-1.5 cursor-pointer text-[#333] hover:bg-[#1c2635] hover:text-white transition-all duration-300">
                <span className="text-sm">Giá thấp đến cao</span>
            </div>
            <div className="w-full !p-2 !py-1.5 cursor-pointer text-[#333] hover:bg-[#1c2635] hover:text-white transition-all duration-300">
                <span className="text-sm">Giá cao xuống thấp</span>
            </div>
        </div>
    );
};

export { ProductSortMenu };
