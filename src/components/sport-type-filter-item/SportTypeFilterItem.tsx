/** @format */

import { classNames } from "@/utils";
import React from "react";

interface ISportTypeFilterItemProps {
    text: string;
    className?: string;
    position: "first" | "center" | "last";
    onClick?: () => void | Promise<void>;
}

const SportTypeFilterItem: React.FC<ISportTypeFilterItemProps> = (props) => {
    const { text, position, className, onClick } = props;
    switch (position) {
        case "first":
            return (
                <div
                    className={classNames(
                        "!ml-4 h-9 text-center leading-7 text-[#333] bg-[#eeeeee] !px-5 !py-1 transition-colors duration-300 hover:bg-[#002932] hover:text-white [clip-path:polygon(0%_0%,100%_0%,92.5%_100%,0%_100%)] cursor-pointer",
                        className
                    )}
                    onClick={onClick}
                >
                    {text}
                </div>
            );
        case "last":
            return (
                <div
                    className={classNames(
                        "!mr-4 h-9 text-center leading-7 text-[#333] bg-[#eeeeee] !px-5 !py-1 transition-colors duration-300 hover:bg-[#002932] hover:text-white [clip-path:polygon(7.5%_0%,100%_0%,100%_100%,0%_100%)] cursor-pointer",
                        className
                    )}
                    onClick={onClick}
                >
                    {text}
                </div>
            );
        case "center":
        default:
            return (
                <div
                    className={classNames(
                        "h-9 text-center leading-7 text-[#333] bg-[#eeeeee] !px-5 !py-1 transition-colors duration-300 hover:bg-[#002932] hover:text-white [clip-path:polygon(7.5%_0%,100%_0%,92.5%_100%,0%_100%)] cursor-pointer",
                        className
                    )}
                    onClick={onClick}
                >
                    {text}
                </div>
            );
    }
};

export { SportTypeFilterItem };
