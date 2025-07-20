/** @format */

import React from "react";
import { PhotoView } from "react-photo-view";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { classNames } from "@/utils";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "./ProductPhotoView.scss";

interface IProductItemPhotoProps {
    photoList: string[];
}
const ProductPhotoView: React.FunctionComponent<IProductItemPhotoProps> = (props) => {
    const [currentPhoto, setCurrentPhoto] = React.useState<string>(props.photoList[0] ?? "");
    const [slidesToShow, setSlidesToShow] = React.useState<number>(5);
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

    React.useEffect(() => {
        const updateSlides = () => {
            const width = window.innerWidth;

            if (width < 1024) {
                setSlidesToShow(Math.min(4, props.photoList.length));
            } else {
                setSlidesToShow(Math.min(5, props.photoList.length));
            }
        };

        updateSlides();
        window.addEventListener("resize", updateSlides);
        return () => window.removeEventListener("resize", updateSlides);
    }, [props.photoList]);

    return (
        <div className="w-full z-10">
            <PhotoView src={currentPhoto}>
                <img className="w-full cursor-pointer" src={currentPhoto} alt="photo-product" />
            </PhotoView>
            <div className="w-full !mt-2 relative">
                <button
                    className={classNames("absolute top-1/2 -translate-y-1/2 z-10 left-0 !bg-[#002d3a] !p-0.5 !text-center hover:!bg-[#77e322] cursor-pointer custom-prev", {
                        hidden: isStart || props.photoList.length <= slidesToShow,
                    })}
                    onClick={onPreviousItemClick}
                >
                    <IoIosArrowBack className="max-sm:!text-sm !text-lg !text-white drop-shadow-md" />
                </button>
                <button
                    className={classNames("absolute top-1/2 -translate-y-1/2 z-10 right-0 !bg-[#002d3a] !p-0.5 !text-center hover:!bg-[#77e322] cursor-pointer custom-next", {
                        hidden: isEnd || props.photoList.length <= slidesToShow,
                    })}
                    onClick={onNextItemClick}
                >
                    <IoIosArrowForward className="max-sm:!text-sm !text-lg !text-white drop-shadow-md" />
                </button>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                    spaceBetween={16}
                    slidesPerView={slidesToShow}
                    navigation={{
                        nextEl: ".custom-next",
                        prevEl: ".custom-prev",
                    }}
                    className="product-image-list"
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    onSlideChange={(swiper) => {
                        setIsStart(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                >
                    {props.photoList.map((photo, idx) => (
                        <SwiperSlide className="!mr-[15.8px]" key={idx}>
                            <img
                                src={photo}
                                alt={`thumbnail-${idx}`}
                                onClick={() => setCurrentPhoto(photo)}
                                className={`cursor-pointer !border transition-all duration-200 
                                ${photo === currentPhoto ? "!border-[#77e322]" : "!border-[#f1f1f1]"}`}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export { ProductPhotoView };
