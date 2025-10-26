/** @format */

import { classNames, formatCurrency, getSalePercent } from "@/utils";
import { Flex, Tooltip } from "antd";
import React, { useMemo } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { TooltipLabel } from "../tooltip-label";
import { AddProductDialog } from "../add-product-dialog";
import { IProductColorProps, IProductInfo, IResponseStatus } from "@/types";
import { BaseButton, Box, Container, Image, Text } from "../elements";
import { useImmerState } from "@/hooks";
import { addFavoriteProduct, favoriteProductState, removeFavoriteProduct, useAppDispatch, useAppSelector, userState } from "@/redux-store";
import { ProductService } from "@/services";
import { useNotification } from "@/context";
import { useNavigate } from "react-router-dom";

export interface IProductItemProps {
    productItem: IProductInfo;
}

export interface IProductItemState {
    selectedColor?: IProductColorProps;
    isOpenAddProductDialog: boolean;
}

const initialState: IProductItemState = {
    isOpenAddProductDialog: false,
};

const ProductItem: React.FunctionComponent<IProductItemProps> = (props) => {
    const { productItem } = props;
    const [state, setState] = useImmerState<IProductItemState>(initialState);
    const { isOpenAddProductDialog, selectedColor } = state;
    const { favoriteProducts } = useAppSelector(favoriteProductState);
    const { user } = useAppSelector(userState);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const notify = useNotification();

    const isFavoriteProduct = useMemo(() => {
        return favoriteProducts?.some((product) => product._id === productItem._id);
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

    const productSoldInfo = useMemo(() => {
        if (selectedColor) {
            return {
                percent: Math.round((selectedColor.sale / (selectedColor.sale + selectedColor.quantity)) * 100),
                quantity: selectedColor.sale,
            };
        } else {
            return {
                percent: Math.round((productItem.saleQuantity / (productItem.saleQuantity + productItem.stockQuantity)) * 100),
                quantity: productItem.saleQuantity,
            };
        }
    }, [productItem, selectedColor]);
    const salePercent = getSalePercent(productItem.originalPrice, productItem.salePrice);

    return (
        <>
            <Container bgColor="white" className="relative min-h-[440px] !border !border-[#00000020] overflow-hidden group hover:!shadow-lg">
                <Flex vertical justify="flex-start" className="!h-full !pb-2">
                    {salePercent > 0 && (
                        <Text
                            size="sm"
                            color="white"
                            padding={[2, 12, 2, 4]}
                            className="absolute top-1 left-1 inline-block bg-[#ff3a0b] text-shadow-2xs z-10 [clip-path:polygon(0%_0%,100%_0%,90%_100%,0%_100%)]"
                            titleText={`Giảm ${salePercent}%`}
                        />
                    )}

                    <Box
                        className={classNames(
                            "absolute !top-3 transition-all duration-300 cursor-pointer !z-10",
                            "!w-9 !h-9 !rounded-full flex items-center justify-center !border !border-gray-300 !bg-gray-200/50 !backdrop-blur-sm hover:!bg-red-100 hover:!border-red-300",
                            isFavoriteProduct ? "!right-3" : "group-hover:!right-3 -right-10"
                        )}
                        onClick={!isFavoriteProduct ? onAddFavoriteProduct : onRemoveFavoriteProduct}
                    >
                        <Text
                            size="xl"
                            className={classNames({
                                "text-red-500": isFavoriteProduct,
                                "text-white group-hover:text-red-500": !isFavoriteProduct,
                            })}
                            titleText={isFavoriteProduct ? <FaHeart /> : <FaRegHeart />}
                        />
                    </Box>

                    <Box className="h-auto overflow-hidden cursor-pointer">
                        <Image
                            objectFit="contain"
                            className="w-full group-hover:!scale-105 transition-all duration-200"
                            src={selectedColor?.images[0].url || productItem.primaryImage.url}
                            alt={productItem.productName}
                        />
                    </Box>
                    <Box padding={[0, 10, 0, 10]} margin={[12, 0, 12, 0]} className="flex items-center justify-start gap-2">
                        {productItem.productColors.map((color) => (
                            <Tooltip title={color.name} color={"#002d3a"} key={color.id}>
                                <Box
                                    className={classNames("w-5 h-5 !rounded-full !outline outline-[#d0d0d0] cursor-pointer", {
                                        "!outline-2 !outline-[#a2ff00]": selectedColor?.value === color.value,
                                    })}
                                    style={{ backgroundColor: `${color.hex}` }}
                                    onClick={() => setState({ selectedColor: color })}
                                />
                            </Tooltip>
                        ))}
                    </Box>
                    <Box className="h-12">
                        <TooltipLabel
                            width="full"
                            className="flex-1 !px-[10px] text-base cursor-pointer hover:!text-[#77e322]"
                            text={productItem.productName}
                            lineDisplayed={2}
                            onClick={() => navigate(`/product/${productItem._id}`)}
                        />
                    </Box>
                    <Box padding={[0, 10, 0, 10]}>
                        <Flex className="!my-2" align="center" justify="flex-start" gap={4}>
                            {productItem?.salePrice ? (
                                <>
                                    <Text fontWeight="bold" size="base" color="#c30000" titleText={formatCurrency(productItem.salePrice)}  />
                                    <Text fontWeight="semibold" size="sm" color="#7b7b7b" className="line-through" titleText={formatCurrency(productItem.originalPrice)} />
                                </>
                            ) : (
                                <Text fontWeight="bold" size="base" color="#c30000" titleText={formatCurrency(productItem.originalPrice)}  />
                            )}
                        </Flex>
                        <BaseButton
                            width="full"
                            colors={{
                                normal: {
                                    textColor: "#333",
                                    bgColor: "#a2ff00",
                                },
                                hover: {
                                    textColor: "#fff",
                                    bgColor: "#002932",
                                },
                            }}
                            margin={[0, 0, 12, 0]}
                            onClick={() => setState({ isOpenAddProductDialog: true })}
                            displayText={
                                <React.Fragment>
                                    <IoSettingsOutline className="text-xl" />
                                    <Text as="span" size="base" titleText="Tùy chọn" />
                                </React.Fragment>
                            }
                        />
                        <Box margin={[16, 0, 0, 0]}>
                            <Box className="h-2 bg-[#ffcfb4] relative z-10">
                                <Box className="absolute h-2 z-0 left-0 top-0 bg-[#fb5831]" style={{ width: `${productSoldInfo.percent}%` }} />
                            </Box>
                            <Box margin={[4, 0, 0, 0]}>
                                <Text as="span" size="sm" titleText="Đã bán " />
                                <Text as="span" size="sm" fontWeight="semibold" titleText={`${productSoldInfo.quantity} sản phẩm`} />
                            </Box>
                        </Box>
                    </Box>
                </Flex>
            </Container>
            <AddProductDialog isOpen={isOpenAddProductDialog} productItem={productItem} onClose={() => setState({ isOpenAddProductDialog: false })} />
        </>
    );
};

export { ProductItem };
