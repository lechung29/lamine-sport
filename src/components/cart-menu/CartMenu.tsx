/** @format */

import React from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { BaseButton, BaseInput, Box, Container, Image, Text } from "../elements";
import { Flex } from "antd";
import { cartState, changeCartItemCountByInput, ICartItem, increaseCartItemCount, reduceCartItemCount, removeFromCart, useAppDispatch, useAppSelector } from "@/redux-store";
import { useNavigate } from "react-router-dom";
import { formatCurrency, isInputOnlyNumber } from "@/utils";

interface ICartMenuProps {
    onOpenChange: (isOpen: boolean) => void;
}

const CartMenu: React.FunctionComponent<ICartMenuProps> = (props) => {
    const { onOpenChange } = props;
    const { cartList } = useAppSelector(cartState);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const getColorName = (cartItem: ICartItem) => {
        return cartItem.productColors.find((color) => color.value === cartItem.selectedProductColorValue)?.name!;
    };

    const onIncreaseCount = (item: ICartItem, count: number) => {
        dispatch(
            increaseCartItemCount({
                productId: item._id,
                selectedProductColorValue: item.selectedProductColorValue,
                count: count,
            })
        );
    };

    const onReduceCount = (item: ICartItem, count: number) => {
        dispatch(
            reduceCartItemCount({
                productId: item._id,
                selectedProductColorValue: item.selectedProductColorValue,
                count: count,
            })
        );
    };

    const getTotalPrice = () => {
        let total: number = 0;
        cartList.forEach((item) => {
            const unitPrice: number = item.salePrice ?? item.originalPrice;
            total += unitPrice * item.selectedProductCount;
        });
        return total;
    };

    const handlePayment = () => {
        onOpenChange(false);
        navigate("/payment");
    };
    return (
        <Container bgColor="white" className="!w-84 h-auto">
            <Text padding={[8, 16, 8, 16]} size="base" fontWeight="bold" className="w-full !border-b !border-gray-200" titleText="Giỏ hàng" />
            <Flex vertical className="max-h-100 scroll-vertical !px-4">
                {cartList.length === 0 ? (
                    <Box className="!min-h-40 flex flex-col items-center justify-center gap-6">
                        <Text color="#999" className="text-center" titleText="Giỏ hàng của bạn đang trống, đi chọn sản phẩm thôi nào!" />
                        <BaseButton radius="sm" displayText="Tiếp tục mua hàng" onClick={() => navigate("/products")} />
                    </Box>
                ) : (
                    cartList.map((item) => (
                        <Flex key={item._id} align="flex-start" justify="space-between" gap={16} className="!py-3 not-last:!border-b not-last:!border-gray-200">
                            <Flex align="center" justify="center" className="!border !border-gray-200">
                                <Image
                                    src={item.productColors.find((color) => color.value === item.selectedProductColorValue)?.images[0].url!}
                                    alt={item.productName}
                                    objectFit="cover"
                                    className="w-15 h-15"
                                />
                            </Flex>
                            <Flex vertical gap={2} className="flex-1">
                                <Flex align="flex-start" justify="space-between" vertical={false} gap={4}>
                                    <Box className="flex-1">
                                        <Text color="#333" className="hover:!text-[#77e322] cursor-pointer" onClick={() => navigate(`/product/${item._id}`)} titleText={item.productName} />

                                        <Text color="#7f7f7f" size="xs" titleText={`${!!item.selectedProductSize ? `${item.selectedProductSize} / ` : ""}${getColorName(item)}`} />
                                    </Box>
                                    <Flex align="center" justify="flex-end" className="w-6">
                                        <IoIosCloseCircleOutline className="text-xl text-[#333] hover:!text-red-500 cursor-pointer" onClick={() => dispatch(removeFromCart(item))} />
                                    </Flex>
                                </Flex>
                                <Flex align="center" justify="space-between" vertical={false}>
                                    <Flex align="center">
                                        <Flex
                                            align="center"
                                            justify="center"
                                            className="w-7 h-7 !border !border-gray-200 cursor-pointer hover:!bg-gray-100"
                                            onClick={() => item.selectedProductCount > 1 && onReduceCount(item, 1)}
                                        >
                                            <LuMinus className="text-sm" />
                                        </Flex>
                                        <BaseInput
                                            type="text"
                                            value={item.selectedProductCount.toString()}
                                            onChange={(value) => {
                                                if (isInputOnlyNumber(value) && parseInt(value) >= 1 && parseInt(value) <= 99) {
                                                    dispatch(
                                                        changeCartItemCountByInput({
                                                            productId: item._id,
                                                            selectedProductColorValue: item.selectedProductColorValue,
                                                            count: parseInt(value),
                                                        })
                                                    );
                                                }
                                            }}
                                            className="h-7 w-10 text-base text-center !border-y !border-gray-200 !p-1"
                                        />
                                        <Flex
                                            align="center"
                                            justify="center"
                                            className="w-7 h-7 !border !border-gray-200 cursor-pointer hover:!bg-gray-100"
                                            onClick={() => item.selectedProductCount < 99 && onIncreaseCount(item, 1)}
                                        >
                                            <LuPlus className="text-sm" />
                                        </Flex>
                                    </Flex>

                                    <Text fontWeight="bold" size="sm" color="#c30000" titleText={formatCurrency(item?.salePrice ? item.salePrice : item.originalPrice)} />
                                </Flex>
                            </Flex>
                        </Flex>
                    ))
                )}
            </Flex>
            <Flex align="center" justify="space-between" className="h-auto !p-4 bg-gray-100 !border-t !border-gray-200">
                <Flex vertical>
                    <Text as="span" size="sm" titleText="Tổng tiền:" />
                    <Text as="span" size="xl" fontWeight="bold" className="text-red-600" titleText={formatCurrency(getTotalPrice())} />
                </Flex>
                {cartList.length > 0 && <BaseButton onClick={handlePayment} padding={[10, 24, 10, 24]} className="[clip-path:polygon(10%_0%,100%_0%,100%_100%,0%_100%)]" displayText="THANH TOÁN" />}
            </Flex>
        </Container>
    );
};

export { CartMenu };
