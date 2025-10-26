/** @format */

import React from "react";
import { TooltipLabel } from "../tooltip-label";
import { IoTrashOutline } from "react-icons/io5";
import { LuMinus, LuPlus } from "react-icons/lu";
import { increaseCartItemCount, changeCartItemCountByInput, ICartItem, removeFromCart, useAppDispatch, reduceCartItemCount } from "@/redux-store";
import { Flex } from "antd";
import { BaseInput, Box, Image, Text } from "../elements";
import { formatCurrency, isInputOnlyNumber } from "@/utils";
import { useNavigate } from "react-router-dom";

interface CartItemProps {
    isMobile?: boolean;
    cartItem: ICartItem;
}

const CartItem: React.FunctionComponent<CartItemProps> = (props) => {
    const { isMobile = false, cartItem } = props;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const getColorName = () => {
        return cartItem.productColors.find((color) => color.value === cartItem.selectedProductColorValue)?.name!;
    };

    const onIncreaseCount = (count: number) => {
        dispatch(
            increaseCartItemCount({
                productId: cartItem._id,
                selectedProductColorValue: cartItem.selectedProductColorValue,
                count: count,
            })
        );
    };

    const onReduceCount = (count: number) => {
        dispatch(
            reduceCartItemCount({
                productId: cartItem._id,
                selectedProductColorValue: cartItem.selectedProductColorValue,
                count: count,
            })
        );
    };

    const getCartItemTotalPrice = () => {
        const unitPrice: number = cartItem.salePrice ?? cartItem.originalPrice;
        return cartItem.selectedProductCount * unitPrice;
    };

    if (isMobile) {
        return (
            <Flex align="flex-start" gap={12} className="!py-2.5 !border-b !border-[#eee]">
                <Image
                    clickable
                    src={cartItem.productColors.find((color) => color.value === cartItem.selectedProductColorValue)?.images[0].url!}
                    objectFit="cover"
                    className="w-20 h-20 flex-shrink-0"
                    alt={cartItem.productName}
                />
                <Flex vertical gap={8} className="flex-1">
                    <Flex vertical gap={4}>
                        <TooltipLabel className="text-sm font-semibold hover:!text-[#77e322] cursor-pointer" onClick={() => navigate(`/product/${cartItem._id}`)} lineDisplayed={2} text={cartItem.productName} />
                        <Text color="#7f7f7f" size="xs" titleText={`${!!cartItem.selectedProductSize ? `${cartItem.selectedProductSize} / ` : ""}${getColorName()}`} />
                        <Flex align="center" gap={8} className="!mt-2">
                            {cartItem?.salePrice ? (
                                <>
                                    <Text fontWeight="bold" size="lg" color="#c30000" titleText={formatCurrency(cartItem.salePrice)} />
                                    <Text size="sm" color="#7b7b7b" className="line-through" titleText={formatCurrency(cartItem.originalPrice)} />
                                </>
                            ) : (
                                <Text fontWeight="bold" size="lg" color="#c30000" titleText={formatCurrency(cartItem.originalPrice)} />
                            )}
                        </Flex>
                    </Flex>
                    <Flex align="center" justify="flex-start" gap={16}>
                        <Flex align="center">
                            <Flex
                                align="center"
                                justify="center"
                                className="w-8 h-8 !border !border-gray-200 cursor-pointer hover:!bg-gray-100"
                                onClick={() => cartItem.selectedProductCount > 1 && onReduceCount(1)}
                            >
                                <LuMinus className="text-sm" />
                            </Flex>
                            <BaseInput
                                type="text"
                                value={cartItem.selectedProductCount.toString()}
                                onChange={(value) => {
                                    if (isInputOnlyNumber(value) && parseInt(value) >= 1 && parseInt(value) <= 99) {
                                        dispatch(
                                            changeCartItemCountByInput({
                                                productId: cartItem._id,
                                                selectedProductColorValue: cartItem.selectedProductColorValue,
                                                count: parseInt(value),
                                            })
                                        );
                                    }
                                }}
                                className="h-8 w-10 text-base text-center !border-y !border-gray-200 !p-1"
                            />
                            <Flex
                                align="center"
                                justify="center"
                                className="w-8 h-8 !border !border-gray-200 cursor-pointer hover:!bg-gray-100"
                                onClick={() => cartItem.selectedProductCount < 99 && onIncreaseCount(1)}
                            >
                                <LuPlus className="text-sm" />
                            </Flex>
                        </Flex>
                        <IoTrashOutline className="w-6 h-6 cursor-pointer hover:text-[#c10000]" onClick={() => dispatch(removeFromCart(cartItem))} />
                    </Flex>
                </Flex>
            </Flex>
        );
    }

    return (
        <Flex align="center" justify="center" className="!px-2 !py-2.5">
            <Flex align="flex-start" justify="flex-start" gap={12} className="flex-1">
                <Image
                    clickable
                    src={cartItem.productColors.find((color) => color.value === cartItem.selectedProductColorValue)?.images[0].url!}
                    objectFit="cover"
                    className="w-25 h-25 flex-shrink-0"
                    alt={cartItem.productName}
                />
                <Flex vertical justify="center" gap={4} className="h-full flex-1 !pr-4 overflow-hidden">
                    <TooltipLabel className="cursor-pointer hover:!text-[#77e322]" lineDisplayed={2} onClick={() => navigate(`/product/${cartItem._id}`)} text={cartItem.productName} />
                    <Text color="#7f7f7f" size="xs" titleText={`${!!cartItem.selectedProductSize ? `${cartItem.selectedProductSize} / ` : ""}${getColorName()}`} />
                    <IoTrashOutline className="w-5 h-5 cursor-pointer hover:text-[#c10000]" onClick={() => dispatch(removeFromCart(cartItem))} />
                </Flex>
            </Flex>
            <Box className="w-30">
                <Text fontWeight="bold" color="#c10000" titleText={formatCurrency(cartItem.salePrice ?? cartItem.originalPrice)} />
            </Box>
            <Flex align="center" className="w-30">
                <Flex
                    align="center"
                    justify="center"
                    className="w-7 h-7 !border !border-gray-200 cursor-pointer hover:!bg-gray-100"
                    onClick={() => cartItem.selectedProductCount > 1 && onReduceCount(1)}
                >
                    <LuMinus className="text-sm" />
                </Flex>
                <BaseInput
                    type="text"
                    value={cartItem.selectedProductCount.toString()}
                    onChange={(value) => {
                        if (isInputOnlyNumber(value) && parseInt(value) >= 1 && parseInt(value) <= 99) {
                            dispatch(
                                changeCartItemCountByInput({
                                    productId: cartItem._id,
                                    selectedProductColorValue: cartItem.selectedProductColorValue,
                                    count: parseInt(value),
                                })
                            );
                        }
                    }}
                    className="h-7 w-9 text-base text-center !border-y !border-gray-200 !p-1"
                />
                <Flex
                    align="center"
                    justify="center"
                    className="w-7 h-7 !border !border-gray-200 cursor-pointer hover:!bg-gray-100"
                    onClick={() => cartItem.selectedProductCount < 99 && onIncreaseCount(1)}
                >
                    <LuPlus className="text-sm" />
                </Flex>
            </Flex>
            <Box className="w-30">
                <Text fontWeight="bold" color="#c10000" titleText={formatCurrency(getCartItemTotalPrice())} />
            </Box>
        </Flex>
    );
};

export { CartItem };
