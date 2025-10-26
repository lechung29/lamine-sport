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
import { IResponseStatus, IReview } from "@/types";
import { ReviewService } from "@/services";
import { Box, Container, Text } from "../elements";
import { Flex } from "antd";
const CustomerFeedbackList: React.FunctionComponent = () => {
    const [isStart, setIsStart] = React.useState<boolean>(true);
    const [isEnd, setIsEnd] = React.useState<boolean>(false);
    const [feedbackList, setFeedbackList] = React.useState<IReview[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const swiperRef = React.useRef<SwiperInstance | null>(null);

    const getPinReviews = async () => {
        try {
            setIsLoading(true);
            const result = await ReviewService.getPinReviews();
            if (result.status === IResponseStatus.Success) {
                setFeedbackList(result.data || []);
            }
        } catch (error) {
            setFeedbackList([]);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        getPinReviews();
    }, []);

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
        !isLoading && feedbackList.length > 0 && (
            <Container bgColor="#002d3a" padding={[30, 0, 30, 0]} className="bg-no-repeat bg-center bg-cover w-full" style={{ backgroundImage: `url(${FEEDBACK_BG})` }}>
                <Box padding={[0, 45, 0, 45]} className="w-full h-full !px-[45px]">
                    <Flex align="center" justify="space-between" className="w-full !mb-5 relative">
                        <Text
                            className="inline-block oswald-font leading-12"
                            fontWeight="bold"
                            color="white"
                            size="3xl"
                            textTransform="uppercase"
                            padding={[0, 14, 8, 0]}
                            titleText="Khách hàng nói về chúng tôi"
                        />
                        <Box className="h-1 w-22 absolute bottom-0 left-0 bg-[#a2ff00] [clip-path:polygon(0%_0%,100%_0%,95%_100%,0%_100%)]" />
                    </Flex>
                    <Flex align="center" justify="space-between" className="w-full !mb-6">
                        <Text color="white" className="lg:text-xl text-base" titleText="Hơn +1,000 khách hàng đang sử dụng cảm nhận như thế nào về Lamine Sport - Thời trang, phụ kiện thể thao." />
                        <Box className="min-[860px]:inline-flex hidden gap-2">
                            <Box
                                className={classNames(
                                    "bg-white cursor-pointer !px-1 !py-1.5 group hover:bg-[#a2ff00] transition-all duration-300 [clip-path:polygon(0%_0%,85%_0%,100%_100%,0%_100%)]",
                                    {
                                        "!cursor-not-allowed !bg-[#656460] hover:!bg-[#656460]": isStart,
                                    }
                                )}
                                onClick={onPreviousItemClick}
                            >
                                <IoIosArrowBack className={classNames("text-2xl !text-[#333] group-hover:text-[#a2ff00]", { "group-hover:!text-[#333]": isStart })} />
                            </Box>
                            <Box
                                className={classNames(
                                    "bg-white cursor-pointer !px-1 !py-1.5 group hover:bg-[#a2ff00] transition-all duration-300 [clip-path:polygon(0%_0%,100%_0%,100%_100%,15%_100%)]",
                                    {
                                        "!cursor-not-allowed !bg-[#656460] hover:!bg-[#656460]": isEnd,
                                    }
                                )}
                                onClick={onNextItemClick}
                            >
                                <IoIosArrowForward className={classNames("text-2xl !text-[#333] group-hover:text-[#a2ff00]", { "group-hover:!text-[#333]": isEnd })} />
                            </Box>
                        </Box>
                    </Flex>
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation, EffectFade]}
                        spaceBetween={12}
                        slidesPerView={1}
                        breakpoints={{
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 12,
                            },
                        }}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                            updateNavigationState(swiper)
                        }}
                        onRealIndexChange={updateNavigationState}
                        onSlideChange={updateNavigationState}
                        className="g-customer-feedback-section"
                    >
                        {feedbackList.map((feedbackItem) => (
                            <SwiperSlide key={feedbackItem._id}>
                                <FeedbackItem feedbackItem={feedbackItem} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <Box className="min-[860px]:hidden flex items-center justify-end gap-2 !mt-6">
                        <Box
                            className={classNames("bg-white cursor-pointer !px-1 !py-1.5 group hover:bg-[#a2ff00] transition-all duration-300 [clip-path:polygon(0%_0%,85%_0%,100%_100%,0%_100%)]", {
                                "!cursor-not-allowed !bg-[#656460] hover:!bg-[#656460]": isStart,
                            })}
                            onClick={onPreviousItemClick}
                        >
                            <IoIosArrowBack className={classNames("text-2xl !text-[#333] group-hover:text-[#a2ff00]", { "group-hover:!text-[#333]": isStart })} />
                        </Box>
                        <Box
                            className={classNames("bg-white cursor-pointer !px-1 !py-1.5 group hover:bg-[#a2ff00] transition-all duration-300 [clip-path:polygon(0%_0%,100%_0%,100%_100%,15%_100%)]", {
                                "!cursor-not-allowed !bg-[#656460] hover:!bg-[#656460]": isEnd,
                            })}
                            onClick={onNextItemClick}
                        >
                            <IoIosArrowForward className={classNames("text-2xl !text-[#333] group-hover:text-[#a2ff00]", { "group-hover:!text-[#333]": isEnd })} />
                        </Box>
                    </Box>
                </Box>
            </Container>
        )
    );
};

export { CustomerFeedbackList };
