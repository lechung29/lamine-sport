/** @format */

import React from "react";
import { Dialog } from "../dialog";
import { TooltipLabel } from "../tooltip-label";
import { Flex, Tooltip } from "antd";
import { classNames, formatCurrency, isInputOnlyNumber } from "@/utils";
import { LuMinus, LuPlus } from "react-icons/lu";
import { IProductColorProps, IProductInfo } from "@/types";
import { BaseButton, BaseInput, Box, Container, Image, Text } from "../elements";
import { useImmerState } from "@/hooks";
import { addToCart, useAppDispatch } from "@/redux-store";
import { useNotification } from "@/context";
import { useNavigate } from "react-router-dom";

export interface IAddProductDialogProps {
    isOpen: boolean;
    productItem: IProductInfo;
    onClose: () => void;
}

export interface IAddProductDialogState {
    selectedColor?: IProductColorProps;
    selectedSize?: string;
    addProductCount: number;
}

const initialState: IAddProductDialogState = {
    addProductCount: 1,
};

const AddProductDialog: React.FC<IAddProductDialogProps> = (props) => {
    const { isOpen, productItem, onClose } = props;
    const [state, setState] = useImmerState<IAddProductDialogState>(initialState);
    const { selectedColor, selectedSize, addProductCount } = state;
    const dispatch = useAppDispatch();
    const notify = useNotification();
    const navigate = useNavigate();
    const onIncreaseCount = () => {
        if (addProductCount < 99) {
            setState({ addProductCount: addProductCount + 1 });
        }
    };

    const onDecreaseCount = () => {
        if (addProductCount > 1) {
            setState({ addProductCount: addProductCount - 1 });
        }
    };

    const handleAddToCart = () => {
        if (!selectedColor || (productItem.productSizes && productItem.productSizes.length > 0 && !selectedSize)) {
            if (!selectedColor) {
                notify.error("Vui lòng chọn màu sắc cho sản phẩm.");
            } else if (productItem.productSizes && productItem.productSizes.length > 0 && !selectedSize) {
                notify.error("Vui lòng chọn kích thước cho sản phẩm.");
            }
        } else {
            dispatch(
                addToCart({
                    ...productItem,
                    selectedProductColorValue: selectedColor.value,
                    selectedProductSize: selectedSize,
                    selectedProductCount: addProductCount,
                })
            );
            notify.success("Sản phẩm đã được thêm vào giỏ hàng.");
            onClose();
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} withoutFooter={true}>
            <Container className="h-full flex items-start justify-center gap-6">
                <Box className="w-2/5 h-auto overflow-hidden cursor-pointer">
                    <Image objectFit="contain" src={selectedColor?.images[0].url || productItem?.primaryImage.url} alt="Product" className="w-full" />
                </Box>
                <Box className="flex-1">
                    <TooltipLabel className="!mb-2 font-semibold text-xl cursor-pointer hover:!text-[#77e322]" text={productItem?.productName} lineDisplayed={2} onClick={() => navigate(`/product/${productItem._id}`)}/>
                    <Flex align="center" justify="flex-start" gap={8} className="!mb-3">
                        {productItem?.salePrice ? (
                            <>
                                <Text fontWeight="extrabold" size="xl" color="#c30000" titleText={formatCurrency(productItem.salePrice)} />
                                <Text fontWeight="extrabold" size="base" color="#7b7b7b" className="line-through" titleText={formatCurrency(productItem.originalPrice)} />
                            </>
                        ) : (
                            <Text fontWeight="extrabold" size="xl" color="#c30000" titleText={formatCurrency(productItem.originalPrice)} />
                        )}
                    </Flex>
                    <Box margin={[0, 0, 16, 0]}>
                        <Text as="p" size="sm" color="#333" titleText="Màu sắc:" />
                        <Flex align="center" justify="flex-start" gap={10} className="!my-2">
                            {productItem?.productColors.map((product) => (
                                <Tooltip title={product.name} color={"#002d3a"} key={product.id}>
                                    <Box
                                        className={classNames(`w-7 h-7 !rounded-full !outline outline-[#d0d0d0] cursor-pointer`, {
                                            "!outline-2 !outline-[#a2ff00]": selectedColor?.value === product.value,
                                        })}
                                        style={{ backgroundColor: product.hex }}
                                        onClick={() => setState({ selectedColor: product })}
                                    />
                                </Tooltip>
                            ))}
                        </Flex>
                    </Box>
                    <Box margin={[0, 0, 16, 0]} className={productItem.productSizes && productItem.productSizes.length > 0 ? "visible" : "invisible"}>
                        <Text as="p" size="sm" color="#333" titleText="Kích thước:" />
                        <Flex align="center" justify="flex-start" gap={10} className="!my-2">
                            {productItem.productSizes.map((item) => (
                                <Box
                                    className={classNames("w-7 h-7 !outline text-sm bg-white text-[#333] !outline-gray-200 flex items-center justify-center cursor-pointer", {
                                        "!bg-[#002d3a] text-white": item === selectedSize,
                                    })}
                                    onClick={() => setState({ selectedSize: item })}
                                >
                                    {item}
                                </Box>
                            ))}
                        </Flex>
                    </Box>
                    <Flex align="center" justify="flex-start" wrap gap={8}>
                        <Flex align="center" gap={4}>
                            <BaseButton textProps={{ size: "sm", fontWeight: 400 }} className="w-10 h-10" displayText={<LuMinus />} onClick={onDecreaseCount} />
                            <BaseInput
                                type="text"
                                value={addProductCount.toString()}
                                onChange={(value) => {
                                    if (isInputOnlyNumber(value) && parseInt(value) >= 1 && parseInt(value) <= 99) {
                                        setState({ addProductCount: parseInt(value) });
                                    }
                                }}
                                className="h-9.75 w-15 text-base text-center"
                            />
                            <BaseButton textProps={{ size: "sm", fontWeight: 400 }} className="w-10 h-10" displayText={<LuPlus />} onClick={onIncreaseCount} />
                        </Flex>
                        <BaseButton className="h-10" textProps={{ size: "base", fontWeight: 600 }} displayText="Thêm vào giỏ hàng" onClick={handleAddToCart} />
                    </Flex>
                </Box>
            </Container>
        </Dialog>
    );
};

export { AddProductDialog };
