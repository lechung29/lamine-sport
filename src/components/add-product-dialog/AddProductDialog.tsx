/** @format */

import React from "react";
import { Dialog } from "../dialog";
import { IProductItemProps } from "../product-item";
import { TooltipLabel } from "../tooltip-label";
import { Tooltip } from "antd";
import { classNames } from "@/utils";
import { LuMinus, LuPlus } from "react-icons/lu";

interface IAddProductDialogProps {
    isOpen: boolean;
    productItem?: any;
    onClose: () => void;
}

const AddProductDialog: React.FC<IAddProductDialogProps> = (props) => {
    const { isOpen, onClose } = props;
    const [currentItem, setCurrentItem] = React.useState<IProductItemProps | undefined>(undefined);
    const [currentSize, setCurrentSize] = React.useState<number | undefined>(undefined);
    const productSize = [36, 37, 38, 39, 40];

    return (
        <Dialog isOpen={isOpen} onClose={onClose} withoutFooter={true}>
            <div className="w-full h-full flex items-start justify-center gap-6">
                <div className="w-2/5 h-auto overflow-hidden cursor-pointer">
                    <img src={currentItem?.imgUrl || props.productItem[0].imgUrl} alt="Product" className="w-full object-contain" />
                </div>
                <div className="flex-1">
                    <TooltipLabel className="!mb-2 font-semibold text-xl cursor-pointer hover:!text-[#77e322]" text="SẢN PHẨM KALENJI Giày chạy bộ JOGFLOW 500.1 cho nam 2" lineDisplayed={2} />
                    <div className="w-full !mb-3 flex items-center justify-start gap-2">
                        <p className="text-[#c30000] font-extrabold text-xl">969.000đ</p>
                        <p className="text-[#7b7b7b] text-[16px] line-through">1.200.000đ</p>
                    </div>
                    <div className="w-full !mb-4">
                        <p className="text-[#333] text-sm">Màu sắc:</p>
                        <div className="!my-2 flex items-center justify-start gap-2.5">
                            {props?.productItem.map((product) => (
                                <Tooltip title={product.colorText} color={"#002d3a"} key={product.colorValue}>
                                    <div
                                        className={classNames(`w-7 h-7 !rounded-full !outline outline-[#d0d0d0] cursor-pointer`, {
                                            "!outline-2 !outline-[#a2ff00]": currentItem?.colorValue === product.colorValue,
                                        })}
                                        style={{ backgroundColor: product.colorValue }}
                                        onClick={() => setCurrentItem(product)}
                                    />
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                    <div className="w-full !mb-4">
                        <p className="text-[#333] text-sm">Kích thước:</p>
                        <div className="!my-2 flex items-center justify-start gap-2.5">
                            {productSize.map((item) => (
                                <div
                                    className={classNames("w-7 h-7 !outline text-sm bg-white text-[#333] !outline-gray-200 flex items-center justify-center cursor-pointer", {
                                        "!bg-[#002d3a] text-white": item === currentSize,
                                    })}
                                    onClick={() => setCurrentSize(item)}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-start flex-wrap gap-2">
                        <div className="flex items-center gap-1">
                            <div className="w-10 h-10 flex items-center justify-center cursor-pointer !text-white hover:!text-[#333] bg-[#002d3a] hover:!bg-[#77e322] transition-colors duration-300">
                                <LuMinus className="!text-[14px]" />
                            </div>
                            <input type="text" className="h-9.75 w-15 text-center !outline !outline-gray-400" />
                            <div className="w-10 h-10 flex items-center justify-center cursor-pointer !text-white hover:!text-[#333] bg-[#002d3a] hover:!bg-[#77e322] transition-colors duration-300">
                                <LuPlus className="!text-[14px]" />
                            </div>
                        </div>
                        <button
                            className="w-37 h-10 flex items-center justify-center gap-1 cursor-pointer !text-white hover:!text-[#333] !bg-[#002d3a] hover:!bg-[#77e322] transition-colors duration-300"
                        >
                            <span className="font-semibold text-[16px]">Thêm vào giỏ hàng</span>
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export { AddProductDialog };
