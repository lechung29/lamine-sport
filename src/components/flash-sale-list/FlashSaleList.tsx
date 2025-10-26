/** @format */

import { FLASH_SALE_BG } from "@/constants";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import React, { useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "./FlashSaleList.scss";
import { CountdownTimer } from "../countdown-timer";
import { classNames } from "@/utils";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { GoArrowRight } from "react-icons/go";
import { useImmerState } from "@/hooks";
import type { Swiper as SwiperInstance } from "swiper";
import { ProductItem } from "../product-item";
import { IDiscountProgram, IProductInfo, IResponseStatus } from "@/types";
import { ProductService } from "@/services";
import { BaseButton, Box, Container, Text } from "../elements";
import { Flex, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";

interface IFlashSaleListState {
    isStart: boolean;
    isEnd: boolean;
    flashSaleProducts: IProductInfo[];
    isLoading: boolean;
    currentProgram: IDiscountProgram | null;
}

interface IListProps {
    setHidden: (value: boolean) => void;
}

const initialState: IFlashSaleListState = {
    isStart: true,
    isEnd: false,
    flashSaleProducts: [],
    isLoading: false,
    currentProgram: null,
};

const FlashSaleList: React.FunctionComponent<IListProps> = (props) => {
    const [state, setState] = useImmerState<IFlashSaleListState>(initialState);
    const { isStart, isEnd, flashSaleProducts, isLoading, currentProgram } = state;
    const swiperRef = useRef<SwiperInstance | null>(null);
    const navigate = useNavigate();

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

    const swiperBreakpoints = {
        0: {
            slidesPerGroup: 1,
        },
        480: {
            slidesPerGroup: 2,
        },
        768: {
            slidesPerGroup: 3,
        },
        1024: {
            slidesPerGroup: 4,
        },
        1280: {
            slidesPerGroup: 4,
        },
    };

    React.useEffect(() => {
        const getTopSaleProduct = async () => {
            setState({ isLoading: true });
            const data = await ProductService.getTopSaleProduct();
            setState({ isLoading: false });
            if (data.status === IResponseStatus.Error) {
                setState({ flashSaleProducts: [] });
                props.setHidden(true);
            } else {
                const startTime = new Date(data.data?.currentProgramInfo?.startDate!);
                const endTime = new Date(data.data?.currentProgramInfo?.endDate!);
                const now = new Date();
                const isInProgress = now > startTime && now < endTime;
                const isHiddenList = !data.data?.topSaleProducts.length || !data.data?.currentProgramInfo || !isInProgress;
                setState({
                    flashSaleProducts: data.data?.topSaleProducts,
                    currentProgram: data.data?.currentProgramInfo,
                });
                props.setHidden(isHiddenList);
                if (swiperRef.current) {
                    setTimeout(() => {
                        updateNavigationState(swiperRef.current as SwiperInstance);
                    }, 0);
                }
            }
        };
        getTopSaleProduct();
    }, []);

    const navigateToProduct = () => navigate("/products");

    return (
        <Container bgColor="#002d3a" padding={[30, 0, 30, 0]} className="!bg-no-repeat !bg-center !bg-cover w-full" style={{ backgroundImage: `url(${FLASH_SALE_BG})` }}>
            <Flex align="flex-start" justify="space-between" className="w-full !px-4 sm:!px-8 lg:!px-[45px] flex-col lg:flex-row gap-6 lg:gap-3">
                {!isLoading && (
                    <Flex vertical wrap justify="center" className="w-full lg:w-auto lg:max-w-[280px] lg:shrink-0">
                        <Text
                            textTransform="uppercase"
                            size="4xl"
                            padding={[0, 0, 8, 0]}
                            fontWeight="semibold"
                            className="!text-white hover:!text-[#a2ff00] oswald-font cursor-pointer"
                            titleText={currentProgram?.programName}
                        />
                        <Box margin={[0, 0, 16, 0]} bgColor="#a2ff00" className="h-1 w-22 [clip-path:polygon(0%_0%,100%_0%,95%_100%,0%_100%)]" />

                        <Flex className="w-full flex-col items-start !mb-5 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start">
                            <Flex className="flex-row max-[500px]:flex-col lg:flex-col items-center max-[500px]:items-start lg:items-start gap-4">
                                <Text color="white" size="lg" fontWeight="semibold" className="truncate" titleText="Chương trình sẽ kết thúc sau:" />
                                <Box padding={[4, 0, 4, 0]}>
                                    <CountdownTimer targetDate={new Date(currentProgram?.endDate!) ?? new Date()} />
                                </Box>
                            </Flex>

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
                )}
                <Swiper
                    modules={[Autoplay, Navigation]}
                    slidesPerView={"auto"}
                    spaceBetween={0}
                    breakpoints={swiperBreakpoints}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        updateNavigationState(swiper);
                    }}
                    onRealIndexChange={updateNavigationState}
                    className="g-flash-sale-section flex-1 cursor-grab"
                >
                    {isLoading ? (
                        <React.Fragment>
                            {Array.from({ length: 6 }).map((_, id) => (
                                <SwiperSlide key={id}>
                                    <Flex vertical className="!p-2 !h-100 bg-white !shadow-sm">
                                        <Skeleton.Node active style={{ width: "100%", height: 160, marginBottom: 16 }} />
                                        <Skeleton key={id} active paragraph={{ rows: 3 }} />
                                    </Flex>
                                </SwiperSlide>
                            ))}
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {flashSaleProducts.map((item) => (
                                <SwiperSlide key={item._id}>
                                    <ProductItem productItem={item} />
                                </SwiperSlide>
                            ))}
                        </React.Fragment>
                    )}
                </Swiper>
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

export { FlashSaleList };
