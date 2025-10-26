/** @format */

import { Flex } from "antd";
import React from "react";
import { Box, Text } from "../elements";

interface MenuIconProps {
    onClick?: () => void | Promise<void>;
}

const MenuIcon: React.FC<MenuIconProps> = ({ onClick }) => {
    return (
        <Flex vertical align="center" justify="center" className="h-full cursor-pointer" onClick={onClick}>
            <Box className="w-8">
                <Box className="w-6 !my-[7px] h-[2px] !bg-white" />
                <Box className="w-7 !my-[7px] h-[2px] !bg-green-500" />
                <Box className="w-8 !my-[7px] h-[2px] !bg-white" />
            </Box>
            <Text size="sm" textTransform="uppercase" titleText="Menu" />
        </Flex>
    );
};

export { MenuIcon };
