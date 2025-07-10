/** @format */

import { FEEDBACK_BG } from "@/constants";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import type { Swiper as SwiperInstance } from "swiper";
import { classNames } from "@/utils";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FeedbackItem } from "../feedback-item";

const CustomerFeedbackList: React.FC = () => {
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
        <div className="!bg-[#002d3a] !py-7.5 !bg-no-repeat !bg-center !bg-cover w-full" style={{ backgroundImage: `url(${FEEDBACK_BG})` }}>
            <div className="w-full h-full !px-[45px]">
                <div className="w-full !mb-5 relative flex items-center justify-between">
                    <div className="inline-block font-bold text-white text-3xl oswald-font uppercase leading-12 !pb-2 !pr-4">Khách hàng nói về chúng tôi</div>
                    <div className="h-1 w-22 absolute bottom-0 left-0 bg-[#a2ff00] [clip-path:polygon(0%_0%,100%_0%,95%_100%,0%_100%)]" />
                </div>
                <div className="w-full !mb-6 flex items-center justify-between">
                    <div className="text-white text-xl overflow-hidden text-ellipsis whitespace-nowrap">
                        Hơn +50,000 khách hàng đang sử dụng cảm nhận như thế nào về Lamine Sport - Thời trang, phụ kiện thể thao.
                    </div>
                    <div className="flex gap-2">
                        <div
                            className={classNames("bg-white cursor-pointer !px-1 !py-1.5 group hover:bg-[#a2ff00] transition-all duration-300 [clip-path:polygon(0%_0%,85%_0%,100%_100%,0%_100%)]", {
                                "!cursor-not-allowed !bg-[#656460] hover:!bg-[#656460]": isStart,
                            })}
                            onClick={onPreviousItemClick}
                        >
                            <IoIosArrowBack className={classNames("text-2xl !text-[#333] group-hover:text-[#a2ff00]", { "group-hover:!text-[#333]": isStart })} />
                        </div>
                        <div
                            className={classNames("bg-white cursor-pointer !px-1 !py-1.5 group hover:bg-[#a2ff00] transition-all duration-300 [clip-path:polygon(0%_0%,100%_0%,100%_100%,15%_100%)]", {
                                "!cursor-not-allowed !bg-[#656460] hover:!bg-[#656460]": isEnd,
                            })}
                            onClick={onNextItemClick}
                        >
                            <IoIosArrowForward className={classNames("text-2xl !text-[#333] group-hover:text-[#a2ff00]", { "group-hover:!text-[#333]": isEnd })} />
                        </div>
                    </div>
                </div>
                <Swiper
                    modules={[Autoplay, Pagination, Navigation, EffectFade]}
                    spaceBetween={12}
                    slidesPerView={2}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    className="g-flash-sale-section cursor-grab"
                >
                    {Array.from({ length: 12 }).map((_item, index) => (
                        <SwiperSlide key={index}>
                            <FeedbackItem />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export { CustomerFeedbackList };
