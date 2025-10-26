/** @format */

import { ProductGender, ProductType, SportType } from "@/types";

export interface IIconProps {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    rotate?: number;
}

type ICollapseLabelPropsWithTo = Omit<ICollapseLabelProps, "to"> & { to: string };

export interface ICollapseLabelProps {
    key: string;
    iconProps?: IIconProps;
    label: string;
    to?: string;
    children?: ICollapseLabelPropsWithTo[];
}
export const parentCategoryListProps: ICollapseLabelProps[] = [
    {
        key: "sportsCategoryList",
        label: "Môn thể thao",
        iconProps: {
            src: "https://img.icons8.com/fluency-systems-filled/48/sports.png",
            alt: "sports category list",
            width: 30,
            height: 30,
        },
    },
    {
        key: "menList",
        label: "Nam",
        iconProps: {
            src: "https://img.icons8.com/ios/50/motosport.png",
            alt: "men list",
            width: 30,
            height: 30,
        },
    },
    {
        key: "womenList",
        label: "Nữ",
        iconProps: {
            src: "https://img.icons8.com/ios-filled/50/battle-ropes--v2.png",
            alt: "women list",
            width: 30,
            height: 30,
        },
    },
    {
        key: "accessoriesList",
        label: "Phụ kiện",
        iconProps: {
            src: "https://img.icons8.com/glyph-neue/64/apple-watch.png",
            alt: "accessories list",
            width: 30,
            height: 30,
            rotate: 90,
        },
    },
];

export const instructionsAndPolicyList: ICollapseLabelProps[] = [
    {
        key: "buyingInstructionsParent",
        label: "Hướng dẫn mua hàng",
        children: [
            {
                key: "howToOrder",
                label: "Hướng dẫn mua hàng",
                to: "/instruction/purchasing",
            },
            {
                key: "paymentInstruction",
                label: "Hướng dẫn thanh toán",
                to: "/instruction/transfer",
            },
            {
                key: "refundInstruction",
                label: "Hướng dẫn hoàn hàng",
                to: "/instruction/refund",
            },
        ],
    },
    {
        key: "buyingPolicyParent",
        label: "Chính sách mua hàng",
        children: [
            {
                key: "buyingPolicy",
                label: "Chính sách mua hàng",
                to: "/policy/purchasing",
            },
            {
                key: "paymentPolicy",
                label: "Chính sách thanh toán",
                to: "/policy/payment",
            },
            {
                key: "shippingPolicy",
                label: "Chính sách vận chuyển",
                to: "/policy/shipping",
            },
        ],
    },
];

export const sportListMenu = [
    {
        categoryName: "Thể thao dưới nước",
        children: [
            {
                label: "Bơi lội",
                value: SportType.Swimming,
            },
        ],
    },
    {
        categoryName: "Chạy bộ & Đi bộ",
        children: [
            {
                label: "Đi bộ",
                value: SportType.Jogging,
            },
            {
                label: "Cắm trại",
                value: SportType.Camping,
            },
        ],
    },
    {
        categoryName: "Các môn Fitness",
        children: [
            {
                label: "Gym",
                value: SportType.Fitness,
            },
        ],
    },
    {
        categoryName: "Đạp xe và trượt ván",
        children: [
            {
                label: "Đạp xe",
                value: SportType.Cycling,
            },
        ],
    },
    {
        categoryName: "Thể thao đồng đội",
        children: [
            {
                label: "Bóng rổ",
                value: SportType.Basketball,
            },
            {
                label: "Bóng đá",
                value: SportType.Football,
            },
            {
                label: "Bóng chuyền",
                value: SportType.Volleyball,
            },
        ],
    },
    {
        categoryName: "Thể thao cá nhân",
        children: [
            {
                label: "Cầu lông",
                value: SportType.Badminton,
            },
            {
                label: "Bóng bàn",
                value: SportType.TableTennis,
            },
            {
                label: "Tennis",
                value: SportType.Tennis,
            },
        ],
    },
];

export const menListMenu = [
    {
        categoryName: "Giày dép",
        to: `/products?productType=${ProductType.Shoes}&gender=${ProductGender.Male}`,
    },
    {
        categoryName: "Quần áo",
        to: `/products?productType=${ProductType.Shorts}&productType=${ProductType.TShirt}&gender=${ProductGender.Male}`,
    },
    {
        categoryName: "Phụ kiện",
        to: `/products?productType=${ProductType.Accessory}&gender=${ProductGender.Male}`,
    },
];

export const womenListMenu = [
    {
        categoryName: "Giày dép",
        to: `/products?productType=${ProductType.Shoes}&gender=${ProductGender.Female}`,
    },
    {
        categoryName: "Quần áo",
        to: `/products?productType=${ProductType.Shorts}&productType=${ProductType.TShirt}&gender=${ProductGender.Female}`,
    },
    {
        categoryName: "Phụ kiện",
        to: `/products?productType=${ProductType.Accessory}&gender=${ProductGender.Female}`,
    },
];

export const accessoriesListMenu = [
    {
        categoryName: "Phụ kiện thể thao",
        to: `/products?productType=${ProductType.Accessory}`,
    },
    {
        categoryName: "Thiết bị điện tử",
        to: `/products?productType=${ProductType.Accessory}`,
    },
    {
        categoryName: "Đồ dùng tập luyện",
        to: `/products?productType=${ProductType.Accessory}`,
    },
];
