/** @format */

import React from "react";
import { Box, Container, Text } from "../elements";
import { productSortOptions } from "@/utils";
import { FaCheck } from "react-icons/fa6";

export interface IProductSortMenuProps {
    activeSort: string;
    onSortChange: (sort: string) => void;
}

const ProductSortMenu: React.FunctionComponent<IProductSortMenuProps> = (props) => {
    const { activeSort, onSortChange } = props;
    return (
        <Container padding={[6, 6, 6, 6]} className="flex flex-col gap-1 w-50 h-auto">
            {productSortOptions.map((option) => (
                <Box
                    key={option.value}
                    bgColor="white"
                    padding={[6, 8, 6, 8]}
                    className="cursor-pointer text-[#333] hover:!bg-[#1c2635] hover:text-white transition-all duration-300"
                    onClick={() => onSortChange(option.value)}
                >
                    <Text padding={[0, 8, 0, 0]} as="span" size="sm" titleText={option.label} />
                    {activeSort === option.value && <FaCheck className="text-lg float-right" />}
                </Box>
            ))}
        </Container>
    );
};

export { ProductSortMenu };
