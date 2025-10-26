/** @format */

import { Box, Breadcrumbs, Container, ProductItem, Text } from "@/components";
import { useAppSelector, userState } from "@/redux-store";
import { Alert, Flex, Pagination, Spin } from "antd";
import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { NotFound } from "../not-found";
import { IProductInfo, IResponseStatus } from "@/types";
import { ProductService } from "@/services";

const Search: React.FunctionComponent = () => {
    const [searchParams] = useSearchParams();
    const productName = searchParams.get("productName");
    const { user } = useAppSelector(userState);
    const location = useLocation();
    const [productList, setProductList] = React.useState<IProductInfo[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [totalCounts, setTotalCounts] = React.useState<number>(0);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const itemsPerPage = 5;

    const getProductBySearch = async () => {
        try {
            setIsLoading(true);
            const result = await ProductService.searchProduct(
                {
                    search: productName!.trim(),
                    page: currentPage,
                    limit: itemsPerPage,
                },
                !!user ? user._id : null
            );
            if (result.status === IResponseStatus.Error) {
                setTotalCounts(0);
                setProductList([]);
            } else {
                setTotalCounts(result.data?.totalCounts ?? 0);
                setProductList(result.data?.products ?? []);
            }
        } catch (error) {
            setProductList([]);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (productName) {
            getProductBySearch();
        }
    }, [productName, location.state, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!productName) {
        return <NotFound />;
    }

    return (
        <Container className="w-full min-h-screen">
            <Breadcrumbs />
            <Container className="!px-8 lg:!px-[45px] !py-6">
                <Text margin={[0, 0, 15, 0]} size="lg" fontWeight="bold" textTransform="uppercase" className="text-gray-900" titleText="Danh sách tìm kiếm" />
                <Box margin={[0, 0, 16, 0]}>
                    {isLoading ? (
                        <Flex align="center" justify="center" className="w-full h-[300px]">
                            <Spin size="default" />
                        </Flex>
                    ) : productList.length > 0 ? (
                        <React.Fragment>
                            <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-5">
                                {productList.map((product) => (
                                    <ProductItem key={product._id} productItem={product} />
                                ))}
                            </Box>

                            {totalCounts > 0 && (
                                <Box margin={[24, 0, 0, 0]} className="flex justify-center">
                                    <Pagination current={currentPage} total={totalCounts} pageSize={itemsPerPage} onChange={handlePageChange} showSizeChanger={false} />
                                </Box>
                            )}
                        </React.Fragment>
                    ) : (
                        <Alert message={<Text size="base" color="#856404" titleText="Không tìm thấy sản phẩm phù hợp!" />} type="warning" />
                    )}
                </Box>
            </Container>
        </Container>
    );
};

export { Search };
