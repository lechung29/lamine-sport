/** @format */

import React from "react";
import { IProductFilterOptionsProps } from "./utils";
import { Checkbox } from 'antd';
import "./ProductFilterItem.scss";

interface IProductFilterItemProps {
    label?: string;
    filterOptions: IProductFilterOptionsProps[];
    filterValue: number[];
    onFilterChange: (checkedFilterList: IProductFilterOptionsProps[]) => void;
}

const ProductFilterItem: React.FC<IProductFilterItemProps> = (props) => {
    const { label, filterOptions, filterValue, onFilterChange } = props;

    const onChangeFilter = (checkedValues: number[]) => {
        const checkedFilterList = filterOptions.filter(option => checkedValues.includes(option.value));
        onFilterChange(checkedFilterList);
    }   

    return (
        <div className="w-full !pb-6 !pt-4 !border-b-1 !border-[#eee]">
            {label && <h2 className="!mb-3 !font-bold uppercase">{label}</h2>}
            <Checkbox.Group
                className="filter-checkbox-group-wrapper"
                options={filterOptions}
                value={filterValue}
                onChange={onChangeFilter}
            />
        </div>
    );
};

export { ProductFilterItem };
