/** @format */

import React from "react";
import { Checkbox } from "antd";
import "./ProductFilterItem.scss";
import { ICommonFilterOptions } from "@/types";
import { Box, Text } from "../elements";

interface IProductFilterItemProps {
    label?: string;
    filterOptions: ICommonFilterOptions[];
    filterValue: number[];
    onFilterChange: (checkedFilterList: ICommonFilterOptions[]) => void;
}

const ProductFilterItem: React.FC<IProductFilterItemProps> = (props) => {
    const { label, filterOptions, filterValue, onFilterChange } = props;

    const onChangeFilter = (checkedValues: number[]) => {
        const checkedFilterList = filterOptions.filter((option) => checkedValues.includes(option.value));
        onFilterChange(checkedFilterList);
    };

    return (
        <Box padding={[16, 0, 24, 0]} className="!border-b-1 !border-[#eee]">
            {label && <Text fontWeight="bold" textTransform="uppercase" margin={[0, 0, 12, 0]} titleText={label} />}
            <Checkbox.Group className="filter-checkbox-group-wrapper" options={filterOptions} value={filterValue} onChange={onChangeFilter} />
        </Box>
    );
};

export { ProductFilterItem };
