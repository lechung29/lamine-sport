/** @format */

import { ProductType } from "@/types";
import { productTypeOptions } from "@/utils";

export const getProductType = (type: ProductType) => {
    return productTypeOptions.find((item) => item.value === type)?.label;
};
