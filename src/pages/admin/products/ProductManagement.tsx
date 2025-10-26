/** @format */

import React from "react";
import { Pagination, Input, Flex, Spin, Modal, Button } from "antd"; // Import Input, Flex, Spin
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { BaseButton, Box, Container, FilterButton, ProductCard, Text } from "@/components";
import { IFilterValueItem, IProductInfo, IResponseStatus } from "@/types";
import { ProductService } from "@/services";
import { useImmerState } from "@/hooks";
import { useNotification } from "@/context";
import { productAdminFilterOptions } from "@/utils";

interface IProductFilterValues {
    productType?: number[];
    sportTypes?: number[];
    productGender?: number[];
    productVisibility?: number[];
}

interface IProductManagementState {
    searchValue: string;
    searchText: string;
    products: IProductInfo[];
    isLoading: boolean;
    activeFilters: IProductFilterValues;
    currentPage: number;
    productCounts: number;
    productDeleteId: string;
    isOpenDeleteProductDialog: boolean;
}

const initialState: IProductManagementState = {
    searchText: "",
    searchValue: "",
    currentPage: 1,
    activeFilters: {},
    isLoading: false,
    products: [],
    productCounts: 0,
    productDeleteId: "",
    isOpenDeleteProductDialog: false,
};

const ProductManagement: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<IProductManagementState>(initialState);
    const { isLoading, products, searchValue, searchText, activeFilters, currentPage, productCounts, productDeleteId, isOpenDeleteProductDialog } = state;
    const navigate = useNavigate();
    const notify = useNotification();
    const ITEMS_PER_PAGE = 9;

    React.useEffect(() => {
        const getAllProduct = async () => {
            try {
                setState({ isLoading: true });
                const data = await ProductService.getProduct({
                    filters: activeFilters,
                    search: searchValue,
                    limit: ITEMS_PER_PAGE,
                    page: currentPage,
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
    }, [activeFilters, searchValue, currentPage]);

    const handleSearch = (value) => {
        setState({ searchValue: value });
    };

    const handleApplyFilters = React.useCallback((filters: IFilterValueItem) => {
        setState({ activeFilters: filters, currentPage: 1 });
    }, []);

    const navigateToUpdateProduct = (id: string) => {
        navigate(`/admin/products/product-details?id=${id}`);
    };

    const onOpenDeleteProductDialog = (id: string) => {
        setState({
            productDeleteId: id,
            isOpenDeleteProductDialog: true,
        });
    };

    const handleDeleteProduct = async (productId) => {
        await ProductService.deleteProduct(productId!)
            .then((data) => {
                if (data.status === IResponseStatus.Error) {
                    notify.error(data.message);
                } else {
                    notify.success(data.message);
                }
            })
            .then(() => {
                navigate("/admin/products");
            });
    };

    return (
        <Container bgColor="transparent">
            <Box margin={[0, 0, 24, 0]}>
                <Text className="!text-gray-900" size="2xl" fontWeight="bold" titleText="Tất cả sản phẩm" padding={[0, 0, 16, 0]} />
            </Box>

            <Container className="!rounded-lg !shadow-sm" padding={[24, 24, 24, 24]} margin={[0, 0, 32, 0]}>
                <Flex align="center" justify="space-between" wrap="wrap" gap="middle">
                    <Input.Search
                        placeholder="Tìm kiếm sản phẩm..."
                        allowClear
                        onSearch={handleSearch}
                        value={searchText}
                        onChange={(e) => setState({ searchText: e.target.value })}
                        className="w-full max-w-[300px]"
                        size="middle"
                        disabled={isLoading}
                    />
                    <Flex gap="small">
                        <FilterButton disabled={isLoading} onApplyFilters={handleApplyFilters} currentFilters={activeFilters} availableFilters={productAdminFilterOptions} />
                        <BaseButton
                            padding={[6, 16, 6, 16]}
                            radius="md"
                            onClick={() => navigate("/admin/products/product-details")}
                            className="disabled:!bg-gray-400"
                            disabled={isLoading}
                            displayText={
                                <React.Fragment>
                                    <PlusOutlined />
                                    {"Thêm sản phẩm"}
                                </React.Fragment>
                            }
                        />
                    </Flex>
                </Flex>
            </Container>

            {isLoading ? (
                <Flex align="center" justify="center" className="min-h-[300px]">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                </Flex>
            ) : (
                <>
                    <Container
                        className="min-h-[300px] grid grid-cols-1 min-[500px]:grid-cols-2 min-[700px]:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 !gap-6 !rounded-lg"
                        margin={[0, 0, 32, 0]}
                        padding={[16, 16, 16, 16]}
                    >
                        {products.length > 0
                            ? products.map((product) => <ProductCard key={product._id} product={product} onUpdate={navigateToUpdateProduct} onDelete={onOpenDeleteProductDialog} />)
                            : !isLoading && <Text textAlign="center" padding={[40, 0, 40, 0]} className="col-span-full text-gray-500" titleText="Không tìm thấy sản phẩm nào phù hợp" />}
                    </Container>
                    {isOpenDeleteProductDialog && (
                        <Modal title="Xóa sản phẩm" open={isOpenDeleteProductDialog} onCancel={() => setState({ isOpenDeleteProductDialog: false })} footer={null} centered className="!rounded-lg">
                            <Container margin={[16, 0, 0, 0]}>
                                <Text className="text-gray-800 block" titleText="Bạn có chắc chắn muốn xóa sản phẩm này?" margin={[0, 0, 4, 0]} />

                                <Flex justify="flex-end" className="!space-x-2">
                                    <Button onClick={() => setState({ isOpenDeleteProductDialog: false })} className="!px-4 !py-2">
                                        Hủy
                                    </Button>
                                    <Button type="primary" onClick={() => handleDeleteProduct(productDeleteId)} className="!bg-red-600 !border-red-600 hover:!bg-red-700 !px-4 !py-2">
                                        Xóa
                                    </Button>
                                </Flex>
                            </Container>
                        </Modal>
                    )}
                    {products.length > 0 && (
                        <Flex justify="end">
                            <Pagination
                                current={currentPage}
                                total={productCounts}
                                pageSize={ITEMS_PER_PAGE}
                                onChange={(page: number) => setState({ currentPage: page })}
                                showSizeChanger={false}
                                showQuickJumper={false}
                                className="text-center"
                                disabled={isLoading}
                            />
                        </Flex>
                    )}
                </>
            )}
        </Container>
    );
};

export { ProductManagement };
