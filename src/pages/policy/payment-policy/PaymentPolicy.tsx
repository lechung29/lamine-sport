/** @format */

import { Box, Breadcrumbs, Container, Text } from "@/components";
import React from "react";

const PaymentPolicy: React.FunctionComponent = () => {
    return (
        <Container className="w-full min-h-screen">
            <Breadcrumbs />
            <Container className="!px-8 lg:!px-[45px] !py-6">
                <Text margin={[0, 0, 15, 0]} size="lg" fontWeight="bold" textTransform="uppercase" className="text-gray-900" titleText="Chính sách thanh toán" />
                <Text margin={[0, 0, 15, 0]} size="base" fontWeight="semibold" className="text-gray-900" titleText="Khách hàng thanh toán trực tiếp tại cửa hàng " />
                <Box margin={[0, 0, 16, 0]}>
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="+ Nhận ưu đãi"
                    />
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="+ Nhận quà tặng kèm" />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="+ Check in tại cửa hàng"
                    />
                </Box>
                <Text margin={[0, 0, 15, 0]} size="base" fontWeight="semibold" className="text-gray-900" titleText="Khách hàng thanh toán online" />
                <Box margin={[0, 0, 16, 0]}>
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="+ Chuyển khoản trước khi nhận hàng" />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="+ Quà tặng kèm bất kỳ"
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Khách hàng có nhu cầu khiếu nại, đổi trả sản phẩm do lỗi củachúng tôi có thể liên hệ qua Hotline 1900 9518 để được hỗ trợ sớm nhất."
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Tư vấn viên sẽ hướng dẫn khách hàng các bước cần thiết để tiến hành trả thanh toán."
                    />
                </Box>
            </Container>
        </Container>
    );
};

export { PaymentPolicy };
