/** @format */

export interface IIconProps {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    rotate?: number;
}

export interface ICollapseLabelProps {
    key: string;
    iconProps: IIconProps;
    label: string;
    children?: ICollapseLabelProps[];
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

export const sportListFake = [
    {
        categoryName: "Thể thao dưới nước",
        children: ["Bơi lội", "Lặn biển", "Lướt sóng"],
    },
    {
        categoryName: "Thể thao ngoài trời",
        children: ["Leo núi", "Đi bộ đường dài", "Cắm trại"],
    },
    {
        categoryName: "Thể thao đồng đội",
        children: ["Bóng đá", "Bóng rổ", "Bóng chuyền"],
    },
    {
        categoryName: "Thể thao cá nhân",
        children: ["Quần vợt", "Cầu lông", "Bóng bàn"],
    },
];

export const menListFake = [
    {
        categoryName: "Giày dép",
        children: ["Giày thể thao", "Giày da", "Giày sandal"],
    },
    {
        categoryName: "Quần áo",
        children: ["Áo thun", "Quần jeans", "Áo khoác"],
    },
    {
        categoryName: "Phụ kiện",
        children: ["Mũ lưỡi trai", "Kính mát", "Thắt lưng"],
    },
];

export const womenListFake = [
    {
        categoryName: "Giày dép",
        children: ["Giày cao gót", "Giày bệt", "Giày thể thao"],
    },
    {
        categoryName: "Quần áo",
        children: ["Váy", "Áo sơ mi", "Quần legging"],
    },
    {
        categoryName: "Phụ kiện",
        children: ["Túi xách", "Khăn quàng cổ", "Trang sức"],
    },
];

export const accessoriesListFake = [
    {
        categoryName: "Phụ kiện thể thao",
        children: ["Bóng", "Vợt", "Găng tay"],
    },
    {
        categoryName: "Thiết bị điện tử",
        children: ["Đồng hồ thông minh", "Máy đo nhịp tim", "Tai nghe"],
    },
    {
        categoryName: "Đồ dùng tập luyện",
        children: ["Thảm tập yoga", "Dây kháng lực", "Tạ tay"],
    },
]
