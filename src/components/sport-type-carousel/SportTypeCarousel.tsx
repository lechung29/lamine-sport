/** @format */

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import React, { useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "./index.scss";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { SportTypeItem } from "../sport-type-item";
import type { Swiper as SwiperInstance } from "swiper";
import { useImmerState } from "@/hooks";
import { classNames } from "@/utils";

interface ISportListState {
    isStart: boolean;
    isEnd: boolean;
}

const initialState: ISportListState = {
    isStart: true,
    isEnd: false,
};

const SportTypeCarousel: React.FC = () => {
    const [state, setState] = useImmerState<ISportListState>(initialState);
    const { isStart, isEnd } = state;
    const swiperRef = useRef<SwiperInstance | null>(null);

    const onNextItemClick = (): void => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
            setState({ isStart: false });
            if (swiperRef.current.isEnd) {
                setState({ isEnd: true });
            }
        }
    };

    const onPreviousItemClick = (): void => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
            setState({ isEnd: false });
            if (swiperRef.current.isBeginning) {
                setState({ isStart: true });
            }
        }
    };
    return (
        <div className="w-full">
            <div className="w-full !mb-6 flex items-center justify-between">
                <div className=" h-1 w-22 bg-[#a2ff00] [clip-path:polygon(0%_0%,100%_0%,95%_100%,0%_100%)]" />
                <div className="flex items-center justify-center gap-2">
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
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                spaceBetween={12}
                slidesPerView={8}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                className="g-sport-list-section"
            >
                {Array.from({ length: 12 }).map((_item, index) => (
                    <SwiperSlide key={index}>
                        <SportTypeItem />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export { SportTypeCarousel };
