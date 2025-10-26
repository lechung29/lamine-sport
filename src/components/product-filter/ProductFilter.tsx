/** @format */

import React from "react";
import { ProductFilterItem } from "./ProductFilterItem";
import { ICommonFilterOptions, IProductCustomerFilterGroupType, IProductCustomerFilterValue } from "@/types";
import { productCustomerFilterList } from "@/utils";
import { Box, Container, Image, Text } from "../elements";
import { Flex } from "antd";

export interface IProductFilterProps {
    currentFilter: IProductCustomerFilterValue;
    onApplyFilter: (filter: IProductCustomerFilterValue) => void;
}

const ProductFilter: React.FunctionComponent<IProductFilterProps> = (props) => {
    const { currentFilter, onApplyFilter } = props;
    const { productPrice, productColors, productGender, productType, sportTypes } = currentFilter;

    const handleFilterChange = (checkedFilterList: ICommonFilterOptions[], filterGroupType: IProductCustomerFilterGroupType) => {
        switch (filterGroupType) {
            case IProductCustomerFilterGroupType.Price:
                onApplyFilter({
                    ...currentFilter,
                    productPrice: checkedFilterList.map((filter) => filter.value),
                });
                break;
            case IProductCustomerFilterGroupType.ProductType:
                onApplyFilter({
                    ...currentFilter,
                    productType: checkedFilterList.map((filter) => filter.value),
                });
                break;
            case IProductCustomerFilterGroupType.SportTypes:
                onApplyFilter({
                    ...currentFilter,
                    sportTypes: checkedFilterList.map((filter) => filter.value),
                });
                break;
            case IProductCustomerFilterGroupType.Gender:
                onApplyFilter({
                    ...currentFilter,
                    productGender: checkedFilterList.map((filter) => filter.value),
                });
                break;
            case IProductCustomerFilterGroupType.Color:
                onApplyFilter({
                    ...currentFilter,
                    productColors: checkedFilterList.map((filter) => filter.value),
                });
                break;
            default:
                break;
        }
    };

    return (
        <Container margin={[0, 0, 30, 0]} className="h-auto !border-1 !border-[#eee]">
            <Box bgColor="#eee" padding={[10, 10, 10, 10]} margin={[0, 0, 10, 0]}>
                <Flex align="center" gap={8}>
                    <Image width="24px" height="24px" src="https://img.icons8.com/badges/48/sorting-options.png" alt="filter-icons" />
                    <Text size="xl" fontWeight="bold" textTransform="uppercase" color="#333" titleText="Bộ lọc sản phẩm" />
                </Flex>
            </Box>
            <Box padding={[0, 10, 0, 10]}>
                <Box className="h-auto">
                    <ProductFilterItem
                        label="Chọn mức giá"
                        filterOptions={productCustomerFilterList.find((filter) => filter.id === "productPrice")!?.options}
                        filterValue={productPrice || []}
                        onFilterChange={(checkedFilterList) => handleFilterChange(checkedFilterList, IProductCustomerFilterGroupType.Price)}
                    />
                </Box>
                <Box className="h-auto">
                    <ProductFilterItem
                        label="Chọn loại sản phẩm"
                        filterOptions={productCustomerFilterList.find((filter) => filter.id === "productType")!?.options}
                        filterValue={productType || []}
                        onFilterChange={(checkedFilterList) => handleFilterChange(checkedFilterList, IProductCustomerFilterGroupType.ProductType)}
                    />
                </Box>
                <Box className="h-auto">
                    <ProductFilterItem
                        label="Chọn môn thể thao"
                        filterOptions={productCustomerFilterList.find((filter) => filter.id === "sportTypes")!?.options}
                        filterValue={sportTypes || []}
                        onFilterChange={(checkedFilterList) => handleFilterChange(checkedFilterList, IProductCustomerFilterGroupType.SportTypes)}
                    />
                </Box>
                <Box className="h-auto">
                    <ProductFilterItem
                        label="Màu sắc"
                        filterOptions={productCustomerFilterList.find((filter) => filter.id === "productColors")!?.options}
                        filterValue={productColors || []}
                        onFilterChange={(checkedFilterList) => handleFilterChange(checkedFilterList, IProductCustomerFilterGroupType.Color)}
                    />
                </Box>
                <Box className="h-auto">
                    <ProductFilterItem
                        label="Giới tính"
                        filterOptions={productCustomerFilterList.find((filter) => filter.id === "productGender")!?.options}
                        filterValue={productGender || []}
                        onFilterChange={(checkedFilterList) => handleFilterChange(checkedFilterList, IProductCustomerFilterGroupType.Gender)}
                    />
                </Box>
            </Box>
        </Container>
    );
};

export { ProductFilter };
