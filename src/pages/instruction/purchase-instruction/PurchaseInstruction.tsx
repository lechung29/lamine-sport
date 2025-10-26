/** @format */

import { Box, Breadcrumbs, Container, Text } from "@/components";
import React from "react";

const PurchaseInstruction: React.FunctionComponent = () => {
    return (
        <Container className="w-full min-h-screen">
            <Breadcrumbs />

            <Container className="!px-8 lg:!px-[45px] !py-6">
                <Text margin={[0, 0, 15, 0]} size="lg" fontWeight="bold" textTransform="uppercase" className="text-gray-900" titleText="Hướng dẫn mua hàng" />
                <Box margin={[0, 0, 16, 0]}>
                    <Text
                        color="#333"
                        margin={[0, 0, 8, 0]}
                        titleText={
                            <React.Fragment>
                                <Text as="span" size="base" className="leading-7.5" fontWeight="semibold" titleText="Bước 1: " />
                                <Text as="span" size="base" className="leading-7.5" titleText="Truy cập website và lựa chọn sản phẩm cần mua để mua hàng" />
                            </React.Fragment>
                        }
                    />
                    <Text
                        color="#333"
                        margin={[0, 0, 8, 0]}
                        titleText={
                            <React.Fragment>
                                <Text as="span" size="base" className="leading-7.5" fontWeight="semibold" titleText="Bước 2: " />
                                <Text as="span" size="base" className="leading-7.5" titleText="Click và sản phẩm muốn mua, màn hình hiển thị ra pop up với các lựa chọn sau" />
                            </React.Fragment>
                        }
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Nếu bạn muốn tiếp tục mua hàng: Bấm vào phần tiếp tục mua hàng để lựa chọn thêm sản phẩm vào giỏ hàng"
                    />
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="Nếu bạn muốn xem giỏ hàng để cập nhật sản phẩm: Bấm vào xem giỏ hàng" />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Nếu bạn muốn đặt hàng và thanh toán cho sản phẩm này vui lòng bấm vào: Đặt hàng và thanh toán"
                    />
                    <Text
                        color="#333"
                        margin={[0, 0, 8, 0]}
                        titleText={
                            <React.Fragment>
                                <Text as="span" size="base" className="leading-7.5" fontWeight="semibold" titleText="Bước 3: " />
                                <Text as="span" size="base" className="leading-7.5" titleText="Lựa chọn thông tin tài khoản thanh toán" />
                            </React.Fragment>
                        }
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Nếu bạn đã có tài khoản vui lòng nhập thông tin tên đăng nhập là email và mật khẩu vào mục đã có tài khoản trên hệ thống"
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Nếu bạn chưa có tài khoản và muốn đăng ký tài khoản vui lòng điền các thông tin cá nhân để tiếp tục đăng ký tài khoản. Khi có tài khoản bạn sẽ dễ dàng theo dõi được đơn hàng của mình"
                    />
                    <Text
                        color="#333"
                        margin={[0, 0, 8, 0]}
                        titleText={
                            <React.Fragment>
                                <Text as="span" size="base" className="leading-7.5" fontWeight="semibold" titleText="Bước 4: " />
                                <Text
                                    as="span"
                                    size="base"
                                    className="leading-7.5"
                                    titleText="Điền các thông tin của bạn để nhận đơn hàng, lựa chọn hình thức thanh toán và vận chuyển cho đơn hàng của mình"
                                />
                            </React.Fragment>
                        }
                    />
                    <Text
                        color="#333"
                        margin={[0, 0, 8, 0]}
                        titleText={
                            <React.Fragment>
                                <Text as="span" size="base" className="leading-7.5" fontWeight="semibold" titleText="Bước 5: " />
                                <Text as="span" size="base" className="leading-7.5" titleText="Xem lại thông tin đặt hàng, điền chú thích và gửi đơn hàng" />
                            </React.Fragment>
                        }
                    />
                    <Text
                        color="#333"
                        size="base"
                        margin={[0, 0, 8, 0]}
                        className="leading-7.5"
                        titleText="Sau khi nhận được đơn hàng bạn gửi chúng tôi sẽ liên hệ bằng cách gọi điện lại để xác nhận lại đơn hàng và địa chỉ của bạn."
                    />
                    <Text color="#333" size="base" margin={[0, 0, 8, 0]} className="leading-7.5" titleText="Trân trọng cảm ơn." />
                </Box>
            </Container>
        </Container>
    );
};

export { PurchaseInstruction };
