/** @format */

import { BestSellerList, Carousel, CustomerFeedbackList, FlashSaleList, SportForMenList, SportForWomenList, SportTypeCarousel } from "@/components";
import React from "react";

const Home: React.FC = () => {
    return (
        <div className="w-full">
            <div className="!mb-7.5">
                <Carousel />
            </div>
            <div className="w-full !px-[45px] !py-7.5">
                <SportTypeCarousel />
            </div>
            <div className="w-full !py-7.5">
                <FlashSaleList />
            </div>
            <div className="w-full !px-[45px] !py-7.5">
                <BestSellerList />
            </div>
            <div className="w-full !py-7.5">
                <SportForMenList />
            </div>
            <div className="w-full !py-7.5">
                <SportForWomenList />
            </div>
            <div className="w-full !py-7.5">
                <CustomerFeedbackList />
            </div>
        </div>
    );
};

export { Home };
