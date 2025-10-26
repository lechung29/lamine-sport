/** @format */

import { BestSellerList, Box, Carousel, Container, CustomerFeedbackList, FlashSaleList, SportForMenList, SportForWomenList, SportTypeCarousel } from "@/components";
import React from "react";

const Home: React.FunctionComponent = () => {
    const [isHiddenFlashSale, setIsHiddenFlashSale] = React.useState<boolean>(false);
    const [isHiddenMenList, setIsHiddenMenList] = React.useState<boolean>(false);
    const [isHiddenWomenList, setIsHiddenWomenList] = React.useState<boolean>(false);
    return (
        <Container bgColor="transparent" className="w-full">
            <Box margin={[0, 0, 30, 0]}>
                <Carousel />
            </Box>
            <Box className="w-full !px-8 md:!px-[45px] !py-7.5">
                <SportTypeCarousel />
            </Box>
            {!isHiddenFlashSale && (
                <Box className="w-full !py-7.5">
                    <FlashSaleList setHidden={setIsHiddenFlashSale} />
                </Box>
            )}
            <Box className="w-full !px-8 md:!px-[45px] !py-7.5">
                <BestSellerList />
            </Box>
            {!isHiddenMenList && (
                <Box className="w-full !py-7.5">
                    <SportForMenList setHidden={setIsHiddenMenList} />
                </Box>
            )}
            {!isHiddenWomenList && (
                <Box className="w-full !py-7.5">
                    <SportForWomenList setHidden={setIsHiddenWomenList} />
                </Box>
            )}
            <Box className="w-full !py-7.5">
                <CustomerFeedbackList />
            </Box>
        </Container>
    );
};

export { Home };
