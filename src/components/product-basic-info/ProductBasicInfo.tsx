/** @format */

import React from "react";
import { IoHeartOutline } from "react-icons/io5";
import { TooltipLabel } from "../tooltip-label";
import { classNames } from "@/utils";
import { TfiRulerAlt } from "react-icons/tfi";
import { InstructionSizeDialog } from "../instruction-size-dialog";
import { LuMinus, LuPlus } from "react-icons/lu";

export const productSize = ["S", "M", "L"];
export const productColorList = ["Xanh dương", "Xám", "Trắng", "Đen"]

const ProductBasicInfo: React.FunctionComponent = () => {
    const [currentSize, setCurrentSize] = React.useState<string>("S");
    const [currentColor, setCurrentColor] = React.useState<string>("Xanh dương")
    const [isOpenInstructionSize, setIsOpenInstructionSize] = React.useState<boolean>(false);
    return (
        <React.Fragment>
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
                    <div className="relative flex items-center !mb-6 bg-[#f5f5f5] !px-2.5 !py-2 !pr-15 ">
                        <p className="!text-[#c30000] !mr-2 !font-bold text-3xl">160.000₫</p>
                        <p className="!text-[18px] line-through">200.000đ</p>
                        <div className="absolute top-0 bottom-0 right-0 w-14 inline-flex items-center justify-center !bg-[#c30000] text-white font-semibold [clip-path:polygon(20%_0%,100%_0%,100%_100%,0%_100%)]">- 20%</div>
                    </div>
                    <div className="!mb-2">
                        <p className="text-[16px]">
                            Màu sắc: <span className="font-bold">{currentColor}</span>
                        </p>
                    </div>
                    <div className="!mb-6 inline-flex gap-2.5">
                        {productColorList.map((item, idx) => (
                            <div
                                key={idx}
                                className={classNames("w-8.5 h-8.5 !rounded-full !border !border-[#9d9d9d] inline-flex items-center justify-center cursor-pointer", {
                                    "shadow-primary !border-2 !border-white": item === currentColor,
                                    "!bg-[#024779]": item === "Xanh dương",
                                    "!bg-[#615a5a]": item == "Xám",
                                    "!bg-white": item === "Trắng",
                                    "!bg-black": item === "Đen"
                                })}
                                role="button"
                                onClick={() => setCurrentColor(item)}
                            />
                        ))}
                    </div>
                    <div className="!mb-2">
                        <p className="text-[16px]">
                            Kích thước: <span className="font-bold">{currentSize}</span>
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
                    <div className="!mb-4 flex items-center gap-2" onClick={() => setIsOpenInstructionSize(true)} onMouseDown={(e) => e.preventDefault()}>
                        <TfiRulerAlt className="text-[#fd7e14] text-lg" />
                        <TooltipLabel alwaysShow width="auto" tooltipDescription="Gợi ý tìm size">
                            <span className="text-[16px] cursor-pointer hover:text-[#a2ff00]">Hướng dẫn chọn kích cỡ</span>
                        </TooltipLabel>
                    </div>
                    <div className="inline-flex items-center gap-2 !mb-4">
                        <span className="text-[16px] font-semibold">Số lượng:</span>
                        <div className="flex items-center">
                            <div className="w-7.5 h-10 flex items-center justify-center !border !border-[#ddd] cursor-pointer bg-[#f8f8f8] hover:bg-[#002d3a] group">
                                <LuMinus className="!text-[10px] group-hover:text-white" />
                            </div>
                            <input type="text" className="h-10 w-12.5 text-center outline-none !border-y !border-gray-200" />
                            <div className="w-7.5 h-10 flex items-center justify-center !border !border-[#ddd] cursor-pointer bg-[#f8f8f8] hover:bg-[#002d3a] group">
                                <LuPlus className="!text-[10px] group-hover:text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 !mb-4">
                        <button className="flex-1 h-10.5 uppercase !text-[16px] !bg-[#002d3a] !text-white hover:!text-[#333] !px-6 !py-2.5 !font-semibold transition-colors duration-400 hover:!bg-[#77e322] [clip-path:polygon(0%_0%,100%_0%,95%_100%,0%_100%)] cursor-pointer">
                            Thêm vào giỏ
                        </button>
                        <button className="flex-1 h-10.5 uppercase !text-[16px] !bg-[#a2ff00] !px-6 !py-2.5 !font-semibold transition-colors duration-400 hover:!bg-[#77e322] [clip-path:polygon(5%_0%,100%_0%,100%_100%,0%_100%)] cursor-pointer">
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>
            {isOpenInstructionSize && <InstructionSizeDialog isOpen={isOpenInstructionSize} onClose={() => setIsOpenInstructionSize(false)} />}
        </React.Fragment>
    );
};

export { ProductBasicInfo };
