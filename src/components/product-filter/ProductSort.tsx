/** @format */

import { Popover } from "antd";
import React from "react";
import { LiaSortAlphaDownSolid } from "react-icons/lia";
import { BsCaretDownFill } from "react-icons/bs";
import { classNames } from "@/utils";
import { ProductSortMenu } from "./ProductSortMenu";
import { Box, Text } from "../elements";

interface IProductSortProps {
    activeSort: string;
    onSortChange: (sort: string) => void;
}

const ProductSort: React.FunctionComponent<IProductSortProps> = (props) => {
    const { activeSort, onSortChange } = props;
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const onSortChangeHandler = (sort: string) => {
        onSortChange(sort);
        setIsOpen(false);
    }
    return (
        <Popover 
            placement="bottomRight" 
            trigger="click" 
            open={isOpen}
            onOpenChange={(isOpen) => setIsOpen(isOpen)} 
            content={<ProductSortMenu activeSort={activeSort} onSortChange={onSortChangeHandler}/>} 
            zIndex={10}
            getPopupContainer={() => document.body}
        >
            <Box className="inline-flex items-center gap-1 text-[#333] bg-[#f1f1f1] h-8 !px-2 !border-1 !border-[#ccc] cursor-pointer" role="button">
                <LiaSortAlphaDownSolid className="text-2xl" />
                <Text as="span" fontWeight="semibold" titleText="Sắp xếp theo" />
                <BsCaretDownFill
                    className={classNames("transition-transform duration-300", {
                        "-rotate-180": isOpen,
                    })}
                />
            </Box>
        </Popover>
    );
};

export { ProductSort };
