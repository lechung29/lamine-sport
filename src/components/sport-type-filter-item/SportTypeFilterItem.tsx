/** @format */

import { classNames } from "@/utils";
import React from "react";
import { Box } from "../elements";

interface ISportTypeFilterItemProps {
    text: string;
    className?: string;
    onClick?: () => void | Promise<void>;
}

const SportTypeFilterItem: React.FC<ISportTypeFilterItemProps> = (props) => {
    const { text, className, onClick } = props;
    return (
        <Box
            className={classNames(
                "h-9 text-center leading-7 text-[#333] bg-[#eeeeee] !px-5 !py-1 transition-colors duration-300 hover:bg-[#002932] hover:text-white [clip-path:polygon(7.5%_0%,100%_0%,92.5%_100%,0%_100%)] cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            {text}
        </Box>
    );
};

export { SportTypeFilterItem };
