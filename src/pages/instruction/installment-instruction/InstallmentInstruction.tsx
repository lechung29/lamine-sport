/** @format */

import { Box, Breadcrumbs, Container, Text } from "@/components";
import React from "react";

const InstallmentInstruction: React.FunctionComponent = () => {
    return (
        <Container className="w-full min-h-screen">
            <Breadcrumbs />
            <Container className="!px-8 lg:!px-[45px] !py-6">
                <Text margin={[0, 0, 15, 0]} size="lg" fontWeight="bold" textTransform="uppercase" className="text-gray-900" titleText="Hướng dẫn trả góp" />
                <Box margin={[0, 0, 16, 0]}>
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Để thuận tiện và dễ dàng hơn cho khách hàng khi mua hàng online, Lamine Phone tích hợp hình thức trả góp với sự đa dạng về cổng thanh toán, kỳ hạn, lãi suất ưu đãi đi kè với nhiều chương trình hấp dẫn."
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Theo đó, hiện tại trên website đã có chính thức 4 cổng trả góp, được chia thành hình thức chính:"
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="- Trả góp qua công ty tài chính: Home Credit, FE Credit (Áp dụng cho sản phẩm có giá niêm yết từ 3 triệu trở lên)"
                    />
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="- Trả góp qua thẻ tín dụng: Bao gồm 3 cổng thanh toán:" />
                    <Text color="#333" size="base" className="leading-7" titleText="OnePay (Áp dụng cho sản phẩm có giá bán từ 3 triệu trở lên)" />
                    <Text color="#333" size="base" className="leading-7" titleText="Kredivo (Áp dụng cho sản phẩm có giá bán dưới 25 triệu)" />
                    <Text color="#333" size="base" className="leading-7" titleText="Alepay (Áp dụng cho sản phẩm có giá bán từ 3 triệu trở lên)" />
                    <Text color="#333" size="base" className="leading-7" titleText="Trả góp qua thẻ tín dụng là gì:" />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7"
                        titleText="Đây là hình thức mua trả góp mà số tiền trả trước, tiền trả góp hàng tháng, tiền lãi suất... sẽ được thanh toán trên thẻ tín dụng. Các giao dịch này an toàn, bảo mật và nhanh chóng trong qua cổng thanh toán Alepay, OnePay và Kredivo. "
                    />
                    <Text color="#333" size="base" className="leading-7" titleText="Những lưu ý khi mua trả góp qua thẻ tín dụng:" />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="• Khách hàng cần đọc kỹ thể lệ Chương trình trả góp của Ngân hàng bằng cách nhấp vào logo các Ngân hàng đối tác của Lamine Sport trước khi đăng ký tham gia chương trình."
                    />
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="• Mỗi giỏ hàng chỉ được có duy nhất 01 sản phẩm." />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="• Mỗi Khách hàng được tham gia Chương trình nhiều lần miễn sao tổng giá trị các đơn hàng không vượt quá hạn mức thẻ tín dụng của Khách hàng."
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="• Khách hàng không được hủy đơn hàng sau khi đã chuyển đổi giao dịch sang phương thức trả góp. "
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="• Đơn hàng tham gia chương trình trả góp sẽ không được đổi trả (trừ sản phẩm lỗi do phía Lamine Sport)."
                    />
                </Box>
            </Container>
        </Container>
    );
};

export { InstallmentInstruction };
