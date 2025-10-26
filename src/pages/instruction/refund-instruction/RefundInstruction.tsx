
import { Box, Breadcrumbs, Container, Text } from "@/components";
import React from "react";

const RefundInstruction: React.FunctionComponent = () => {
    return (
        <Container className="w-full min-h-screen">
            <Breadcrumbs />

            <Container className="!px-8 lg:!px-[45px] !py-6">
                <Text margin={[0, 0, 15, 0]} size="lg" fontWeight="bold" textTransform="uppercase" className="text-gray-900" titleText="Hướng dẫn hoàn hàng" />
                <Box margin={[0, 0, 16, 0]}>
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Trả hàng trong 7 ngày đầu: miễn phí với điều kiện hàng hóa chưa qua sử dụng còn nguyên tem mác"
                    />
                </Box>
            </Container>
        </Container>
    );
};

export { RefundInstruction };