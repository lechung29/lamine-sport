/** @format */

import { IQueryObject } from "@/types";

export const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export const isInputOnlyNumber = (str: string) => {
    return str.match(/^\d*$/);
};

export const isNotStartWithZero = (str: string) => {
    return str.match(/^(?!0)\d+$/);
};

export const isValidPriceInput = (str: string) => {
    return isInputOnlyNumber(str) && isNotStartWithZero(str);
};

export const formatPrice = (value: string): string => {
    if (!value) return "";
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatCurrency = (amount: number = 0): string => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

export const parsePrice = (value: string): string => {
    return value.replace(/,/g, "");
};

export const getSalePercent = (originPrice: number, salePrice?: number) => {
    if (!salePrice) {
        return 0;
    }

    const salePercent = ((originPrice - salePrice) / originPrice) * 100;

    return Math.round(salePercent);
};

export const createQueryString = (queryParam: IQueryObject) => {
    const queryParts: any = [];

    if (queryParam.filters) {
        for (const key in queryParam.filters) {
            const value = queryParam.filters[key];
            if (Array.isArray(value) && value.length > 0) {
                if (key === "dateRange" && value.length === 2) {
                    queryParts.push(`startDate=${encodeURIComponent(value[0])}`);
                    queryParts.push(`endDate=${encodeURIComponent(value[1])}`);
                } else {
                    value.forEach((item) => {
                        queryParts.push(`${key}=${encodeURIComponent(item)}`);
                    });
                }
            }
        }
    }

    if (queryParam.sort) {
        queryParts.push(`sort=${encodeURIComponent(queryParam.sort)}`);
    }
    if (queryParam.search) {
        queryParts.push(`search=${encodeURIComponent(queryParam.search)}`);
    }
    if (queryParam.page) {
        queryParts.push(`page=${encodeURIComponent(queryParam.page)}`);
    }
    if (queryParam.limit) {
        queryParts.push(`limit=${encodeURIComponent(queryParam.limit)}`);
    }

    return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
};

export const getEnumKeyByValue = <T extends Record<string, string | number>>(enumObj: T, value: string | number) => {
    return Object.keys(enumObj).find((key) => enumObj[key] === value);
};
