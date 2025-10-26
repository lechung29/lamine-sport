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
import { classNames, sportTypeOptions } from "@/utils";
import { BaseButton, Box, Container } from "../elements";
import { Flex } from "antd";
import { IProductCountBySportType, IResponseStatus } from "@/types";
import { ProductService } from "@/services";

interface ISportListState {
    isStart: boolean;
    isEnd: boolean;
    productCountBySportTypeList: IProductCountBySportType[];
}

const initialState: ISportListState = {
    isStart: true,
    isEnd: false,
    productCountBySportTypeList: [],
};

const SportTypeCarousel: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<ISportListState>(initialState);
    const { isStart, isEnd, productCountBySportTypeList } = state;
    const swiperRef = useRef<SwiperInstance | null>(null);

    const updateNavigationState = (swiper: SwiperInstance) => {
        setState({ isStart: swiper.isBeginning, isEnd: swiper.isEnd });
    };

    const onNextItemClick = (): void => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    const onPreviousItemClick = (): void => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const handleSlideChange = (swiper: SwiperInstance): void => {
        setState({
            isStart: swiper.isBeginning,
            isEnd: swiper.isEnd,
        });
    };

    React.useEffect(() => {
        const getProductCount = async () => {
            const data = await ProductService.getProductCountBySportType();
            if (data.status === IResponseStatus.Error) {
                setState({ productCountBySportTypeList: [] });
            } else {
                setState({ productCountBySportTypeList: data.data });
            }
        };

        getProductCount();
    }, []);

    const mappedList = React.useMemo(() => {
        let finalList: any = [];
        sportTypeOptions.forEach((option) => {
            const mappedItem = productCountBySportTypeList.find((item) => item.value === option.value);
            finalList.push({
                ...option,
                productCount: mappedItem?.productCount,
            });
        });
        return finalList;
    }, [productCountBySportTypeList]);

    return (
        <Container className="w-full">
            <Flex className="w-full !mb-6" align="center" justify="space-between">
                <Box bgColor="#a2ff00" className="h-1 w-22 [clip-path:polygon(0%_0%,100%_0%,95%_100%,0%_100%)]" />
                <Flex align="center" justify="center" gap={8}>
                    <BaseButton
                        className={classNames("!bg-white !py-1.5 !px-1 !text-center hover:!bg-[#77e322] !border-[1.5px] !border-[#333] cursor-pointer transition-all duration-200", {
                            "!opacity-30 hover:!bg-transparent !cursor-not-allowed": isStart,
                        })}
                        onClick={onPreviousItemClick}
                        disabled={isStart}
                        displayText={<IoIosArrowBack className="max-sm:text-lg text-2xl text-[#333] !drop-shadow-md" />}
                    />

                    <BaseButton
                        className={classNames("!bg-white !p-1.5 !px-1 !text-center hover:!bg-[#77e322] !border-[1.5px] !border-[#333] cursor-pointer transition-all duration-200", {
                            "!opacity-30 hover:!bg-transparent !cursor-not-allowed": isEnd,
                        })}
                        onClick={onNextItemClick}
                        disabled={isEnd}
                        displayText={<IoIosArrowForward className="max-sm:text-lg text-2xl text-[#333] !drop-shadow-md" />}
                    />
                </Flex>
            </Flex>
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                spaceBetween={16}
                slidesPerView="auto"
                slidesPerGroup={1}
                breakpoints={{
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 12,
                        slidesPerGroup: 2,
                    },
                    480: {
                        slidesPerView: 3,
                        spaceBetween: 14,
                        slidesPerGroup: 3,
                    },
                    640: {
                        slidesPerView: 4,
                        spaceBetween: 16,
                        slidesPerGroup: 4,
                    },
                    768: {
                        slidesPerView: 5,
                        spaceBetween: 16,
                        slidesPerGroup: 5,
                    },
                    1024: {
                        slidesPerView: 6,
                        spaceBetween: 18,
                        slidesPerGroup: 6,
                    },
                    1280: {
                        slidesPerView: 7,
                        spaceBetween: 20,
                        slidesPerGroup: 7,
                    },
                    1536: {
                        slidesPerView: 8,
                        spaceBetween: 20,
                        slidesPerGroup: 8,
                    },
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    updateNavigationState(swiper);
                }}
                onRealIndexChange={updateNavigationState}
                onSlideChange={handleSlideChange}
                className="g-sport-list-section"
            >
                {mappedList.map((item) => (
                    <SwiperSlide key={item.value}>
                        <SportTypeItem label={item?.label} value={item?.value} imgSrc={item?.imageUrl} productCount={item?.productCount} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Container>
    );
};

export { SportTypeCarousel };
