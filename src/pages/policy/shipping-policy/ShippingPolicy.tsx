/** @format */

import { Box, Breadcrumbs, Container, Text } from "@/components";
import React from "react";

const ShippingPolicy: React.FunctionComponent = () => {
    return (
        <Container className="w-full min-h-screen">
            <Breadcrumbs />
            <Container className="!px-8 lg:!px-[45px] !py-6">
                <Text margin={[0, 0, 15, 0]} size="lg" fontWeight="bold" textTransform="uppercase" className="text-gray-900" titleText="Chính sách vận chuyển" />
                <Text margin={[0, 0, 15, 0]} size="base" fontWeight="semibold" className="text-gray-900" titleText="I. HÌNH THỨC VẬN CHUYỂN & GIAO NHẬN HÀNG HÓA " />
                <Box margin={[0, 0, 16, 0]}>
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 16, 0]}
                        className="leading-7.5"
                        titleText="Khi mua hàng tại Lamine Sport, quý khách có thể lựa chọn một trong các hình thức vận chuyển, giao nhận sau:"
                    />
                    <Text color="#333" size="base" className="leading-7" titleText="Lamine Sport trực tiếp vận chuyển và giao hàng tận tay khách hàng." />
                    <Text color="#333" size="base" className="leading-7" titleText="Lamine Sport giao hàng cho khách hàng thông qua các nhà cung cấp dịch vụ chuyển phát." />
                </Box>
                <Text margin={[0, 0, 15, 0]} size="base" fontWeight="semibold" className="text-gray-900" titleText="II. NỘI DUNG " />
                <Box margin={[0, 0, 16, 0]}>
                    <Text color="#333" size="base" margin={[0, 0, 4, 0]} fontWeight="semibold" className="leading-7.5" titleText="1. Lamine Sport trực tiếp giao hàng tận nơi sử dụng cho khách hàng" />
                    <Text color="#333" size="base" className="leading-7" titleText="Miễn phí giao hàng: Khoảng cách lên tới 300km." />
                    <Text color="#333" size="base" className="leading-7" titleText="Khung giờ giao hàng từ 8h00 đến 21h00 hàng ngày." />
                </Box>
                <Box margin={[0, 0, 16, 0]}>
                    <Text color="#333" size="base" margin={[0, 0, 4, 0]} fontWeight="semibold" className="leading-7.5" titleText="2. Giao hàng thông qua nhà cung cấp dịch vụ chuyển phát." />
                    <Text color="#333" size="base" className="leading-7" titleText="Lamine Sport sẽ lựa chọn một nhà cung cấp dịch vụ chuyển phát để giao hàng tới Khách hàng." />
                    <Text color="#333" size="base" className="leading-7" titleText="Thời gian giao hàng tới địa điểm khách hàng yêu cầu theo chỉ tiêu về thời gian giao hàng của nhà cung cấp dịch vụ." />
                    <Text color="#333" size="base" className="leading-7" titleText="Để thuận tiện và sắp xếp thời gian, địa điểm nhận hàng phù hợp, Quý khách hàng vui lòng chủ động liên hệ với đơn vị trung gian để nhận hàng." />
                </Box>
            </Container>
        </Container>
    );
};

export { ShippingPolicy };
