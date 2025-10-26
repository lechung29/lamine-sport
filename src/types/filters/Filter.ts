/** @format */

import React from "react";

export interface ICommonFilterOptions {
    label: string | React.JSX.Element;
    value: number;
}

export type IFilterValueItem = { [key: string]: any };

export type IFilterType = "checkbox" | "text" | "dateRange";

export interface IFilterOptionType {
    id: string;
    name: string;
    type: IFilterType;
    placeholder?: string;
    options: ICommonFilterOptions[];
}

export interface IQueryObject {
    filters?: { [key: string]: any };
    sort?: string;
    limit?: number;
    page?: number;
    search?: string;
}

export interface IProductCustomerFilterValue {
    productPrice?: number[];
    productGender?: number[];
    productColors?: number[];
    productType?: number[];
    sportTypes?: number[];
}

export enum IProductCustomerFilterGroupType {
    Price = "Price",
    ProductType = "ProductType",
    SportTypes = "SportTypes",
    Color = "Color",
    Gender = "Gender",
}
