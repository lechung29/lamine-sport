/** @format */

import {
    CouponStatus,
    CouponValueType,
    ICustomerStatus,
    IFilterOptionType,
    IProductPriceRangeValue,
    IStoreInformation,
    ProductBasicColor,
    ProductGender,
    ProductTemplateOption,
    ProductType,
    ProductVisibility,
    SportType,
} from "@/types";
import { IOrderPayment, OrderStatus } from "@/types/orders";

// All store address list

const lamineStoreAddressList: IStoreInformation[] = [
    {
        id: "HN",
        name: "Lamine Sport Hà Nội",
        address: "Phố Kim Ngưu, Thanh Lương, Hai Bà Trưng, TP Hà Nội",
        phone: "1900 9518",
        city: "Hà Nội",
    },
    {
        id: "HP",
        name: "Lamine Sport Hải Phòng",
        address: "Số 139 Cát Dài, Lê Chân, TP Hải Phòng",
        phone: "1900 9518",
        city: "Hải Phòng",
    },
    {
        id: "QN",
        name: "Lamine Sport Quảng Ninh",
        address: "Số 68 Đường Trần Phú, Phường Cẩm Tây, TP Cẩm Phả, Tỉnh Quảng Ninh",
        phone: "1900 9518",
        city: "Quảng Ninh",
    },
    {
        id: "TTH",
        name: "Lamine Sport Huế",
        address: "Đường Nguyễn Thị Thanh, Phú Thượng, TP Huế, Tỉnh Thừa Thiên Huế",
        phone: "1900 9518",
        city: "Huế",
    },
    {
        id: "DN",
        name: "Lamine Sport Đà Nẵng",
        address: "18/33 Đường Nguyễn Văn Thoại, Phường Mỹ An, Quận Ngũ Hành Sơn, TP Đà Nẵng",
        phone: "1900 9518",
        city: "Đà Nẵng",
    },
    {
        id: "NT",
        name: "Lamine Sport Nha Trang",
        address: "24 Đường Thống Nhất, Vạn Thắng, TP Nha Trang, Tỉnh Khánh Hòa",
        phone: "1900 9518",
        city: "Nha Trang",
    },
    {
        id: "HCM",
        name: "Lamine Sport TP. Hồ Chí Minh",
        address: "256 Đường Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh",
        phone: "1900 9518",
        city: "TP. Hồ Chí Minh",
    },
    {
        id: "CT",
        name: "Lamine Sport Cần Thơ",
        address: "Số 94 Đường Trần Hưng Đạo, P. An Nghiệp, Q. Ninh Kiều, TP. Cần Thơ",
        phone: "1900 9518",
        city: "Cần Thơ",
    },
    {
        id: "BT",
        name: "Lamine Sport Bến Tre",
        address: "Võ Nguyên Giáp, Ấp 1, Xã Sơn Đông, TP Bến Tre, Tỉnh Bến Tre",
        phone: "1900 9518",
        city: "Bến Tre",
    },
    {
        id: "CM",
        name: "Lamine Sport Cà Mau",
        address: "Đường Nguyễn Huệ, Phường 2, TP Cà Mau, Tỉnh Cà Mau",
        phone: "1900 9518",
        city: "Cà Mau",
    },
];

const paymentMethods = [
    {
        name: "Momo",
        imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_1.png?1745145147644",
    },
    {
        name: "ZaloPay",
        imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_2.png?1745145147644",
    },
    {
        name: "VNPay",
        imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_3.png?1745145147644",
    },
    {
        name: "Moca",
        imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_4.png?1745145147644",
    },
    {
        name: "Visa",
        imgSrc: "http://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_5.png?1745145147644",
    },
    {
        name: "ATM",
        imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_6.png?1745145147644",
    },
];

const adminSidebarMenu = [
    {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: "🏠",
    },
    {
        label: "Danh sách sản phẩm",
        path: "/admin/products",
        icon: "📦",
    },
    {
        label: "Danh sách đơn hàng",
        path: "/admin/orders",
        icon: "📋",
    },
    {
        label: "Quản lý khách hàng",
        path: "/admin/customer-management",
        icon: "👥",
    },
    {
        label: "Quản lý coupon",
        path: "/admin/coupons",
        icon: "🎟️",
    },
    {
        label: "Đánh giá khách hàng",
        path: "/admin/customer-reviews",
        icon: "⭐",
    },
    {
        label: "Ưu đãi hiện hành",
        path: "/admin/discount-event",
        icon: "🏷️",
    },
    {
        label: "Quản lý template",
        path: "/admin/templates",
        icon: "📄",
    },
    {
        label: "Cài đặt",
        path: "/admin/settings",
        icon: "⚙️",
    },
];

