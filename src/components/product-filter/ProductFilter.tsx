/** @format */

import React from "react";
import { ProductFilterItem } from "./ProductFilterItem";
import { colorFilterValueList, genderFilterValueList, IFilterGroupType, IProductFilterOptionsProps, productPriceFilterValueList } from "./utils";
import { cloneDeep, differenceBy } from "lodash";
import { IoClose } from "react-icons/io5";

const ProductFilter: React.FunctionComponent = () => {
    const [displayedFilters, setDisplayedFilters] = React.useState<IProductFilterOptionsProps[]>([]);
    const [priceFilterValue, setPriceFilterValue] = React.useState<IProductFilterOptionsProps[]>([]);
    const [genderFilterValue, setGenderFilterValue] = React.useState<IProductFilterOptionsProps[]>([]);
    const [colorFilterValue, setColorFilterValue] = React.useState<IProductFilterOptionsProps[]>([]);

    const handleFilterChange = (checkedFilterList: IProductFilterOptionsProps[], filterGroupType: IFilterGroupType) => {
        let newDisplayedFilters = cloneDeep(displayedFilters);
        const groupTypeFilterList = newDisplayedFilters.filter((filter) => filter.type === filterGroupType);

        const addedFilterList = differenceBy(checkedFilterList, groupTypeFilterList, "value");
        const removedFilterList = differenceBy(groupTypeFilterList, checkedFilterList, "value");

        if (addedFilterList.length > 0) {
            newDisplayedFilters = [...newDisplayedFilters, ...addedFilterList];
        }

        if (removedFilterList.length > 0) {
            newDisplayedFilters = newDisplayedFilters.filter((filter) => !removedFilterList.some((removed) => filter.type === filterGroupType && removed.value === filter.value));
        }

        switch (filterGroupType) {
            case IFilterGroupType.Price:
                setPriceFilterValue(checkedFilterList);
                break;
            case IFilterGroupType.Gender:
                setGenderFilterValue(checkedFilterList);
                break;
            case IFilterGroupType.Color:
                setColorFilterValue(checkedFilterList);
                break;
            default:
                break;
        }
        setDisplayedFilters(newDisplayedFilters);
    };

    const onRemoveFilter = (filterValue: IProductFilterOptionsProps)=> {
        const newAllDisplayedFilters = displayedFilters.filter((item) => !(item.type === filterValue.type && item.value === filterValue.value))
        switch (filterValue.type) {
            case IFilterGroupType.Price:
                const newSingleFilterPrice = priceFilterValue.filter((item) => !(item.value === filterValue.value));
                setPriceFilterValue(newSingleFilterPrice);
                break;
            case IFilterGroupType.Gender:
                const newSingleFilterByGender = genderFilterValue.filter((item) => !(item.value === filterValue.value));
                setGenderFilterValue(newSingleFilterByGender);
                break;
            case IFilterGroupType.Color:
                const newSingleFilterByColor = genderFilterValue.filter((item) => !(item.value === filterValue.value));
                setGenderFilterValue(newSingleFilterByColor);
                break;
            default:
                break;
        }
        setDisplayedFilters(newAllDisplayedFilters);
    }

    const onResetFilter = () => {
        setDisplayedFilters([]);
        setGenderFilterValue([])
        setPriceFilterValue([])
        setColorFilterValue([])
    }

    return (
        <div className="w-full h-auto !mb-7.5 !border-1 !border-[#eee]">
            <div className="w-full bg-[#eee] !p-2.5 !mb-2.5">
                <div className="w-full flex items-center gap-2">
                    <img width="24" height="24" src="https://img.icons8.com/badges/48/sorting-options.png" alt="filter-icons" />
                    <span className="text-[#333] text-xl uppercase font-bold">Bộ lọc sản phẩm</span>
                </div>
            </div>
            <div className="w-full !px-2.5 !py-0">
                {!!displayedFilters.length && <div className="!pb-4 !border-b-1 !border-[#eee]">
                    <div className="flex items-center justify-between !mb-2">
                        <p className="text-[#002d3a] font-semibold">Bạn chọn</p>
                        <div 
                            className="flex items-center gap-0.5 text-[#bf1e2e] hover:!text-[#77e322] cursor-pointer" 
                            role="button"
                            onClick={() => onResetFilter()}
                        >
                            {"Bỏ chọn hết"}
                            <IoClose />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                        {displayedFilters.map((filterValue) => (
                            <div 
                                className="!px-1.5 !py-0.5 bg-[#002d3e] text-white text-sm flex items-center gap-1 cursor-pointer"
                                role="button"
                                onClick={() => onRemoveFilter(filterValue)}
                            >
                                <IoClose />
                                {filterValue.label}
                            </div>
                        ))}
                    </div>
                </div>}
                <div className="h-auto">
                    <ProductFilterItem
                        label="Chọn mức giá"
                        filterOptions={productPriceFilterValueList}
                        filterValue={priceFilterValue.map((option) => option.value)}
                        onFilterChange={(checkedFilterList) => handleFilterChange(checkedFilterList, IFilterGroupType.Price)}
                    />
                </div>
                <div className="h-auto">
                    <ProductFilterItem
                        label="Màu sắc"
                        filterOptions={colorFilterValueList}
                        filterValue={colorFilterValue.map((option) => option.value)}
                        onFilterChange={(checkedFilterList) => handleFilterChange(checkedFilterList, IFilterGroupType.Color)}
                    />
                </div>
                <div className="h-auto">
                    <ProductFilterItem
                        label="Giới tính"
                        filterOptions={genderFilterValueList}
                        filterValue={genderFilterValue.map((option) => option.value)}
                        onFilterChange={(checkedFilterList) => handleFilterChange(checkedFilterList, IFilterGroupType.Gender)}
                    />
                </div>
            </div>
        </div>
    );
};

export { ProductFilter };
