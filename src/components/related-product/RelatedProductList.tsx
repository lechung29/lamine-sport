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
import "./RelatedProductList.scss";
import { IProductInfo } from "@/types";
import { Box, Text } from "../elements";
import { Flex } from "antd";

interface IRelatedProductListProps {
    relatedProducts: IProductInfo[];
}

const RelatedProductList: React.FunctionComponent<IRelatedProductListProps> = (props) => {
    const { relatedProducts } = props;
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
    return relatedProducts.length > 0 ? (
        <Box margin={[0, 0, 40, 0]} className="w-full">
            <Flex align="center" justify="space-between" className="relative w-full !mb-5">
                <Text fontWeight="bold" size="3xl" textTransform="uppercase" padding={[0, 16, 8, 0]} className="inline-block text-primary oswald-font leading-12" titleText="Sản phẩm liên quan" />
                <Box className="h-1 w-22 absolute bottom-0 left-0 bg-[#a2ff00] [clip-path:polygon(0%_0%,100%_0%,95%_100%,0%_100%)]" />
                <Flex gap={8}>
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
                </Flex>
            </Flex>
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                spaceBetween={16}
                breakpoints={{
                    0: {
                        slidesPerView: "auto",
                        freeMode: true,
                    },
                    1024: {
                        slidesPerView: 5,
                        freeMode: false,
                    },
                }}
                className="product-image-list custom-scrollbar"
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                    setIsStart(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
            >
                {relatedProducts.map((item) => (
                    <SwiperSlide key={item._id} className="!w-50">
                        <ProductItem productItem={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    ) : null;
};

export { RelatedProductList };
