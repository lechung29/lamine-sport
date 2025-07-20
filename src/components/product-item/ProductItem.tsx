/** @format */

import { classNames } from "@/utils";
import { Tooltip } from "antd";
import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { TooltipLabel } from "../tooltip-label";
import { AddProductDialog } from "../add-product-dialog";

export interface IProductItemProps {
    colorText: string;
    colorValue: string;
    imgUrl?: string;
}

export const productColor: IProductItemProps[] = [
    {
        colorText: "Xanh",
        colorValue: "#024779",
        imgUrl: "https://bizweb.dktcdn.net/thumb/large/100/490/431/products/p2153206-29707430-823a-4953-a110-d76779a25e57.jpg?v=1693677894677",
    },
    {
        colorText: "Xám",
        colorValue: "#615a5a",
        imgUrl: "https://bizweb.dktcdn.net/thumb/large/100/490/431/products/p2153194-ff20224d-5e74-477d-80b5-9da8e0f44ae0.jpg?v=1693677888377",
    },
    {
        colorText: "Trắng",
        colorValue: "#fff",
        imgUrl: "https://bizweb.dktcdn.net/thumb/large/100/490/431/products/p2153171-1a772a34-0e30-40cf-b77c-361b6428fec9.jpg?v=1693677894677",
    },
    {
        colorText: "Đen",
        colorValue: "#000",
        imgUrl: "https://bizweb.dktcdn.net/thumb/large/100/490/431/products/p2153177-a6046d5b-6f38-4b10-8384-198e73995c0a.jpg?v=1693677894677",
    },
];

const ProductItem: React.FC = () => {
    const [currentItem, setCurrentItem] = React.useState<IProductItemProps | undefined>(undefined);
    const [isOpenAddProductDialog, setIsOpenAddProductDialog] = React.useState<boolean>(false);

    const sold = 20;
    const total = 100;
    const soldPercent = (sold / total) * 100;

    return (
        <>
            <div className="!bg-white min-h-[440px] min-w-50 flex-1 !border !border-[#00000020] overflow-hidden group hover:!shadow-lg">
                <div className="w-full h-full !pb-2 flex flex-col justify-start">
                    <span className="!bg-[#ff3a0b] absolute top-1 left-1 inline-block text-sm !py-0.5 !pl-1 !pr-3 !text-white text-shadow-2xs !z-10 [clip-path:polygon(0%_0%,100%_0%,90%_100%,0%_100%)]">
                        Giảm 19%
                    </span>
                    <div className="w-full h-auto overflow-hidden cursor-pointer">
                        <img src={currentItem?.imgUrl || productColor[0].imgUrl} alt="Product" className="w-full object-contain group-hover:!scale-105 transition-all duration-200" />
                    </div>
                    <div className="!my-3 !px-2.5 flex items-center justify-start gap-2">
                        {productColor.map((product) => (
                            <Tooltip title={product.colorText} color={"#002d3a"} key={product.colorValue}>
                                <div
                                    className={classNames(`w-5 h-5 !rounded-full !outline outline-[#d0d0d0] cursor-pointer`, {
                                        "!outline-2 !outline-[#a2ff00]": currentItem?.colorValue === product.colorValue,
                                    })}
                                    style={{ backgroundColor: product.colorValue }}
                                    onClick={() => setCurrentItem(product)}
                                />
                            </Tooltip>
                        ))}
                    </div>
                    <TooltipLabel 
                        className="!mb-2 !px-[10px] cursor-pointer hover:!text-[#77e322]"
                        text="SẢN PHẨM KALENJI Giày chạy bộ JOGFLOW 500.1 cho nam 2" 
                        lineDisplayed={2} 
                    />
                    <div className="w-full !px-2.5">
                        <div className="w-full !mb-3 flex items-center justify-start gap-2">
                            <p className="text-[#c30000] font-extrabold text-lg">969.000đ</p>
                            <p className="text-[#7b7b7b] text-sm line-through">1.200.000đ</p>
                        </div>
                        <div
                            className="w-full !mb-3 flex items-center justify-center gap-1 !text-[#333] !bg-[#a2ff00] !px-2 !py-2 transition-colors duration-300 hover:!bg-[#002932] hover:!text-white cursor-pointer"
                            onClick={() => setIsOpenAddProductDialog(true)}
                        >
                            <IoSettingsOutline className="!text-[22px]" />
                            <span className="text-[16px]">Tùy chọn</span>
                        </div>
                        <div className="w-full !mt-4">
                            <div className="w-full h-2 bg-[#ffcfb4] relative z-10">
                                <div className="absolute h-2 z-0 left-0 top-0 bg-[#fb5831]" style={{ width: `${soldPercent}%` }} />
                            </div>
                            <div className="!mt-1 text-[14px]">
                                Đã bán <span className="font-semibold">20 sản phẩm</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddProductDialog isOpen={isOpenAddProductDialog} productItem={productColor} onClose={() => setIsOpenAddProductDialog(false)} />
        </>
    );
};

export { ProductItem };
