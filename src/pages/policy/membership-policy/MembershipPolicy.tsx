/** @format */

import { Box, Breadcrumbs, Container, Text } from "@/components";
import React from "react";

const MembershipPolicy: React.FunctionComponent = () => {
    return (
        <Container className="w-full min-h-screen">
            <Breadcrumbs />
            <Container className="!px-8 lg:!px-[45px] !py-6">
                <Text margin={[0, 0, 15, 0]} size="lg" fontWeight="bold" textTransform="uppercase" className="text-gray-900" titleText="Chính sách thành viên" />
                <Text margin={[0, 0, 15, 0]} size="base" fontWeight="semibold" className="text-gray-900" titleText="1. Thẻ thành viên" />
                <Box margin={[0, 0, 16, 0]}>
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Điều kiện cấp thẻ thành viên: Khi khách hàng mua hàng trên hệ thống Dola sẽ được cấp thẻ thành viên."
                    />
                </Box>
                <Text margin={[0, 0, 15, 0]} size="base" fontWeight="semibold" className="text-gray-900" titleText="2. Thẻ VIP" />
                <Box margin={[0, 0, 16, 0]}>
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="Điều kiện nhận thẻ VIP:" />
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="+ Mua hàng với giá trị 3 triệu trở lên" />
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="+ Tham gia các hoạt động, chương trình khuyến mãi của Dola" />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Lưu ý: Hạn mức 10, 20, 30, 50,100 triệu đồng là tính từ thời điểm bắt đầu mua tới khi lên thẻ. Khi lên thẻ VIP và tích tiếp lên 20 đến 100 triệu, tổng tiền này là tính từ khi khách hàng mua lần đầu và cộng dồn lên."
                    />
                </Box>
            </Container>
        </Container>
    );
};

export { MembershipPolicy };
