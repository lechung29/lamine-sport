/** @format */

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import React from "react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "./index.scss";
import { GoArrowRight } from "react-icons/go";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const images = ["/src/assets/slider_1.webp", "/src/assets/slider_2.webp"];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
};

const Carousel: React.FC = () => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    return (
        <div className="relative w-full group overflow-hidden">
            <button className="!text-white !bg-[#002932] max-[480px]:hidden absolute top-1/2 -left-10 group-hover:left-4 transition-all ease-in-out z-10 transform -translate-y-1/2 !py-0.5 !pr-1 duration-400 hover:!bg-[#77e322] hover:!text-[#333] [clip-path:polygon(0%_0%,85%_0%,100%_100%,0%_100%)] cursor-pointer custom-prev">
                <IoIosArrowBack className="max-sm:!text-lg !text-3xl text-white drop-shadow-md" />
            </button>
            <button className="!text-white !bg-[#002932] max-[480px]:hidden absolute top-1/2 -right-10 group-hover:right-4 transition-all ease-in-out z-10 transform -translate-y-1/2 !py-0.5 !pl-1 duration-400 hover:!bg-[#77e322] hover:!text-[#333] [clip-path:polygon(0%_0%,100%_0%,100%_100%,15%_100%)] cursor-pointer custom-next">
                <IoIosArrowForward className="max-sm:!text-lg !text-3xl text-white drop-shadow-md" />
            </button>

            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                spaceBetween={30}
                centeredSlides
                allowTouchMove={false}
                simulateTouch={false}
                autoplay={{ delay: 6000 }}
                pagination={{ clickable: true }}
                navigation={{
                    nextEl: ".custom-next",
                    prevEl: ".custom-prev",
                }}
                loop
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={1500}
                className="mySwiper"
                onSlideChange={(swiper) => {
                    setActiveIndex(swiper.realIndex);
                }}
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full aspect-[16/6] max-[480px]:aspect-[1/1] bg-cover bg-center" style={{ backgroundImage: `url(${img})` }}>
                            <div className="absolute inset-0 bg-black/50 min-[480px]:!hidden z-10 pointer-events-none" />
                            {activeIndex === index && (
                                <motion.div
                                    key={index}
                                    className="absolute top-4/9 left-[7%] -translate-y-1/2 z-20 max-[480px]:!text-white text-[#333]"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <motion.div className="!text-[clamp(12px,2vw,1.2rem)] max-[480px]:!text-[clamp(1rem,4.5vw,1.5rem)] uppercase !font-bold" variants={itemVariants}>
                                        Hot deal
                                    </motion.div>
                                    <motion.div
                                        className="!text-[clamp(18px,3.6vw,10rem)] max-[480px]:!text-[clamp(20px,8.5vw,10rem)] oswald-font uppercase !font-black"
                                        variants={itemVariants}
                                        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.4)" }}
                                    >
                                        Càng mua càng giảm
                                    </motion.div>
                                    <motion.div className="!text-[clamp(10px,1.8vw,1.2rem)] max-[480px]:!text-[clamp(14px,3.5vw,1.2rem)] font-medium" variants={itemVariants}>
                                        Thời gian: 1/10 - 15/10
                                    </motion.div>
                                    <motion.div
                                        className="!mt-7 inline-flex items-center justify-center gap-1 !text-white !bg-[#002932] !px-[clamp(12px,1vw,16px)] max-[480px]:!px-[clamp(16px,3vw,24px)] !py-[clamp(4px,1vw,8px)] max-[480px]:!py-[clamp(6px,3vw,12px)] transition-colors duration-300 hover:!bg-[#77e322] hover:!text-[black] [clip-path:polygon(5%_0%,100%_0%,95%_100%,0%_100%)] cursor-pointer"
                                        variants={itemVariants}
                                    >
                                        <span className="font-semibold !text-[clamp(8px,1.3vw,1.3rem)] max-[480px]:!text-[clamp(12px,1.3vw,1.3rem)]">Xem chi tiết</span>
                                        <GoArrowRight />
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export { Carousel };
