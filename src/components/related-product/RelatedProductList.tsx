/** @format */

import { classNames } from "@/utils";
import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import type { Swiper as SwiperInstance } from "swiper";
import { ProductItem } from "../product-item";

const RelatedProductList: React.FunctionComponent = () => {
    const [isStart, setIsStart] = React.useState<boolean>(true);
    const [isEnd, setIsEnd] = React.useState<boolean>(false);
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
    return (
        <div className="w-full !mb-5">
            <div className="relative w-full !mb-5 flex items-center justify-between">
                <div className="inline-block font-bold text-primary text-3xl oswald-font uppercase leading-12 !pb-2 !pr-4">Sản phẩm liên quan</div>
                <div className="h-1 w-22 absolute bottom-0 left-0 bg-[#a2ff00] [clip-path:polygon(0%_0%,100%_0%,95%_100%,0%_100%)]" />
                <div className="flex gap-2">
                    <button
                        className={classNames("!bg-white !py-1.5 !px-1 !text-center hover:!bg-[#77e322] !border-[1.5px] !border-[#333] cursor-pointer", {
                            "!opacity-30 hover:!bg-transparent !cursor-not-allowed": isStart,
                        })}
                        onClick={onPreviousItemClick}
                    >
                        <IoIosArrowBack className="max-sm:!text-lg !text-2xl !text-[#333] drop-shadow-md" />
                    </button>
                    <button
                        className={classNames("!bg-white !p-1.5 !px-1 !text-center hover:!bg-[#77e322] !border-[1.5px] !border-[#333] cursor-pointer", {
                            "!opacity-30 hover:!bg-transparent !cursor-not-allowed": isEnd,
                        })}
                        onClick={onNextItemClick}
                    >
                        <IoIosArrowForward className="max-sm:!text-lg !text-2xl !text-[#333] drop-shadow-md" />
                    </button>
                </div>
            </div>
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                spaceBetween={16}
                slidesPerView={5}
                navigation={{
                    nextEl: ".custom-next",
                    prevEl: ".custom-prev",
                }}
                className="product-image-list"
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                    setIsStart(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
            >
                {Array.from({ length: 6 }).map((_, idx) => (
                    <SwiperSlide key={idx}>
                        <ProductItem />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export { RelatedProductList };
