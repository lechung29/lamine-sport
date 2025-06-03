/** @format */

import { FLASH_SALE_BG } from "@/constants";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import React, { useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { CountdownTimer } from "../countdown-timer";
import { classNames } from "@/utils";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { GoArrowRight } from "react-icons/go";
import { useImmerState } from "@/hooks";
import type { Swiper as SwiperInstance } from "swiper";
import { ProductItem } from "../product-item";

interface IFlashSaleListState {
    isStart: boolean;
    isEnd: boolean;
}

const initialState: IFlashSaleListState = {
    isStart: true,
    isEnd: false,
};

const FlashSaleList: React.FC = () => {
    const [state, setState] = useImmerState<IFlashSaleListState>(initialState);
    const { isStart, isEnd } = state;
    const swiperRef = useRef<SwiperInstance | null>(null);
    const targetDate = new Date("2026-01-01T00:00:00");

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
        <div className="!bg-[#002d3a] !py-7.5 !bg-no-repeat !bg-center !bg-cover w-full h-[480px]" style={{ backgroundImage: `url(${FLASH_SALE_BG})` }}>
            <div className="w-full h-full !px-[45px] flex items-center justify-between gap-3">
                <div className="flex flex-col flex-wrap justify-center !px-[10px] min-lg:!max-w-2/9">
                    <div className="!text-white hover:!text-[#a2ff00] uppercase font-semibold oswald-font text-[32px] !pb-2 cursor-pointer">'Bão Deal' giảm giá</div>
                    <div className=" h-1 w-22 !mb-4 bg-[#a2ff00] [clip-path:polygon(0%_0%,100%_0%,95%_100%,0%_100%)]" />
                    <div className="!text-white text-lg font-semibold">Chương trình sẽ kết thúc sau:</div>
                    <div className="w-full !py-1 !mb-5">
                        <CountdownTimer targetDate={targetDate} />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 !mb-5">
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
                    <div className="w-[150px] !mt-4 flex items-center justify-center gap-1 !text-white !bg-[#002932] !px-2 !py-2 transition-colors duration-300 hover:!bg-[#77e322] hover:!text-[black] [clip-path:polygon(3%_0%,100%_0%,97%_100%,0%_100%)] cursor-pointer">
                        <span className="font-semibold text-[16px]">Xem tất cả</span>
                        <GoArrowRight />
                    </div>
                </div>
                <Swiper
                    modules={[Autoplay, Pagination, Navigation, EffectFade]}
                    spaceBetween={12}
                    slidesPerView={4}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    className="g-sport-list-section flex-1 cursor-grabbing"
                >
                    {Array.from({ length: 12 }).map((_item, index) => (
                        <SwiperSlide key={index}>
                            <ProductItem />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export { FlashSaleList };
