/** @format */

import { Box, Breadcrumbs, Container, ProductItem, Text } from "@/components";
import { favoriteProductState, useAppSelector } from "@/redux-store";
import { Alert, Pagination } from "antd";
import React from "react";

const Favorite: React.FunctionComponent = () => {
    const { favoriteProducts } = useAppSelector(favoriteProductState);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 5;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = favoriteProducts.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Container className="w-full min-h-screen">
            <Breadcrumbs />
            <Container className="!px-8 lg:!px-[45px] !py-6">
                <Text margin={[0, 0, 15, 0]} size="lg" fontWeight="bold" textTransform="uppercase" className="text-gray-900" titleText="Danh sách yêu thích" />
                <Box margin={[0, 0, 16, 0]}>
                    {favoriteProducts.length > 0 ? (
                        <>
                            <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                                {currentProducts.map((product) => (
                                    <ProductItem key={product._id} productItem={product} />
                                ))}
                            </Box>

                            {favoriteProducts.length > 0 && (
                                <Box margin={[24, 0, 0, 0]} className="flex justify-center">
                                    <Pagination
                                        current={currentPage}
                                        total={favoriteProducts.length}
                                        pageSize={itemsPerPage}
                                        onChange={handlePageChange}
                                        showSizeChanger={false}
                                    />
                                </Box>
                            )}
                        </>
                    ) : (
                        <Alert message={<Text size="base" color="#856404" titleText="Bạn chưa có sản phẩm yêu thích nào!" />} type="warning" />
                    )}
                </Box>
            </Container>
        </Container>
    );
};

export { Favorite };
