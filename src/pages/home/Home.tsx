/** @format */

import { Carousel, SportTypeCarousel } from "@/components";
import React from "react";

const Home: React.FC = () => {
    return (
        <div className="w-full">
            <div className="!mb-7.5">
                <Carousel />
            </div>
            <div className="w-full !px-[45px] !py-7.5 !mb-7.5">
                <SportTypeCarousel />
            </div>
        </div>
    );
};

export { Home };
