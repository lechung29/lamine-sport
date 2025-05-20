/** @format */

import { Carousel, SportTypeItem } from "@/components";
import React from "react";

const Home: React.FC = () => {
    return (
        <div className="w-full">
            <div className="!mb-7.5">
                <Carousel />
            </div>
            <div className="w-full !px-[45px] !py-7.5 flex gap-4">
                <SportTypeItem />
                <SportTypeItem />
                <SportTypeItem />
                <SportTypeItem />
                <SportTypeItem />
                <SportTypeItem />
                <SportTypeItem />
                <SportTypeItem />
            </div>
        </div>
    );
};

export { Home };
