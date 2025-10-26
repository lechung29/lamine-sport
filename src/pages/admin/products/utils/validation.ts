/** @format */

import { ProductBasicColor, ProductGender, IProductImageFile, ProductType, ProductVisibility, SportType, ProductTemplateOption } from "@/types";

export const validateCreateOrUpdateProductForm = (info: {
    productName: string;
    description: string;
    productType: ProductType | null;
    sportTypes: SportType[];
    productGender: ProductGender | null;
    productVisibility: ProductVisibility | null;
    productSizes: string[];
    originalPrice: number | null;
    salePrice: number | null;
}) => {
    let formErrors: { [key: string]: string | undefined } = {};
    let isValidBasicForm = true;
    if (!info.productName?.trim()) {
        formErrors.productName = "Vui lòng nhập tên sản phẩm";
        isValidBasicForm = false;
    }

    if (!info.description?.trim()) {
        formErrors.description = "Vui lòng nhập mô tả sản phẩm";
        isValidBasicForm = false;
    }

    if (!info.productType) {
        formErrors.productType = "Vui lòng chọn loại sản phẩm";
        isValidBasicForm = false;
    }

    if (!info.sportTypes || info.sportTypes.length === 0) {
        formErrors.sportType = "Vui lòng chọn ít nhất một môn thể thao";
        isValidBasicForm = false;
    }
    if (!info.productGender) {
        formErrors.productGender = "Vui lòng chọn giới tính phù hợp với sản phẩm";
        isValidBasicForm = false;
    }
    if (!info.productVisibility) {
        formErrors.productVisibility = "Vui lòng chọn chế độ hiển thị của sản phẩm";
        isValidBasicForm = false;
    }

    if ([ProductType.Shoes, ProductType.Shorts, ProductType.TShirt, ProductType.Skirt].includes(info.productType!)) {
        if (!info.productSizes || info.productSizes.length === 0) {
            formErrors.productSizes = "Vui lòng chọn ít nhất 1 kích thước cho loại sản phẩm này";
            isValidBasicForm = false;
        }
    }

    if (!info.originalPrice || info.originalPrice === 0) {
        formErrors.originalPrice = "Vui lòng nhập giá gốc cho sản phẩm";
        isValidBasicForm = false;
    }

    if (info.salePrice && info.originalPrice && info.salePrice > info.originalPrice) {
        formErrors.salePrice = "Giá khuyến mãi không thể lớn hơn giá gốc";
        isValidBasicForm = false;
    }

    return {
        isValidBasicForm,
        formErrors,
    };
};

export const validateColorModalForm = (color: ProductBasicColor | null, quantity: number | null, imageList: IProductImageFile[] | null) => {
    let isValid = true;
    let initialError = {
        colorError: "",
        quantityError: "",
        imageUploadError: "",
    };

    if (!color) {
        initialError.colorError = "Vui lòng chọn màu sắc!";
        isValid = false;
    }
    if (!quantity || quantity <= 0) {
        initialError.quantityError = "Vui lòng nhập số lượng hợp lệ!";
        isValid = false;
    }

    if (!imageList || imageList.length === 0) {
        initialError.imageUploadError = "Vui lòng tải lên ít nhất một hình ảnh/video!";
        isValid = false;
    } else if (imageList.length > 3) {
        initialError.imageUploadError = "Mỗi màu chỉ cho phép tối đa 3 hình ảnh/video.";
        isValid = false;
    }

    return {
        isValid,
        colorModalErrors: initialError,
    };
};

export const validateMediaFile = (file: File) => {
    const isValidType = file.type.startsWith("image/") || file.type.startsWith("video/");
    if (!isValidType) {
        return {
            isValid: false,
            errorMessage: "Chỉ cho phép tải lên file ảnh hoặc video!",
        };
    }
    const maxSize = file.type.startsWith("video/") ? 100 : 10;
    const isValidSize = file.size / 1024 / 1024 < maxSize;
    if (!isValidSize) {
        return {
            isValid: false,
            errorMessage: `File quá lớn! Kích thước tối đa cho ${file.type.startsWith("video/") ? "video" : "ảnh"} là ${maxSize}MB.`,
        };
    }
    return {
        isValid: true,
        errorMessage: "",
    };
};

export const validateProductColorList = (productColor: any[]) => {
    if (productColor.length === 0) {
        return {
            isValidColorList: false,
            colorListErrorMessage: "Vui lòng thêm ít nhất một màu sắc sản phẩm",
        };
    }

    return {
        isValidColorList: true,
        colorListErrorMessage: "",
    };
};

export const validateDetailDescription = (selectedOption: ProductTemplateOption, description: string) => {
    let isDetailDescriptionValid = true;
    let detailDescriptionErrorMessage = "";

    if (!description.trim()) {
        switch (selectedOption) {
            case ProductTemplateOption.CreateNew:
                (isDetailDescriptionValid = false), (detailDescriptionErrorMessage = "Vui lòng nhập mô tả chi tiết sản phẩm");
                break;
            case ProductTemplateOption.SelectFromLibrary:
                (isDetailDescriptionValid = false), (detailDescriptionErrorMessage = "Vui lòng chọn 1 template cho mô tả chi tiết sản phẩm");
                break;
        }
    }

    return {
        isDetailDescriptionValid,
        detailDescriptionErrorMessage,
    };
};
