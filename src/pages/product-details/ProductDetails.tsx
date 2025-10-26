/** @format */

import { Breadcrumbs, ProductBasicInfo, ProductPhotoView, ProductFeatures, RelatedProductList, ProductDescriptionTab, Container, Box } from "@/components";
import { ProductService } from "@/services";
import { IProductInfo, IResponseStatus } from "@/types";
import { Flex } from "antd";
import React from "react";
import "react-photo-view/dist/react-photo-view.css";
import { useParams } from "react-router-dom";
import { Loading } from "../loading";
import { NotFound } from "../not-found";

const features = [
    { icon: <img width="40" height="40" src="https://img.icons8.com/dotty/80/security-checked.png" alt="security-checked" />, text: "Cam kết chính hãng 100%" },
    { icon: <img width="40" height="40" src="https://img.icons8.com/dotty/80/verified-account.png" alt="verified-account" />, text: "Bảo hành 12 tháng" },
    { icon: <img width="40" height="40" src="https://img.icons8.com/dotty/80/exchange-dollar.png" alt="exchange-dollar" />, text: "Đổi trả hàng trong 7 ngày" },
    { icon: <img width="40" height="40" src="https://img.icons8.com/dotty/80/free-shipping.png" alt="free-shipping" />, text: "Giao hàng nhanh toàn quốc" },
];

const ProductDetails: React.FunctionComponent = () => {
    const [product, setProduct] = React.useState<IProductInfo | undefined>();
    const [relatedProducts, setRelatedProducts] = React.useState<IProductInfo[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const { id } = useParams();

    React.useEffect(() => {
        const fetchProductDetails = async () => {
            setIsLoading(true);
            try {
                const data = await ProductService.getProductById(id ?? "");
                if (data.status === IResponseStatus.Error) {
                    setProduct(undefined);
                    setRelatedProducts([]);
                } else {
                    setProduct(data.data?.product);
                    setRelatedProducts(data.data?.relatedProducts || []);
                }
            } catch (error) {
                setProduct(undefined);
                setRelatedProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const getImageList = React.useCallback(() => {
        const imageList = product?.productColors.map((color) => color.images).flatMap((images) => images.map((image) => image.url!));
        return imageList || [];
    }, [product]);

    return isLoading ? (
        <Loading />
    ) : product ? (
        <Container>
            <Breadcrumbs />
            <Box className="h-auto !px-4 sm:!px-8 lg:!px-[45px]">
                <Flex wrap className="!mb-10 max-md:gap-8">
                    <Box className="w-full md:!pr-4 md:!w-1/2 lg:!w-3/8">
                        <ProductPhotoView photoList={getImageList()} />
                    </Box>

                    <Box className="w-full lg:!px-4 md:!pl-4 md:w-1/2 lg:w-3/8">
                        <ProductBasicInfo productItem={product} />
                    </Box>

                    <Box className="w-ful !pl-4 lg:w-1/4">
                        <Flex vertical>
                            <ProductFeatures items={features} />
                        </Flex>
                    </Box>
                </Flex>
                <RelatedProductList relatedProducts={relatedProducts} />
                <ProductDescriptionTab content={product.detailsDescription}/>
            </Box>
        </Container>
    ) : (
        <NotFound />
    );
};

export { ProductDetails };
