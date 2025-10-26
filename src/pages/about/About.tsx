/** @format */

import { Box, Breadcrumbs, Container, Text } from "@/components";
import React from "react";

const About: React.FunctionComponent = () => {
    return (
        <Container className="w-full min-h-screen">
            <Breadcrumbs />

            <Container className="!px-8 lg:!px-[45px] !py-6">
                <Text margin={[0, 0, 15, 0]} size="lg" fontWeight="bold" textTransform="uppercase" className="text-gray-900" titleText="Giới thiệu" />
                <Box>
                    <Text color="#333" size="base" margin={[0, 0, 12, 0]} className="leading-7.5">
                        <Text size="base" as="span" fontWeight="bold">
                            Lamine Sport -{" "}
                        </Text>
                        Nhà bán lẻ & phân phối thương hiệu các mặt hàng về thể thao hàng đầu tại Việt nam. Sở hữu các địa điểm phân phối chính hãng với hơn 30 thương hiệu thể thao khác nhau trên khắp
                        thế giới như Crocs, New Balance, Fila, Adidas, Nike,... Lamine Sport mang đến rất nhiều lựa chọn về giày dép và quần áo, máy tập thể dục và phụ kiện thể thao. Chúng tôi cam kết
                        mang đến các sản phẩm chính hãng, chất lượng tốt nhất cho các tín đồ đam mê thể thao tại Việt Nam.
                    </Text>
                    <Text color="#333" size="base" margin={[0, 0, 12, 0]} className="leading-7.5">
                        Lamine Sport luôn nỗ lực để cung cấp các sản phẩm thể thao chính hãng tốt nhất trên thế giới đến tay “tín đồ thể thao” tại Vietnam, góp phần mang những sản phẩm chính hãng, cao
                        cấp đến gần bạn. Chúng tôi luôn lắng nghe khách hàng của mình, nhằm cải tiến quy trình và chất lượng sản phẩm. Vì thế, Lamine Sport Vietnam luôn tự hào là thương hiệu cung cấp
                        sản phẩm và trải nghiệm dịch vụ hàng đầu trong hơn 2 thập niên qua.
                    </Text>
                </Box>
            </Container>
        </Container>
    );
};

export { About };