const templateOptionList = [
    {
        label: "Sử dụng template mẫu",
        value: ProductTemplateOption.SelectFromLibrary,
    },
    {
        label: "Tạo template mới",
        value: ProductTemplateOption.CreateNew,
    },
];

const productTypeOptions = [
    {
        label: "Giày dép",
        value: ProductType.Shoes,
    },
    {
        label: "Áo",
        value: ProductType.TShirt,
    },
    {
        label: "Quần",
        value: ProductType.Shorts,
    },
    {
        label: "Váy",
        value: ProductType.Skirt,
    },
    {
        label: "Phụ kiện",
        value: ProductType.Accessory,
    },
];

const sportTypeOptions = [
    {
        label: "Chạy bộ",
        value: SportType.Jogging,
        imageUrl: "./assets/image_cate_jogging.webp",
    },
    {
        label: "Tennis",
        value: SportType.Tennis,
        imageUrl: "./assets/image_cate_tennis.webp",
    },
    {
        label: "Đạp xe",
        value: SportType.Cycling,
        imageUrl: "./assets/image_cate_cycling.webp",
    },
    {
        label: "Bóng đá",
        value: SportType.Football,
        imageUrl: "./assets/image_cate_football.webp",
    },
    {
        label: "Bóng bàn",
        value: SportType.TableTennis,
        imageUrl: "./assets/image_cate_tabletennis.webp",
    },
    {
        label: "Cầu lông",
        value: SportType.Badminton,
        imageUrl: "./assets//image_cate_badminton.webp",
    },
    {
        label: "Bóng rổ",
        value: SportType.Basketball,
        imageUrl: "./assets/image_cate_basketball.webp",
    },
    {
        label: "Bơi lội",
        value: SportType.Swimming,
        imageUrl: "./assets/image_cate_swimming.webp",
    },
    {
        label: "Cắm trại",
        value: SportType.Camping,
        imageUrl: "./assets/image_cate_camping.webp",
    },
    {
        label: "Các môn thể dục",
        value: SportType.Fitness,
        imageUrl: "./assets/image_cate_fitness.webp",
    },
];

const productGenderOptions = [
    {
        label: "Unisex",
        value: ProductGender.Unisex,
    },
    {
        label: "Nam",
        value: ProductGender.Male,
    },
    {
        label: "Nữ",
        value: ProductGender.Female,
    },
];

const productVisibilityOptions = [
    {
        label: "Hiển thị",
        value: ProductVisibility.Visibility,
    },
    {
        label: "Ẩn",
        value: ProductVisibility.Hidden,
    },
];

const productPriceRangeOptions = [
    {
        label: "Dưới 500K",
        value: IProductPriceRangeValue.LessThan500K,
    },
    {
        label: "Từ 500K - 1 triệu",
        value: IProductPriceRangeValue.From500KTo1M,
    },
    {
        label: "Từ 1 triệu - 2 triệu",
        value: IProductPriceRangeValue.From1MTo2M,
    },
    {
        label: "Từ 2 triệu - 5 triệu",
        value: IProductPriceRangeValue.From2MTo5M,
    },
    {
        label: "Trên 5 triệu",
        value: IProductPriceRangeValue.MoreThan5M,
    },
];

const clothingSizeOptions = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const shoeSizeOptions = Array.from({ length: 11 }, (_, i) => (35 + i).toString());

const productAvailableColors = [
    { name: "Đỏ", value: ProductBasicColor.Red, hex: "#f20808" },
    { name: "Xanh dương", value: ProductBasicColor.Blue, hex: "#024779" },
    { name: "Xanh lục", value: ProductBasicColor.Green, hex: "#63d100" },
    { name: "Đen", value: ProductBasicColor.Black, hex: "#000000" },
    { name: "Trắng", value: ProductBasicColor.White, hex: "#FFFFFF" },
    { name: "Vàng", value: ProductBasicColor.Yellow, hex: "#e8fb58" },
    { name: "Tím", value: ProductBasicColor.Purple, hex: "#a600a0" },
    { name: "Cam", value: ProductBasicColor.Orange, hex: "#f1a148" },
    { name: "Hồng", value: ProductBasicColor.Pink, hex: "#fb779c" },
];

