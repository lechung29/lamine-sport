/** @format */

import React from "react";
import { TooltipLabel } from "../tooltip-label";
import { classNames, formatCurrency, getSalePercent, isInputOnlyNumber } from "@/utils";
import { TfiRulerAlt } from "react-icons/tfi";
import { InstructionSizeDialog } from "../instruction-size-dialog";
import { LuMinus, LuPlus } from "react-icons/lu";
import { IProductColorProps, IProductInfo, IResponseStatus } from "@/types";
import { BaseButton, BaseInput, Box, Container, Text } from "../elements";
import { Flex } from "antd";
import { addFavoriteProduct, addToCart, favoriteProductState, removeFavoriteProduct, useAppDispatch, useAppSelector, userState } from "@/redux-store";
import { useNotification } from "@/context";
import { useImmerState } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { ProductService } from "@/services";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface IProductBasicInfoProps {
    productItem: IProductInfo;
}

export interface IProductBasicInfoState {
    selectedColor?: IProductColorProps;
    selectedSize?: string;
    addProductCount: number;
    isOpenInstructionSize: boolean;
}

const initialState: IProductBasicInfoState = {
    addProductCount: 1,
    isOpenInstructionSize: false,
};

const ProductBasicInfo: React.FunctionComponent<IProductBasicInfoProps> = (props) => {
    const { productItem } = props;
    const [state, setState] = useImmerState<IProductBasicInfoState>(initialState);
    const { addProductCount, isOpenInstructionSize, selectedColor, selectedSize } = state;
    const { favoriteProducts } = useAppSelector(favoriteProductState);
    const { user } = useAppSelector(userState);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const notify = useNotification();

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

    const isFavoriteProduct = React.useMemo(() => {
        return favoriteProducts.some((product) => product._id === productItem._id);
    }, [favoriteProducts, productItem._id]);

    const onAddFavoriteProduct = async () => {
        if (user) {
            await ProductService.addFavoriteProduct(productItem._id).then((data) => {
                if (data.status === IResponseStatus.Error) {
                    notify.error(data.message);
                } else {
                    notify.success(data.message);
                    dispatch(addFavoriteProduct(productItem));
                }
            });
        } else {
            dispatch(addFavoriteProduct(productItem));
        }
    };

    const onRemoveFavoriteProduct = async () => {
        if (user) {
            await ProductService.removeFavoriteProduct(productItem._id).then((data) => {
                if (data.status === IResponseStatus.Error) {
                    notify.error(data.message);
                } else {
                    notify.success(data.message);
                    dispatch(removeFavoriteProduct(productItem._id));
                }
            });
        } else {
            dispatch(removeFavoriteProduct(productItem._id));
        }
    };

    const getProductStockStatus = (product: IProductInfo): string => {
        return product.stockQuantity > 0 ? "Còn hàng" : "Hết hàng";
    };

    const handleAddToCart = (redirectTo?: string) => {
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
            if (redirectTo) {
                setTimeout(() => navigate(redirectTo), 1000);
            }
        }
    };
    return (
        <React.Fragment>
            <Container className="w-full text-primary text-sm">
                <Box padding={[0, 0, 16, 0]} margin={[0, 0, 16, 0]} className="w-full !border-b !border-[#DDE1EF]">
                    <Text margin={[0, 0, 4, 0]} fontWeight="bold" size="3xl" titleText={productItem.productName} />
                    <Flex align="center" justify="space-between">
                        <Text as="span" titleText={`Mã: ${productItem._id}`} />
                        <TooltipLabel alwaysShow width="auto" placement="left" tooltipDescription="Thêm vào yêu thích" onClick={!isFavoriteProduct ? onAddFavoriteProduct : onRemoveFavoriteProduct}>
                            <Text
                                size="2xl"
                                className={classNames("cursor-pointer", {
                                    "text-red-500": isFavoriteProduct,
                                    "text-[#333]": !isFavoriteProduct,
                                })}
                                titleText={isFavoriteProduct ? <FaHeart /> : <FaRegHeart />}
                            />
                        </TooltipLabel>
                    </Flex>
                    <Box className="inline-flex gap-2">
                        <Text as="span" size="sm" titleText={`Thương hiệu: ${productItem.brandName}  |  Tình trạng: ${getProductStockStatus(productItem)}`} />
                    </Box>
                </Box>
                <Box padding={[0, 0, 16, 0]} className="w-full">
                    <Box margin={[0, 0, 20, 0]}>
                        <Text className="!tracking-normal !leading-6" titleText={productItem.description} />
                    </Box>
                    <Flex align="center" className="relative !mb-6 bg-[#f5f5f5] !px-2.5 !py-2 !pr-15 ">
                        {productItem.salePrice ? (
                            <React.Fragment>
                                <Text color="#c30000" fontWeight="bold" size="3xl" margin={[0, 8, 0, 0]} titleText={formatCurrency(productItem.salePrice)} />
                                <Text size="lg" className="line-through" titleText={formatCurrency(productItem.originalPrice)} />
                                <Box className="absolute top-0 bottom-0 right-0 w-14 inline-flex items-center justify-center !bg-[#c30000] text-white font-semibold [clip-path:polygon(20%_0%,100%_0%,100%_100%,0%_100%)]">
                                    {getSalePercent(productItem.originalPrice, productItem.salePrice)}%
                                </Box>
                            </React.Fragment>
                        ) : (
                            <Text color="#c30000" fontWeight="bold" size="3xl" margin={[0, 8, 0, 0]} titleText={formatCurrency(productItem.originalPrice)} />
                        )}
                    </Flex>
                    <Box margin={[0, 0, 8, 0]}>
                        <Text size="base">
                            Màu sắc: <Text as="span" fontWeight="bold" titleText={selectedColor?.name} />
                        </Text>
                    </Box>
                    <Box margin={[0, 0, 24, 0]} className="inline-flex gap-2.5">
                        {productItem.productColors.map((item) => (
                            <Box
                                key={item.id}
                                className={classNames("w-8.5 h-8.5 !rounded-full !border !border-[#9d9d9d] inline-flex items-center justify-center cursor-pointer", {
                                    "shadow-primary !border-2 !border-white": item.id === selectedColor?.id,
                                })}
                                style={{
                                    backgroundColor: item.hex,
                                }}
                                role="button"
                                onClick={() => setState({ selectedColor: item })}
                            />
                        ))}
                    </Box>
                    {productItem.productSizes.length > 0 && (
                        <Box margin={[0, 0, 8, 0]}>
                            <Text size="base">
                                Kích thước: <Text as="span" fontWeight="bold" titleText={selectedSize} />
                            </Text>
                        </Box>
                    )}
                    <Box margin={[0, 0, 24, 0]} className={productItem.productSizes && productItem.productSizes.length > 0 ? "visible inline-flex gap-2" : "invisible"}>
                        {productItem.productSizes.map((item) => (
                            <Box
                                key={item}
                                className={classNames("w-8.5 h-8.5 !border !border-[#9d9d9d] inline-flex items-center justify-center cursor-pointer", {
                                    "text-white !bg-[#002d3a]": item === selectedSize,
                                })}
                                role="button"
                                onClick={() => setState({ selectedSize: item })}
                            >
                                {item}
                            </Box>
                        ))}
                    </Box>
                    <Flex align="center" gap={8} className="!mb-4" onClick={() => setState({ isOpenInstructionSize: true })} onMouseDown={(e) => e.preventDefault()}>
                        <TfiRulerAlt className="text-[#fd7e14] text-lg" />
                        <TooltipLabel alwaysShow width="auto" tooltipDescription="Gợi ý tìm size">
                            <Text size="base" className="cursor-pointer hover:text-[#a2ff00]" titleText="Hướng dẫn chọn kích cỡ" />
                        </TooltipLabel>
                    </Flex>
                    <Flex align="center" justify="flex-start" gap={8} className="!mb-4">
                        <Text as="span" size="base" fontWeight="bold" titleText="Số lượng:" />
                        <Flex align="center">
                            <BaseButton
                                className="w-9 h-10 !border !border-[#ddd]"
                                colors={{
                                    normal: {
                                        textColor: "#333",
                                        bgColor: "#f8f8f8",
                                    },
                                    hover: {
                                        textColor: "white",
                                        bgColor: "#002d3a",
                                    },
                                }}
                                padding={[4, 4, 4, 4]}
                                textProps={{
                                    size: "xs",
                                    fontWeight: 400,
                                }}
                                displayText={<LuMinus />}
                                onClick={onDecreaseCount}
                            />
                            <BaseInput
                                withoutBorder
                                type="text"
                                value={addProductCount.toString()}
                                onChange={(value) => {
                                    if (isInputOnlyNumber(value) && parseInt(value) >= 1 && parseInt(value) <= 99) {
                                        setState({ addProductCount: parseInt(value) });
                                    }
                                }}
                                className="h-10 w-12.5 !p-1 text-base text-center !border-y !border-gray-200"
                            />
                            <BaseButton
                                className="w-9 h-10 !border !border-[#ddd]"
                                colors={{
                                    normal: {
                                        textColor: "#333",
                                        bgColor: "#f8f8f8",
                                    },
                                    hover: {
                                        textColor: "white",
                                        bgColor: "#002d3a",
                                    },
                                }}
                                padding={[4, 4, 4, 4]}
                                textProps={{
                                    size: "xs",
                                    fontWeight: 400,
                                }}
                                displayText={<LuPlus />}
                                onClick={onIncreaseCount}
                            />
                        </Flex>
                    </Flex>
                    <Flex align="center" gap={4} className="!mb-4">
                        <BaseButton
                            textProps={{
                                size: "base",
                                fontWeight: 600,
                                textTransform: "uppercase",
                            }}
                            colors={{
                                normal: {
                                    textColor: "white",
                                    bgColor: "#002d3a",
                                },
                                hover: {
                                    textColor: "#333",
                                    bgColor: "#77e322",
                                },
                            }}
                            padding={[10, 24, 10, 24]}
                            className="flex-1 h-10.5 [clip-path:polygon(0%_0%,100%_0%,95%_100%,0%_100%)]"
                            displayText="Thêm vào giỏ"
                            onClick={() => handleAddToCart()}
                        />
                        <BaseButton
                            textProps={{
                                size: "base",
                                fontWeight: 600,
                                textTransform: "uppercase",
                            }}
                            colors={{
                                normal: {
                                    textColor: "#333",
                                    bgColor: "#a2ff00",
                                },
                                hover: {
                                    textColor: "#333",
                                    bgColor: "#77e322",
                                },
                            }}
                            padding={[10, 24, 10, 24]}
                            className="flex-1 h-10.5 [clip-path:polygon(5%_0%,100%_0%,100%_100%,0%_100%)]"
                            displayText="Mua ngay"
                            onClick={() => handleAddToCart("/cart")}
                        />
                    </Flex>
                </Box>
            </Container>
            {isOpenInstructionSize && <InstructionSizeDialog isOpen={isOpenInstructionSize} onClose={() => setState({ isOpenInstructionSize: false })} />}
        </React.Fragment>
    );
};

export { ProductBasicInfo };
