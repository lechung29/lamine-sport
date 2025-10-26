/** @format */

import { Box, Breadcrumbs, Container, ProductFilter, ProductFilterButton, ProductItem, ProductSort } from "@/components";
import { breadcrumbState, useAppSelector } from "@/redux-store";

import React, { useCallback, useRef, useMemo } from "react";
import { getAllProductBannerImages } from "./utils";
import { productCustomerFilterList } from "@/utils";
import { Empty, Flex, Pagination, Skeleton } from "antd";
import { IFilterValueItem, IProductCustomerFilterValue, IProductInfo, IResponseStatus } from "@/types";
import { useDebounce, useImmerState } from "@/hooks";
import { ProductService } from "@/services";
import { useSearchParams } from "react-router-dom";

interface IProductProps {
    currentPage: number;
    activeFilters: IProductCustomerFilterValue;
    products: IProductInfo[];
    isLoading: boolean;
    productCounts: number;
    activeSort: string;
}

const Product: React.FunctionComponent = () => {
    const [searchParams] = useSearchParams();
    const sportTypesParam = searchParams.getAll("sportType");
    const productGenderParam = searchParams.getAll("gender");
    const productTypeParam = searchParams.getAll("productType");

    let initialFilter = {};
    if (sportTypesParam) {
        initialFilter["sportTypes"] = Array.isArray(sportTypesParam) ? sportTypesParam.map((item) => Number(item)) : [Number(sportTypesParam)];
    }

    if (productGenderParam) {
        initialFilter["productGender"] = Array.isArray(productGenderParam) ? productGenderParam.map((item) => Number(item)) : [Number(productGenderParam)];
    }

    if (productTypeParam) {
        initialFilter["productType"] = Array.isArray(productTypeParam) ? productTypeParam.map((item) => Number(item)) : [Number(productTypeParam)];
    }

    const initialState: IProductProps = useMemo(
        () => ({
            currentPage: 1,
            activeFilters: initialFilter,
            products: [],
            isLoading: false,
            productCounts: 0,
            activeSort: "default",
        }),
        [sportTypesParam, productTypeParam, productGenderParam]
    );

    const [state, setState] = useImmerState<IProductProps>(initialState);
    const { activeFilters, currentPage, products, isLoading, productCounts, activeSort } = state;
    const debouncedFilters = useDebounce(activeFilters, 1000);
    const debouncedCurrentPage = useDebounce(currentPage, 1000);
    const debouncedSort = useDebounce(state.activeSort, 1000);
    const { breadcrumbList } = useAppSelector(breadcrumbState);
    const ref = useRef<HTMLDivElement>(null);
    
    const handleApplyFilters = useCallback((filters: IFilterValueItem) => {
        setState({ activeFilters: filters, currentPage: 1 });
    }, []);

    const handleApplySort = useCallback((sort: string) => {
        setState({ activeSort: sort, currentPage: 1 });
    }, []);

    React.useEffect(() => {
        const getAllProduct = async () => {
            try {
                setState({ isLoading: true });
                const data = await ProductService.getProduct({
                    filters: debouncedFilters,
                    limit: 12,
                    sort: debouncedSort,
                    page: debouncedCurrentPage,
                });
                if (data.status === IResponseStatus.Error) {
                    setState({ products: [], productCounts: 0 });
                } else {
                    setState({ products: data.data?.products, productCounts: data.data?.totalCounts });
                }
            } catch (error) {
                setState({ products: [], productCounts: 0 });
            } finally {
                setState({ isLoading: false });
            }
        };

        getAllProduct();
    }, [debouncedFilters, debouncedCurrentPage, debouncedSort]);

    return (
        <Container>
            <Breadcrumbs />
            <Container padding={[0, 16, 0, 16]} className="h-auto sm:!px-8 lg:!px-[45px]">
                <Box
                    className="h-auto"
                    margin={[0, 0, 20, 0]}
                    style={{
                        backgroundImage: `url(${getAllProductBannerImages(breadcrumbList[breadcrumbList.length - 1]?.title || "Default Title")})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        aspectRatio: "auto 1900/300",
                    }}
                    ref={ref}
                />
                <Container className="w-full flex flex-col lg:flex-row">
                    <Box className="w-4/17 hidden lg:block" margin={[0, 16, 0, 0]}>
                        <ProductFilter currentFilter={activeFilters} onApplyFilter={handleApplyFilters} />
                    </Box>

                    <Flex vertical className="flex-1 lg:!ml-4">
                        <Flex align="center" justify="space-between" className="!mb-4 lg:!justify-end">
                            <ProductFilterButton className="lg:!hidden" availableFilters={productCustomerFilterList} currentFilters={activeFilters} onApplyFilters={handleApplyFilters} />
                            <ProductSort activeSort={activeSort} onSortChange={(sortValue) => handleApplySort(sortValue)} />
                        </Flex>

                        {isLoading ? (
                            <Box
                                className="!mb-8"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                    gap: "16px",
                                    width: "100%",
                                }}
                            >
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <Flex key={index} vertical className="!p-2 border border-gray-200 shadow-sm">
                                        <Skeleton.Node active style={{ width: "100%", height: 160, marginBottom: 16 }} />
                                        <Skeleton active paragraph={{ rows: 3 }} />
                                    </Flex>
                                ))}
                            </Box>
                        ) : productCounts > 0 ? (
                            <Container className="flex-1">
                                <Box
                                    className="!mb-8"
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                        gap: "16px",
                                        width: "100%",
                                    }}
                                >
                                    {products.map((item) => (
                                        <ProductItem productItem={item!} key={item._id} />
                                    ))}
                                </Box>
                            </Container>
                        ) : (
                            <Flex align="center" justify="center" className="min-h-60">
                                <Empty description="Không tìm thấy sản phẩm phù hợp" />
                            </Flex>
                        )}

                        {!isLoading && productCounts > 0 && (
                            <Flex align="center" justify="center" onMouseDown={(e) => e.preventDefault()}>
                                <Pagination
                                    current={currentPage}
                                    total={productCounts}
                                    pageSize={12}
                                    onChange={(page: number) => {
                                        setState({ currentPage: page });
                                        ref.current?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "start",
                                        });
                                    }}
                                    showSizeChanger={false}
                                    showQuickJumper={false}
                                    className="text-center"
                                    disabled={isLoading}
                                />
                            </Flex>
                        )}
                    </Flex>
                </Container>
            </Container>
        </Container>
    );
};

export { Product };
