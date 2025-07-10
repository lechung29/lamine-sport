/** @format */

import { FEEDBACK_ITEM_BG } from "@/constants";
import { Avatar } from "antd";
import React from "react";

const FeedbackItem: React.FC = () => {
    return (
        <div
            className="relative !px-4 !py-5 bg-white"
            style={{
                backgroundPosition: "calc(100% - 15px) 15px",
                backgroundImage: `url(${FEEDBACK_ITEM_BG})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "60px",
            }}
        >
            <div
                className="relative before:!content-[''] before:!absolute before:!top-full before:!left-10 
                before:!border-t-[15px] before:!border-l-[15px] before:!border-b-0 before:!border-r-0 
                before:!border-t-white before:!border-l-transparent before:!border-solid"
            />
            <div className="flex gap-4">
                <Avatar size={{ xs: 24, sm: 32, md: 64, lg: 86, xl: 110, xxl: 130 }} src="https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/feedback_2_avatar.jpg?1748701070293" />
                <div className="flex-1 flex flex-col !pl-5">
                    <div className="text-lg font-bold text-[#333]">Anh. Huỳnh Tuyến</div>
                    <span className="text-[#757575]">Customer Service</span>
                    <div className="min-h-25 text-[#333] !mt-2">
                        "Rất thích đồ của Lamine Sport, trước toàn ra mua trực tiếp, lần này đặt hàng online, được 2 hôm là có hàng, chuẩn mẫu mã, ship nhanh và chất lượng bền tốt nữa. Tôi sẽ quay lại
                        mua nữa."
                    </div>
                </div>
            </div>
        </div>
    );
};

export { FeedbackItem };
