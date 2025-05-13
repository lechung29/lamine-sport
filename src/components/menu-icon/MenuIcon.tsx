/** @format */

import React from "react";

interface MenuIconProps {
    onClick?: () => void | Promise<void>;
}

const MenuIcon: React.FC<MenuIconProps> = ({ onClick }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center cursor-pointer" onClick={onClick}>
            <div className="w-8">
                <div className="w-6 !my-[7px] h-[2px] !bg-white" />
                <div className="w-7 !my-[7px] h-[2px] !bg-green-500" />
                <div className="w-8 !my-[7px] h-[2px] !bg-white" />
            </div>
            <p className="text-sm uppercase">Menu</p>
        </div>
    );
};

export { MenuIcon };
