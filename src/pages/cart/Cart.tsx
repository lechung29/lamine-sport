/** @format */

import { Breadcrumbs, CartItem, Container, Text, Box, BaseButton, Image } from "@/components";
import React, { useMemo } from "react";
import { Collapse, Flex, Result } from "antd";
import { formatCurrency, paymentMethods } from "@/utils";
import { cartState, useAppSelector } from "@/redux-store";
import { useNavigate } from "react-router-dom";

const Cart: React.FunctionComponent = () => {
    const [isMobile, setIsMobile] = React.useState(false);
    const { cartList } = useAppSelector(cartState);
    const navigate = useNavigate();
    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getTotalPrice = () => {
        let total: number = 0;
        cartList.forEach((item) => {
            const unitPrice: number = item.salePrice ?? item.originalPrice;
            total += unitPrice * item.selectedProductCount;
        });
        return total;
    };

    const getProgressBarForFreeShipping = () => {
        const totalPrice = getTotalPrice();
        const targetPrice = 450000;
        return Math.min((totalPrice / targetPrice) * 100, 100);
    };

    const freeShipProgressTitle = useMemo(() => {
        const totalPrice = getTotalPrice();
        const targetPrice = 450000;
        if (totalPrice >= targetPrice) {
            return "Bạn đã đủ điều kiện miễn phí vận chuyển";
        } else {
            return (
                <React.Fragment>
                    <Text as="span" titleText="Mua tối thiểu 450.000đ để được " />
                    <Text as="span" textTransform="uppercase" fontWeight="semibold" titleText="miễn phí vận chuyển" />
                </React.Fragment>
            );
        }
    }, [cartList]);

    const CollapsePanelHeader = (
        <Flex align="center" justify="between">
            <Text as="span" fontWeight="semibold" size="lg" titleText={`Chi tiết đơn hàng (${cartList.length} sản phẩm)`} />
        </Flex>
    );

    return (
        <Container>
            <Breadcrumbs />
            <Container className="h-auto !px-4 sm:!px-8 lg:!px-[45px]">
                <Text size="lg" textTransform="uppercase" fontWeight="semibold" padding={[10, 0, 10, 0]} titleText="Giỏ hàng của bạn" />
                {cartList.length > 0 ? (
                    <Flex wrap className="!mb-10">
                        <Box className="w-full lg:!pr-2 lg:w-2/3 max-md:!mb-2 !mb-4 overflow-x-hidden">
                            <Flex align="center" justify="center" className="relative h-6.5 !mb-4 bg-[#e1e1e1] !rounded-md" role="progressbar">
                                <Text size="sm" color="#333" className="z-10" titleText={freeShipProgressTitle} />
                                <Box className="absolute left-0 h-full bg-amber-400 !rounded-md" style={{ width: `${getProgressBarForFreeShipping()}%` }} />
                            </Flex>
                            {isMobile ? (
                                <Collapse defaultActiveKey={["1"]} className="w-full !border-0">
                                    <Collapse.Panel header={CollapsePanelHeader} key="1" className="!border-0 !rounded-none !bg-[#eee]">
                                        <Flex vertical gap={16}>
                                            {cartList.map((item) => (
                                                <CartItem key={item._id} cartItem={item} isMobile={isMobile} />
                                            ))}
                                        </Flex>
                                    </Collapse.Panel>
                                </Collapse>
                            ) : (
                                <Container className="scroll-horizontal">
                                    <Box className="min-w-[700px] !border !border-[#eee]">
                                        <Flex align="center" justify="center" className="!px-2 !py-2.5 bg-[#eee]">
                                            <Text textTransform="uppercase" fontWeight="semibold" className="flex-1" titleText="Thông tin sản phẩm" />
                                            <Text textTransform="uppercase" fontWeight="semibold" className="w-30" titleText="Đơn giá" />
                                            <Text textTransform="uppercase" fontWeight="semibold" className="w-30" titleText="Số lương" />
                                            <Text textTransform="uppercase" fontWeight="semibold" className="w-30" titleText="Thành tiền" />
                                        </Flex>
                                        {cartList.map((item) => (
                                            <CartItem key={item._id} cartItem={item} isMobile={isMobile} />
                                        ))}
                                    </Box>
                                </Container>
                            )}
                        </Box>

                        <Box className="lg:!pl-2 lg:!w-1/3 w-full">
                            <Box className="!border !border-[#ebebeb]">
                                <Text textAlign="center" fontWeight="bold" textTransform="uppercase" className="bg-[#eee]" titleText="Thông tin đơn hàng" padding={[12, 12, 12, 12]} />
                                <Box bgColor="#f8f8f8" padding={[0, 12, 0, 12]}>
                                    <Flex align="center" justify="space-between" className="!py-3 !border-b !border-b-[#ddd]">
                                        <Text fontWeight="semibold" titleText="Tổng tiền" />
                                        <Text fontWeight="semibold" color="#c30000" size="xl" titleText={formatCurrency(getTotalPrice())}  />
                                    </Flex>
                                    <Box className="!py-3 !border-b !border-b-[#ddd]">
                                        <Flex align="center" justify="space-between" className="!mb-1">
                                            <Text fontWeight="semibold" titleText="Giảm giá" />
                                            <Text color="#6b6b6b" titleText="Áp dụng tại trang thanh toán" />
                                        </Flex>
                                        <Flex align="center" justify="space-between" className="!mb-1">
                                            <Text fontWeight="semibold" titleText="Phí vận chuyển" />
                                            <Text color="#6b6b6b" titleText="Được tính tại trang thanh toán" />
                                        </Flex>
                                    </Box>
                                    <Box padding={[12, 0, 12, 0]}>
                                        <BaseButton width="full" className="!mt-1 h-11 !font-semibold !uppercase" displayText="Thanh toán" onClick={() => navigate("/payment")}/>
                                        <BaseButton
                                            width="full"
                                            colors={{
                                                normal: {
                                                    textColor: "white",
                                                    bgColor: "#646464",
                                                },
                                                hover: {
                                                    textColor: "white",
                                                    bgColor: "#8b8b8b",
                                                },
                                            }}
                                            className="!mt-3 h-11 !font-semibold !uppercase"
                                            displayText="Tiếp tục mua hàng"
                                            onClick={() => navigate("/products")}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                            <Box margin={[20, 0, 0, 0]}>
                                <Text fontWeight="semibold" textAlign="center" size="xl" color="#333" titleText="Hỗ trợ thanh toán với" />
                                <Flex wrap align="center" justify="center" gap={8} className="!mt-1">
                                    {paymentMethods.map((item) => (
                                        <Image key={item.name} src={item.imgSrc} alt={item.name} className="!h-9 filter hover:!brightness-125 transition duration-300" />
                                    ))}
                                </Flex>
                            </Box>
                        </Box>
                    </Flex>
                ) : (
                    <Box className="min-h-40 ">
                        <Result
                            status="404"
                            subTitle="Giỏ hàng của bạn đang trống, đi chọn sản phẩm thôi nào!"
                            extra={<BaseButton radius="sm" displayText="Tiếp tục mua hàng" onClick={() => navigate("/products")} />}
                        />
                    </Box>
                )}
            </Container>
        </Container>
    );
};

export { Cart };
