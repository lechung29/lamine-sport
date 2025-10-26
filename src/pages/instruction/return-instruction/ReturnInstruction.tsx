/** @format */

import { Box, Breadcrumbs, Container, Text } from "@/components";
import React from "react";

const ReturnInstruction: React.FunctionComponent = () => {
    return (
        <Container className="w-full min-h-screen">
            <Breadcrumbs />

            <Container className="!px-8 lg:!px-[45px] !py-6">
                <Text margin={[0, 0, 15, 0]} size="lg" fontWeight="bold" textTransform="uppercase" className="text-gray-900" titleText="Hướng dẫn đổi trả" />
                <Box margin={[0, 0, 16, 0]}>
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="1 đổi 1 trong 30 ngày đầu tiên với điều kiện các lỗi sản phẩm thực tế không đúng với mô tả từ website, không chấp nhận với các sản phẩm bị lỗi bởi hoạt động của khách hàng (rách, ố màu,...)"
                    />
                </Box>
            </Container>
        </Container>
    );
};

export { ReturnInstruction };
