/** @format */

import { Box, Breadcrumbs, Container, Text } from "@/components";
import React from "react";

const ShopCommitment: React.FunctionComponent = () => {
    return (
        <Container className="w-full min-h-screen">
            <Breadcrumbs />
            <Container className="!px-8 lg:!px-[45px] !py-6">
                <Text margin={[0, 0, 15, 0]} size="lg" fontWeight="bold" textTransform="uppercase" className="text-gray-900" titleText="Cam kết cửa hàng" />
                <Box margin={[0, 0, 16, 0]}>
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="Lamine Sport cam kết tất cả các sản phẩm bán ra tại Lamine Sport đều là sản phẩm chính hãng, và nhận được các chế độ bảo hành chính hãng." />
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="Thời gian bảo hành: 12 tháng hoặc dài hơn theo quy định của hãng." />
                </Box>
            </Container>
        </Container>
    );
};

export { ShopCommitment };
