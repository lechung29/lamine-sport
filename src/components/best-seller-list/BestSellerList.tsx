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
import { classNames, sportTypeByCategoryOptions } from "@/utils";
import { ProductItem } from "../product-item";
import { GoArrowRight } from "react-icons/go";
import { IProductInfo, IResponseStatus } from "@/types";
import { ProductService } from "@/services";
import { Box, Container, Text } from "../elements";
import { Empty, Flex, Skeleton } from "antd";
import { xor } from "lodash";
import { useNavigate } from "react-router-dom";

const BestSellerList: React.FC = () => {
    const [isStart, setIsStart] = React.useState<boolean>(true);
    const [isEnd, setIsEnd] = React.useState<boolean>(false);
    const [bestSellerList, setBestSellerList] = React.useState<IProductInfo[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [selectedSportTypeItem, setSelectedSportTypeItem] = React.useState<number[]>([]);
    const swiperRef = React.useRef<SwiperInstance | null>(null);
    const navigate = useNavigate();

    const navigateToProduct = () => navigate("/products");

    const getBestSellerProducts = async () => {
        try {
            setIsLoading(true);
            const result = await ProductService.getBestSellerProducts({ filters: { sportTypes: selectedSportTypeItem } });
            if (result.status === IResponseStatus.Success) {
                setBestSellerList(result.data || []);
            }
        } catch (error) {
            setBestSellerList([]);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        getBestSellerProducts();
    }, [selectedSportTypeItem]);

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

    const updateNavigationState = (swiper: SwiperInstance) => {
        setIsStart(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };
    return (
        <Container padding={[0, 0, 20, 0]} className="w-full">
            <Box padding={[0, 0, 20, 0]} className="w-full relative flex flex-col items-start lg:flex-row lg:items-center lg:justify-between">
                <Box className="relative inline-block">
                    <Text
                        color="#333"
                        size="3xl"
                        fontWeight="bold"
                        textTransform="uppercase"
                        className="oswald-font leading-12 lg:whitespace-nowrap"
                        padding={[0, 8, 16, 0]}
                        titleText="Top sản phẩm bán chạy"
                    />
                    <Box className="h-1 w-22 absolute bottom-0 left-0 bg-[#a2ff00] [clip-path:polygon(0%_0%,100%_0%,95%_100%,0%_100%)]" />
                </Box>

                <Flex align="center" justify="center" className="w-full relative overflow-hidden !mt-4 lg:flex-1 lg:w-auto lg:mt-0">
                    <Box className={classNames("bg-transparent cursor-pointer group shrink-0", { "!cursor-not-allowed": isStart })} onClick={onPreviousItemClick}>
                        <BsArrowLeft className={classNames("text-2xl group-hover:text-[#a2ff00]", { "group-hover:text-gray-400": isStart })} />
                    </Box>
                    <Box margin={[0, 8, 0, 8]} className="relative flex-1 overflow-hidden">
                        <Box className="pointer-events-none absolute top-0 left-0 z-10 h-full w-10 bg-gradient-to-r from-white via-white/40 to-transparent" />
                        <Box className="pointer-events-none absolute top-0 right-0 z-10 h-full w-10 bg-gradient-to-l from-white via-white/40 to-transparent" />
                        <Swiper
                            modules={[Autoplay, Pagination, Navigation, EffectFade]}
                            spaceBetween={10}
                            slidesPerView={"auto"}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                                updateNavigationState(swiper);
                            }}
                            onRealIndexChange={updateNavigationState}
                            onSlideChange={updateNavigationState}
                            className="g-sport-filter-list-section"
                        >
                            {sportTypeByCategoryOptions.map((item) => (
                                <SwiperSlide key={item.label}>
                                    <SportTypeFilterItem
                                        className={xor(selectedSportTypeItem, item.value).length === 0 ? "!bg-[#002932] !text-white" : ""}
                                        text={item.label}
                                        onClick={() => setSelectedSportTypeItem(item.value)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Box>

                    <Box className={classNames("bg-transparent cursor-pointer group shrink-0", { "!cursor-not-allowed": isEnd })} onClick={onNextItemClick}>
                        <BsArrowRight className={classNames("text-2xl group-hover:text-[#a2ff00]", { "group-hover:text-gray-400": isEnd })} />
                    </Box>
                </Flex>
            </Box>

            {isLoading && (
                <Box className="hidden min-[800px]:grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                    <React.Fragment>
                        {Array.from({ length: 10 }).map((_, id) => (
                            <Flex key={id} vertical className="!p-2 w-55 !h-100 bg-white !shadow-sm">
                                <Skeleton.Node active style={{ width: "100%", height: 160, marginBottom: 16 }} />
                                <Skeleton key={id} active paragraph={{ rows: 3 }} />
                            </Flex>
                        ))}
                    </React.Fragment>
                </Box>
            )}

            {!isLoading &&
                (bestSellerList.length > 0 ? (
                    <Box className="hidden min-[800px]:grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                        {bestSellerList.map((product) => (
                            <ProductItem key={product._id} productItem={product} />
                        ))}
                    </Box>
                ) : (
                    <Box className="w-full hidden min-[800px]:flex min-[800px]:justify-center">
                        <Empty description="Không có sản phẩm nào phù hợp" />
                    </Box>
                ))}

            {isLoading && (
                <Box className="min-[800px]:hidden flex flex-row overflow-x-auto gap-4 pr-4 !pb-3 custom-scrollbar">
                    <React.Fragment>
                        {Array.from({ length: 10 }).map((_, id) => (
                            <Flex key={id} vertical className="!p-2 w-55 !h-100 bg-white !shadow-sm">
                                <Skeleton.Node active style={{ width: "100%", height: 160, marginBottom: 16 }} />
                                <Skeleton key={id} active paragraph={{ rows: 3 }} />
                            </Flex>
                        ))}
                    </React.Fragment>
                </Box>
            )}

            {!isLoading &&
                (bestSellerList.length > 0 ? (
                    <Box className="min-[800px]:hidden flex flex-row overflow-x-auto gap-4 pr-4 !pb-3 custom-scrollbar">
                        {bestSellerList.map((product) => (
                            <Box margin={[0, 0, 16, 0]} key={product._id} className="flex-shrink-0 w-[220px]">
                                <ProductItem productItem={product} />
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box className="min-[800px]:hidden flex justify-center">
                        <Empty description="Không có sản phẩm nào phù hợp" />
                    </Box>
                ))}

            {!isLoading && bestSellerList.length > 0 && (
                <Flex align="center" justify="center" className="w-full !mt-4">
                    <Flex
                        align="center"
                        justify="center"
                        gap={4}
                        onClick={navigateToProduct}
                        className="w-[150px] !mt-4 !text-white !bg-[#002932] !px-2 !py-2 transition-colors duration-300 hover:!bg-[#77e322] hover:!text-[black] [clip-path:polygon(5%_0%,100%_0%,95%_100%,0%_100%)] cursor-pointer"
                    >
                        <Text as="span" fontWeight="semibold" size="base" titleText="Xem tất cả" />
                        <GoArrowRight />
                    </Flex>
                </Flex>
            )}
        </Container>
    );
};

export { BestSellerList };
