/** @format */

import React from "react";
import { Box, Text } from "../elements";
import { Flex } from "antd";

interface FeatureItem {
    icon: React.ReactNode;
    text: string;
}

interface FeatureListProps {
    items: FeatureItem[];
}

const ProductFeatures: React.FC<FeatureListProps> = ({ items }) => {
    return (
        <Box className="!space-y-2">
            {items.map((item, index) => (
                <Flex align="center" gap={12} key={index} className="relative h-15 bg-[#f4f4f4] !border !border-[#ccc]">
                    <Flex align="center" justify="center" className="absolute -left-4 w-8 h-8 font-bold rounded-full bg-[#a2ff00] text-[#333]">{index + 1}</Flex>
                    <Flex align="center" gap={8} className="w-full !py-2.5 !pr-2.5 !pl-7">
                        {item.icon}
                        <Text as="span" size="base" fontWeight="semibold" titleText={item.text} />
                    </Flex>
                </Flex>
            ))}
        </Box>
    );
};

export {
    ProductFeatures
}