export const productCustomerFilterList: IFilterOptionType[] = [
    {
        id: "productPrice",
        name: "Giá",
        type: "checkbox",
        options: productPriceRangeOptions,
    },
    {
        id: "productType",
        name: "Loại sản phẩm",
        type: "checkbox",
        options: productTypeOptions,
    },
    {
        id: "sportTypes",
        name: "Môn thể thao",
        type: "checkbox",
        options: sportTypeOptions,
    },
    {
        id: "productGender",
        name: "Giới tính",
        type: "checkbox",
        options: productGenderOptions,
    },
    {
        id: "productColors",
        name: "Màu sắc",
        type: "checkbox",
        options: productAvailableColors.map((item) => ({
            label: item.name,
            value: item.value,
        })),
    },
];

export const productAdminFilterOptions: IFilterOptionType[] = [
    {
        id: "productType",
        name: "Loại sản phẩm",
        type: "checkbox",
        options: productTypeOptions,
    },
    {
        id: "sportTypes",
        name: "Môn thể thao",
        type: "checkbox",
        options: sportTypeOptions,
    },
    {
        id: "productGender",
        name: "Giới tính",
        type: "checkbox",
        options: productGenderOptions,
    },
    {
        id: "productVisibility",
        name: "Hiển thị",
        type: "checkbox",
        options: productVisibilityOptions,
    },
];

const customerAdminFilterOptions: IFilterOptionType[] = [
    {
        id: "status",
        name: "Trạng thái",
        type: "checkbox",
        options: [
            { label: "Hoạt động", value: ICustomerStatus.Active },
            { label: "Khóa", value: ICustomerStatus.Locked },
        ],
    },
];

const couponAdminFilterOptions: IFilterOptionType[] = [
    {
        id: "couponStatus",
        name: "Trạng thái",
        type: "checkbox",
        options: [
            { label: "Đang hoạt động", value: CouponStatus.Active },
            { label: "Đã hết hạn", value: CouponStatus.Expired },
            { label: "Lên lịch", value: CouponStatus.Schedule },
            { label: "Hết lượt", value: CouponStatus.OutOfUsed },
        ],
    },
    {
        id: "valueType",
        name: "Loại giảm giá",
        type: "checkbox",
        options: [
            { label: "Phần trăm", value: CouponValueType.Percent },
            { label: "Số tiền cố định", value: CouponValueType.FixedAmount },
        ],
    },
];

const orderAdminFilterOptions: IFilterOptionType[] = [
    {
        id: "orderStatus",
        name: "Trạng thái",
        type: "checkbox",
        options: [
            { label: "Đang chờ", value: OrderStatus.WaitingConfirm },
            { label: "Đang xử lý", value: OrderStatus.Processing },
            { label: "Đã giao", value: OrderStatus.Delivered },
            { label: "Đã hủy", value: OrderStatus.Cancel },
        ],
    },
    {
        id: "paymentMethod",
        name: "Phương thức thanh toán",
        type: "checkbox",
        options: [
            { label: "Thanh toán khi nhận hàng", value: IOrderPayment.COD },
            { label: "Chuyển khoản", value: IOrderPayment.Transfer },
        ],
    },
];

const productSortOptions = [
    {
        label: "Mặc định",
        value: "default",
    },
    {
        label: "Tên A-Z",
        value: "name_asc",
    },
    {
        label: "Tên Z-A",
        value: "name_desc",
    },
    {
        label: "Giá thấp đến cao",
        value: "price_asc",
    },
    {
        label: "Giá cao xuống thấp",
        value: "price_desc",
    },
];

const sportTypeByCategoryOptions = [
    {
        label: "Thể thao dưới nước",
        value: [SportType.Swimming],
    },
    {
        label: "Thể thao đồng đội",
        value: [SportType.Basketball, SportType.Football, SportType.Volleyball],
    },
    {
        label: "Chạy bộ & Đi bộ",
        value: [SportType.Jogging, SportType.Camping],
    },
    {
        label: "Các môn Fitness",
        value: [SportType.Fitness],
    },
    {
        label: "Đạp xe và trượt ván",
        value: [SportType.Cycling],
    },
    {
        label: "Thể thao cá nhân",
        value: [SportType.Badminton, SportType.TableTennis, SportType.Tennis],
    },
];

export {
    lamineStoreAddressList,
    paymentMethods,
    adminSidebarMenu,
    templateOptionList,
    productTypeOptions,
    sportTypeOptions,
    productGenderOptions,
    clothingSizeOptions,
    shoeSizeOptions,
    productAvailableColors,
    productVisibilityOptions,
    productPriceRangeOptions,
    productSortOptions,
    customerAdminFilterOptions,
    couponAdminFilterOptions,
    orderAdminFilterOptions,
    sportTypeByCategoryOptions,
};
