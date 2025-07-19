/** @format */

import { Popover } from "antd";
import React from "react";
import { LiaSortAlphaDownSolid } from "react-icons/lia";
import { BsCaretDownFill } from "react-icons/bs";
import { classNames } from "@/utils";
import { ProductSortMenu } from "./ProductSortMenu";

const ProductSort: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    return (
        <Popover 
            placement="bottomRight" 
            trigger="click" 
            onOpenChange={(isOpen) => setIsOpen(isOpen)} 
            content={<ProductSortMenu />} 
            zIndex={1}
            getPopupContainer={() => document.body}
        >
            <div className="inline-flex items-center gap-1 text-[#333] bg-[#f1f1f1] h-8 !px-2 !border-1 !border-[#ccc] cursor-pointer" role="button">
                <LiaSortAlphaDownSolid className="text-2xl" />
                <span className="font-semibold">Sắp xếp theo</span>
                <BsCaretDownFill
                    className={classNames("transition-transform duration-300", {
                        "-rotate-180": isOpen,
                    })}
                />
            </div>
        </Popover>
    );
};

export { ProductSort };
