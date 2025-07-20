/** @format */

import React from "react";
import { IoHeartOutline } from "react-icons/io5";
import { TooltipLabel } from "../tooltip-label";
import { classNames } from "@/utils";
import { TfiRulerAlt } from "react-icons/tfi";

export const productSize = ["S", "M", "L"];

const ProductBasicInfo: React.FunctionComponent = () => {
    const [currentSize, setCurrentSize] = React.useState<string>("S");
    return (
        <div className="w-full text-primary text-sm">
            <div className="w-full !mb-6 !pb-4 !border-b !border-[#DDE1EF]">
                <div className="!mb-1 font-bold text-3xl">Áo khoác nỉ leo núi MH520 cho nữ</div>
                <div className="flex items-center justify-between">
                    <span>Mã: Đang cập nhật</span>
                    <TooltipLabel alwaysShow width="auto" placement="left" tooltipDescription="Thêm vào yêu thích">
                        <div role="button" className="cursor-pointer">
                            <IoHeartOutline className="text-3xl" />
                        </div>
                    </TooltipLabel>
                </div>
                <div className="inline-flex gap-2">
                    <span>Thương hiệu: QUECHUA</span>
                    <span>|</span>
                    <span>Tình trạng: Còn hàng</span>
                </div>
            </div>
            <div className="w-full !pb-4">
                <div className="!mb-5">
                    <p className="!tracking-normal !leading-6">
                        Chúng tôi đã thiết kế chiếc áo khoác nỉ ấm áp & rất thoáng khí dành khoác cho những người thường xuyên đi hiking muốn vận động tự do mà vẫn giữ được sự nữ tính. Bạn sẽ rất
                        thích kiểu dáng dài che phần thắt lưng, cổ áo cao mềm mại và cổ tay áo phủ tay tăng độ ấm.
                    </p>
                </div>
                <div className="!mb-5 bg-[#f5f5f5] !px-2.5 !py-1 !pr-15">
                    <p className="inline !text-[#c30000] !font-bold text-3xl">175.000₫</p>
                </div>
                <div className="!mb-2">
                    <p className="text-[16px]">
                        Size: <span className="font-bold">L</span>
                    </p>
                </div>
                <div className="!mb-4 inline-flex gap-2">
                    {productSize.map((item, idx) => (
                        <div
                            key={idx}
                            className={classNames("w-8.5 h-8.5 !border !border-[#9d9d9d] inline-flex items-center justify-center cursor-pointer", {
                                "text-white !bg-[#002d3a]": item === currentSize,
                            })}
                            role="button"
                            onClick={() => setCurrentSize(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
                <div className="!mb-4 flex items-center gap-2" onMouseDown={(e) => e.preventDefault()} >
                    <TfiRulerAlt className="text-[#fd7e14] text-lg" />
                    <TooltipLabel 
                        alwaysShow 
                        width="auto" 
                        tooltipDescription="Gợi ý tìm size"
                    >
                        <span className="text-[16px] cursor-pointer hover:text-[#a2ff00]">Hướng dẫn chọn kích cỡ</span>
                    </TooltipLabel>
                </div>
            </div>
        </div>
    );
};

export { ProductBasicInfo };
