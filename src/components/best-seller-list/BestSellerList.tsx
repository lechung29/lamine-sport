/** @format */

import React from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import type { Swiper as SwiperInstance } from "swiper";
import { SportTypeFilterItem } from "../sport-type-filter-item";
import "./BestSellerList.scss";
import { classNames } from "@/utils";

const BestSellerList: React.FC = () => {
    const [isStart, setIsStart] = React.useState<boolean>(true);
    const [isEnd, setIsEnd] = React.useState<boolean>(false);
    const [selectedSportTypeItem, setSelectedSportTypeItem] = React.useState<string>("");
    const swiperRef = React.useRef<SwiperInstance | null>(null);

    const onNextItemClick = (): void => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
            setIsStart(false);
            if (swiperRef.current.isEnd) {
                setIsEnd(true);
            }
        }
    };

    const onPreviousItemClick = (): void => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
            setIsEnd(false);
            if (swiperRef.current.isBeginning) {
                setIsStart(true);
            }
        }
    };
    const sportType = ["Thể thao dưới nước", "Thể thao ngoài trời", "Chạy bộ & Đi bộ", "Các môn Fitness", "Đạp xe và trượt ván", "Các môn mục tiêu"];
    return (
        <div className="w-full">
            <div className="w-full !mb-5 relative flex items-center justify-between">
                <div className="inline-block font-bold text-[#333] text-3xl oswald-font uppercase leading-12 !pb-2 !pr-4">Top sản phẩm bán chạy</div>
                <div className="flex-1 relative flex items-center justify-center">
                    <div className={classNames("bg-transparent cursor-pointer group", { "!cursor-not-allowed": isStart })} onClick={onPreviousItemClick}>
                        <BsArrowLeft className={classNames("text-2xl group-hover:text-[#a2ff00]", { "group-hover:text-gray-400": isStart })} />
                    </div>
                    <div className="relative w-full mx-2">
                        <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-10 bg-gradient-to-r from-white via-white/40 to-transparent" />
                        <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-10 bg-gradient-to-l from-white via-white/40 to-transparent" />
                        <Swiper
                            modules={[Autoplay, Pagination, Navigation, EffectFade]}
                            spaceBetween={10}
                            slidesPerView={5}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            className="g-sport-filter-list-section"
                        >
                            {sportType.map((item, index) => (
                                <SwiperSlide key={item}>
                                    <SportTypeFilterItem
                                        className={selectedSportTypeItem === item ? "!bg-[#002932] !text-white" : ""}
                                        text={item}
                                        position={index === 0 ? "first" : index === sportType.length - 1 ? "last" : "center"}
                                        onClick={() => setSelectedSportTypeItem(item)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className={classNames("bg-transparent cursor-pointer group", { "!cursor-not-allowed": isEnd })} onClick={onNextItemClick}>
                        <BsArrowRight className={classNames("text-2xl group-hover:text-[#a2ff00]", { "group-hover:text-gray-400": isEnd })} />
                    </div>
                </div>
                <div className="h-1 w-22 absolute bottom-0 left-0 bg-[#a2ff00] [clip-path:polygon(0%_0%,100%_0%,95%_100%,0%_100%)]" />
            </div>
        </div>
    );
};

export { BestSellerList };
