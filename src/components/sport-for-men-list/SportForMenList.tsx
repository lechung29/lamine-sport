/** @format */

import { FLASH_SALE_BG } from "@/constants";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import React, { useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { classNames } from "@/utils";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { GoArrowRight } from "react-icons/go";
import { useImmerState } from "@/hooks";
import type { Swiper as SwiperInstance } from "swiper";
import { ProductItem } from "../product-item";
import "./SportForMenList.scss";
import { IProductInfo, IResponseStatus, ProductGender } from "@/types";
import { ProductService } from "@/services";
import { BaseButton, Box, Container, Text } from "../elements";
import { Empty, Flex, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";

interface ISportForMenListState {
    isStart: boolean;
    isEnd: boolean;
    products: IProductInfo[];
    isLoading: boolean;
}

interface IListProps {
    setHidden: (value: boolean) => void;
}

const initialState: ISportForMenListState = {
    isStart: true,
    isEnd: false,
    products: [],
    isLoading: false,
};

const SportForMenList: React.FunctionComponent<IListProps> = (props) => {
    const [state, setState] = useImmerState<ISportForMenListState>(initialState);
    const { isStart, isEnd, products, isLoading } = state;
    const navigate = useNavigate();
    const swiperRef = useRef<SwiperInstance | null>(null);

    const updateNavigationState = (swiper: SwiperInstance) => {
        setState({ isStart: swiper.isBeginning, isEnd: swiper.isEnd });
    };

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

    React.useEffect(() => {
        const getTopSaleProductByGender = async () => {
            setState({ isLoading: true });
            const data = await ProductService.getTopSaleProductByGender(ProductGender.Male);
            setState({ isLoading: false });
            if (data.status === IResponseStatus.Error) {
                setState({ products: [] });
                props.setHidden(false);
            } else {
                setState({ products: data.data });
                props.setHidden(!data.data?.length);
                if (swiperRef.current) {
                    setTimeout(() => {
                        updateNavigationState(swiperRef.current as SwiperInstance);
                    }, 0);
                }
            }
        };
        getTopSaleProductByGender();
    }, []);

    const navigateToProduct = () => navigate(`/products?gender=${ProductGender.Male}`);

    return (
        <Container bgColor="#002d3a" padding={[30, 0, 30, 0]} className="!bg-no-repeat !bg-center !bg-cover w-full" style={{ backgroundImage: `url(${FLASH_SALE_BG})` }}>
            <Flex justify="space-between" className="w-full !px-4 sm:!px-8 lg:!px-[45px] flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-3">
                <Flex vertical wrap justify="center" className="w-full lg:w-auto lg:max-w-[280px] lg:shrink-0">
                    <Text
                        textTransform="uppercase"
                        size="4xl"
                        padding={[0, 0, 8, 0]}
                        fontWeight="semibold"
                        className="!text-white hover:!text-[#a2ff00] oswald-font cursor-pointer"
                        titleText={"Thể thao cho nam"}
                    />
                    <Box margin={[0, 0, 16, 0]} bgColor="#a2ff00" className="h-1 w-22 [clip-path:polygon(0%_0%,100%_0%,95%_100%,0%_100%)]" />

                    <Flex className="w-full flex-col items-start !mb-5 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start">
                        <Flex align="center" gap={8} className="!mt-4 sm:!mt-0 lg:!mt-5">
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
                    <Box
                        margin={[16, 0, 0, 0]}
                        padding={[8, 8, 8, 8]}
                        onClick={navigateToProduct}
                        className="lg:flex hidden w-[150px] items-center justify-center gap-1 !text-white !bg-[#002932] transition-colors duration-300 hover:!bg-[#77e322] hover:!text-[black] [clip-path:polygon(3%_0%,100%_0%,97%_100%,0%_100%)] cursor-pointer"
                    >
                        <Text as="span" fontWeight="semibold" size="base" titleText="Xem tất cả" />
                        <GoArrowRight />
                    </Box>
                </Flex>
                {isLoading && (
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation, EffectFade]}
                        spaceBetween={12}
                        slidesPerView={"auto"}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                            updateNavigationState(swiper);
                        }}
                        onRealIndexChange={updateNavigationState}
                        onSlideChange={updateNavigationState}
                        className="g-sport-for-men-section flex-1 cursor-grabbing"
                    >
                        {Array.from({ length: 6 }).map((_, id) => (
                            <SwiperSlide key={id}>
                                <Flex vertical className="!p-2 !h-100 bg-white !shadow-sm">
                                    <Skeleton.Node active style={{ width: "100%", height: 160, marginBottom: 16 }} />
                                    <Skeleton key={id} active paragraph={{ rows: 3 }} />
                                </Flex>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
                {!isLoading &&
                    (products.length > 0 ? (
                        <Swiper
                            modules={[Autoplay, Pagination, Navigation, EffectFade]}
                            spaceBetween={12}
                            slidesPerView={"auto"}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                                updateNavigationState(swiper);
                            }}
                            onRealIndexChange={updateNavigationState}
                            onSlideChange={updateNavigationState}
                            className="g-sport-for-men-section flex-1 cursor-grabbing"
                        >
                            {products.map((item) => (
                                <SwiperSlide key={item._id}>
                                    <ProductItem productItem={item} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <Box className="w-full hidden min-[800px]:flex min-[800px]:justify-center">
                            <Empty
                                styles={{
                                    description: {
                                        color: "white",
                                    },
                                }}
                                description="Không có sản phẩm nào phù hợp"
                            />
                        </Box>
                    ))}
                <Flex align="center" justify="center" className="w-full lg:!hidden">
                    <Flex
                        align="center"
                        justify="center"
                        gap={4}
                        onClick={navigateToProduct}
                        className="w-[150px] !mt-4 !text-white !bg-[#002932] !px-2 !py-2 transition-colors duration-300 hover:!bg-[#77e322] hover:!text-[black] [clip-path:polygon(3%_0%,100%_0%,97%_100%,0%_100%)] cursor-pointer"
                    >
                        <Text as="span" fontWeight="semibold" size="base" titleText="Xem tất cả" />
                        <GoArrowRight />
                    </Flex>
                </Flex>
            </Flex>
        </Container>
    );
};

export { SportForMenList };
