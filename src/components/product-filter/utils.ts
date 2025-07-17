/** @format */

export enum IProductPriceRangeValue {
    LessThan500K = 1,
    From500KTo1M,
    From1MTo2M,
    From2MTo5M,
    MoreThan5M,
}

export enum IProductBasicColorValue {
    Yellow = 1,
    Orange,
    Red,
    Pink,
    Purple,
    Blue,
    Green,
    Black,
    White,
}

export enum IProductGenderValue {
    Men = 1,
    Women,
}

export enum IFilterGroupType {
    Price = "Price",
    ProductType = "ProductType",
    Color = "Color",
    Gender = "Gender",
}

export interface IProductFilterOptionsProps {
    type: IFilterGroupType;
    label: string;
    value: number;
}

export const productPriceFilterValueList: IProductFilterOptionsProps[] = [
    {
        type: IFilterGroupType.Price,
        label: "Dưới 500K",
        value: IProductPriceRangeValue.LessThan500K,
    },
    {
        type: IFilterGroupType.Price,
        label: "Từ 500K - 1 triệu",
        value: IProductPriceRangeValue.From500KTo1M,
    },
    {
        type: IFilterGroupType.Price,
        label: "Từ 1 triệu - 2 triệu",
        value: IProductPriceRangeValue.From1MTo2M,
    },
    {
        type: IFilterGroupType.Price,
        label: "Từ 2 triệu - 5 triệu",
        value: IProductPriceRangeValue.From2MTo5M,
    },
    {
        type: IFilterGroupType.Price,
        label: "Trên 5 triệu",
        value: IProductPriceRangeValue.MoreThan5M,
    },
];

export const genderFilterValueList: IProductFilterOptionsProps[] = [
    {
        type: IFilterGroupType.Gender,
        label: "Nam",
        value: IProductGenderValue.Men,
    },
    {
        type: IFilterGroupType.Gender,
        label: "Nữ",
        value: IProductGenderValue.Women,
    },
];

export const colorFilterValueList: IProductFilterOptionsProps[] = [
    {
        type: IFilterGroupType.Color,
        label: "Vàng",
        value: IProductBasicColorValue.Yellow,
    },
    {
        type: IFilterGroupType.Color,
        label: "Tím",
        value: IProductBasicColorValue.Purple,
    },
    {
        type: IFilterGroupType.Color,
        label: "Đỏ",
        value: IProductBasicColorValue.Red,
    },
    {
        type: IFilterGroupType.Color,
        label: "Xanh",
        value: IProductBasicColorValue.Green,
    },
    {
        type: IFilterGroupType.Color,
        label: "Xanh dương",
        value: IProductBasicColorValue.Blue,
    },
    {
        type: IFilterGroupType.Color,
        label: "Hồng",
        value: IProductBasicColorValue.Pink,
    },
    {
        type: IFilterGroupType.Color,
        label: "Cam",
        value: IProductBasicColorValue.Orange,
    },
    {
        type: IFilterGroupType.Color,
        label: "Tráng",
        value: IProductBasicColorValue.White,
    },
    {
        type: IFilterGroupType.Color,
        label: "Đen",
        value: IProductBasicColorValue.Black,
    },
];
