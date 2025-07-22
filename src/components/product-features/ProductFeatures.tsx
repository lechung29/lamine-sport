/** @format */

import React from "react";

interface FeatureItem {
    icon: React.ReactNode;
    text: string;
}

interface FeatureListProps {
    items: FeatureItem[];
}

const ProductFeatures: React.FC<FeatureListProps> = ({ items }) => {
    return (
        <div className="!space-y-2">
            {items.map((item, index) => (
                <div key={index} className="relative h-15 flex items-center gap-3 bg-[#f4f4f4] !border !border-[#ccc]">
                    <div className="absolute -left-4 w-8 h-8 flex items-center justify-center font-bold rounded-full bg-[#a2ff00] text-[#333]">{index + 1}</div>
                    <div className="w-full flex items-center !py-2.5 !pr-2.5 !pl-7 gap-2">
                        {item.icon}
                        <span className=" text-[16px] font-semibold">{item.text}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export {
    ProductFeatures
}
