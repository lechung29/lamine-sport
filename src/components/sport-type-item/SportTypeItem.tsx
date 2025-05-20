/** @format */

import React from "react";
import { Link } from "react-router-dom";

const SportTypeItem: React.FC = () => {
    return (
        <div className="bg-transparent flex-1 max-w-40 group overflow-hidden cursor-pointer">
            <div className="bg-[#ebeced] !p-5 !mb-1 clip-custom-shape">
                <div className="relative">
                    <img
                        src="https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/image_cate_1.png?1745145147644"
                        alt="product"
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-200"
                    />
                </div>
            </div>
            <div className="w-full !mb-1 text-center font-bold !text-[#333] text-[17.5px]">Chạy bộ</div>
            <div className="w-full relative h-6 mt-1">  
                <Link
                    to="/"
                    className="!w-max absolute left-1/2 -translate-x-1/2 text-sm font-semibold !text-[#77e322] !underline opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                >
                    Xem chi tiết
                </Link>

                {/* Dòng "9 sản phẩm" (hiện ban đầu, ẩn khi hover) */}
                <div className="!w-max absolute left-1/2 -translate-x-1/2 text-sm text-gray-600 opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-4 transition-all duration-300">
                    9 sản phẩm
                </div>
            </div>
        </div>
    );
};

export { SportTypeItem };
