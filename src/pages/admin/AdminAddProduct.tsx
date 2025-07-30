/** @format */

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Input, Button, Select, Space, Modal, Upload, Card, Tooltip, message, Radio } from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    StarFilled, // Ngôi sao đầy (đã chọn làm ảnh chính)
    StarOutlined, // Ngôi sao rỗng (chưa chọn làm ảnh chính)
    VideoCameraOutlined,
    FileOutlined,
} from "@ant-design/icons";
import type { UploadProps, UploadFile, UploadListType } from "antd/es/upload/interface";
import { Editor } from "@tinymce/tinymce-react";

// ==========================================================
// ĐỊNH NGHĨA CUSTOM TYPE CHO UPLOADFILE
// ==========================================================
interface MyUploadFile extends UploadFile {
    type?: string;
}

// ==========================================================
// ĐỊNH NGHĨA INTERFACE CHO MỘT SẢN PHẨM MÀU
// ==========================================================
interface ProductColor {
    id: number;
    name: string;
    value: string;
    hex: string;
    quantity: number;
    images: MyUploadFile[];
}
// ==========================================================

const { TextArea } = Input;
const { Option } = Select;

// Breadcrumb Component (unchanged)
const Breadcrumb = () => {
    return (
        <nav className="!text-sm !text-gray-600 !mb-6">
            <span>Home</span>
            <span className="!mx-2">-</span>
            <span>All Products</span>
            <span className="!mx-2">-</span>
            <span className="!text-gray-900">Product Details</span>
        </nav>
    );
};

// ==========================================================
// Product Form Component (refactored to useState and forwardRef, removed AntD Form)
// ==========================================================
interface ProductFormData {
    productName: string;
    description: string;
    brandName: string;
    productCategory: string;
    sportsGroup: string;
    sport: string;
    gender: string; // Added gender field
    selectedSizes: string[]; // Added selectedSizes field
    regularPrice: string;
    salePrice: string;
    visibility: string;
}

interface ProductFormRef {
    getData: () => ProductFormData;
    validate: () => boolean;
}

const ProductForm = forwardRef<ProductFormRef>((props, ref) => {
    // State for each form field
    const [productName, setProductName] = useState("Adidas Ultra boost");
    const [description, setDescription] = useState("Long distance running requires a lot from athletes.");
    const [brandName, setBrandName] = useState("Addidas");
    const [productCategory, setProductCategory] = useState<string | undefined>("shoes");
    const [sportsGroup, setSportsGroup] = useState<string | undefined>("running");
    const [sport, setSport] = useState<string | undefined>("marathon");
    const [gender, setGender] = useState<string | undefined>("unisex"); // State for gender, initialized to 'unisex' as per image
    const [selectedSizes, setSelectedSizes] = useState<string[]>(["40", "38", "37", "36", "42"]); // State for selected sizes, initialized as per image
    const [regularPrice, setRegularPrice] = useState("$110.40");
    const [salePrice, setSalePrice] = useState("$450");
    const [visibility, setVisibility] = useState<string | undefined>("visible"); // New state for visibility, default to visible

    // State for validation errors
    const [formErrors, setFormErrors] = useState<{ [key: string]: string | undefined }>({});

    // Validation function
    const validateForm = (): boolean => {
        let errors: { [key: string]: string | undefined } = {};
        let isValid = true;

        if (!productName.trim()) {
            errors.productName = "Vui lòng nhập tên sản phẩm!";
            isValid = false;
        }
        if (!description.trim()) {
            errors.description = "Vui lòng nhập mô tả!";
            isValid = false;
        }
        if (!productCategory) {
            errors.productCategory = "Vui lòng chọn danh mục sản phẩm!";
            isValid = false;
        }
        if (!sportsGroup) {
            errors.sportsGroup = "Vui lòng chọn nhóm thể thao!";
            isValid = false;
        }
        if (!sport) {
            errors.sport = "Vui lòng chọn môn thể thao!";
            isValid = false;
        }
        if (!gender) {
            errors.gender = "Vui lòng chọn giới tính!";
            isValid = false;
        }
        if (!visibility) {
            // Validation for visibility
            errors.visibility = "Vui lòng chọn trạng thái hiển thị!";
            isValid = false;
        }

        // Validation for sizes based on productCategory
        if (["shoes", "clothing", "accessories", "equipment"].includes(productCategory || "")) {
            if (selectedSizes.length === 0) {
                errors.selectedSizes = "Vui lòng chọn ít nhất một kích thước!";
                isValid = false;
            }
        }

        if (!regularPrice.trim()) {
            errors.regularPrice = "Vui lòng nhập giá gốc!";
            isValid = false;
        } else if (isNaN(parseFloat(regularPrice.replace(/[^0-9.-]+/g, "")))) {
            // Basic number validation
            errors.regularPrice = "Giá gốc phải là số!";
            isValid = false;
        }
        if (!salePrice.trim()) {
            errors.salePrice = "Vui lòng nhập giá bán!";
            isValid = false;
        } else if (isNaN(parseFloat(salePrice.replace(/[^0-9.-]+/g, "")))) {
            // Basic number validation
            errors.salePrice = "Giá bán phải là số!";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    useImperativeHandle(ref, () => ({
        getData: () => ({
            productName,
            description,
            brandName,
            productCategory: productCategory || "",
            sportsGroup: sportsGroup || "",
            sport: sport || "",
            gender: gender || "",
            selectedSizes,
            regularPrice,
            salePrice,
            visibility: visibility || "", // Include visibility in returned data
        }),
        validate: validateForm,
    }));

    // Helper to get input class based on validation status
    const getInputClassName = (fieldName: string) => {
        const baseClass = "!w-full !px-3 !py-2 !border !border-gray-300 !rounded-md focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent";
        return formErrors[fieldName] ? `${baseClass} !border-red-500 focus:!ring-red-500` : baseClass;
    };

    // Options for shoe sizes (35-45)
    const shoeSizes = Array.from({ length: 11 }, (_, i) => (35 + i).toString());
    // Options for apparel/accessories/equipment sizes
    const apparelSizes = ["S", "M", "L", "XL", "XXL"];

    return (
        <div className="!space-y-4 !mb-8">
            <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
                <div className="!mb-0">
                    <label className="!text-base !font-semibold !text-gray-800 !block !mb-1">Product Name</label>
                    <Input
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) => {
                            setProductName(e.target.value);
                            setFormErrors((prev) => ({ ...prev, productName: undefined }));
                        }}
                        className={getInputClassName("productName")}
                    />
                    {formErrors.productName && <p className="!text-red-500 !text-xs !mt-1">{formErrors.productName}</p>}
                </div>

                <div className="!mb-0">
                    <label className="!text-base !font-semibold !text-gray-800 !block !mb-1">Brand Name</label>
                    <Input placeholder="Enter brand name" value={brandName} onChange={(e) => setBrandName(e.target.value)} className={getInputClassName("brandName")} />
                </div>

                {/* Description now inside the grid, spanning full width */}
                <div className="!mb-0 md:!col-span-2">
                    <label className="!text-base !font-semibold !text-gray-800 !block !mb-1">Description</label>
                    <TextArea
                        rows={4}
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setFormErrors((prev) => ({ ...prev, description: undefined }));
                        }}
                        className={`${getInputClassName("description")} !resize-none`}
                    />
                    {formErrors.description && <p className="!text-red-500 !text-xs !mt-1">{formErrors.description}</p>}
                </div>

                <div className="!mb-0">
                    <label className="!text-base !font-semibold !text-gray-800 !block !mb-1">Product Category</label>
                    <Select
                        placeholder="Select product category"
                        value={productCategory}
                        onChange={(value) => {
                            setProductCategory(value);
                            setFormErrors((prev) => ({ ...prev, productCategory: undefined, selectedSizes: undefined }));
                            setSelectedSizes([]); // Reset sizes when category changes
                        }}
                        className="!w-full"
                        dropdownClassName="!border !border-gray-300 !rounded-md"
                        status={formErrors.productCategory ? "error" : undefined}
                    >
                        <Option value="shoes">Shoes</Option>
                        <Option value="clothing">Clothing</Option>
                        <Option value="accessories">Accessories</Option>
                        <Option value="equipment">Equipment</Option>
                    </Select>
                    {formErrors.productCategory && <p className="!text-red-500 !text-xs !mt-1">{formErrors.productCategory}</p>}
                </div>

                <div className="!mb-0">
                    <label className="!text-base !font-semibold !text-gray-800 !block !mb-1">Sports Group</label>
                    <Select
                        placeholder="Select sports group"
                        value={sportsGroup}
                        onChange={(value) => {
                            setSportsGroup(value);
                            setFormErrors((prev) => ({ ...prev, sportsGroup: undefined }));
                        }}
                        className="!w-full"
                        dropdownClassName="!border !border-gray-300 !rounded-md"
                        status={formErrors.sportsGroup ? "error" : undefined}
                    >
                        <Option value="running">Running</Option>
                        <Option value="basketball">Basketball</Option>
                        <Option value="football">Football</Option>
                        <Option value="tennis">Tennis</Option>
                        <Option value="training">Training</Option>
                        <Option value="lifestyle">Lifestyle</Option>
                    </Select>
                    {formErrors.sportsGroup && <p className="!text-red-500 !text-xs !mt-1">{formErrors.sportsGroup}</p>}
                </div>

                <div className="!mb-0">
                    <label className="!text-base !font-semibold !text-gray-800 !block !mb-1">Sport</label>
                    <Select
                        placeholder="Select sport"
                        value={sport}
                        onChange={(value) => {
                            setSport(value);
                            setFormErrors((prev) => ({ ...prev, sport: undefined }));
                        }}
                        className="!w-full"
                        dropdownClassName="!border !border-gray-300 !rounded-md"
                        status={formErrors.sport ? "error" : undefined}
                    >
                        <Option value="marathon">Marathon</Option>
                        <Option value="jogging">Jogging</Option>
                        <Option value="sprinting">Sprinting</Option>
                        <Option value="basketball">Basketball</Option>
                        <Option value="soccer">Soccer</Option>
                        <Option value="american-football">American Football</Option>
                        <Option value="tennis">Tennis</Option>
                        <Option value="cross-training">Cross Training</Option>
                        <Option value="gym">Gym</Option>
                        <Option value="casual">Casual</Option>
                    </Select>
                    {formErrors.sport && <p className="!text-red-500 !text-xs !mt-1">{formErrors.sport}</p>}
                </div>

                {/* New Gender Dropdown */}
                <div className="!mb-0">
                    <label className="!text-base !font-semibold !text-gray-800 !block !mb-1">Gender</label>
                    <Select
                        placeholder="Select gender"
                        value={gender}
                        onChange={(value) => {
                            setGender(value);
                            setFormErrors((prev) => ({ ...prev, gender: undefined }));
                        }}
                        className="!w-full"
                        dropdownClassName="!border !border-gray-300 !rounded-md"
                        status={formErrors.gender ? "error" : undefined}
                    >
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="unisex">Unisex</Option>
                    </Select>
                    {formErrors.gender && <p className="!text-red-500 !text-xs !mt-1">{formErrors.gender}</p>}
                </div>

                {/* Size Dropdown - Conditional Rendering */}
                {(productCategory === "shoes" || productCategory === "clothing" || productCategory === "accessories" || productCategory === "equipment") && (
                    <div className="!mb-0">
                        <label className="!text-base !font-semibold !text-gray-800 !block !mb-1">Sizes</label>
                        <Select
                            placeholder="Select sizes"
                            mode={productCategory === "shoes" ? "multiple" : undefined} // "multiple" for shoes
                            value={selectedSizes}
                            onChange={(value: string[]) => {
                                setSelectedSizes(value);
                                setFormErrors((prev) => ({ ...prev, selectedSizes: undefined }));
                            }}
                            className="!w-full"
                            dropdownClassName="!border !border-gray-300 !rounded-md"
                            status={formErrors.selectedSizes ? "error" : undefined}
                        >
                            {productCategory === "shoes"
                                ? shoeSizes.map((size) => (
                                      <Option key={size} value={size}>
                                          {size}
                                      </Option>
                                  ))
                                : apparelSizes.map((size) => (
                                      <Option key={size} value={size}>
                                          {size}
                                      </Option>
                                  ))}
                        </Select>
                        {formErrors.selectedSizes && <p className="!text-red-500 !text-xs !mt-1">{formErrors.selectedSizes}</p>}
                    </div>
                )}

                {/* New Visibility Dropdown */}
                <div className="!mb-0">
                    <label className="!text-base !font-semibold !text-gray-800 !block !mb-1">Visibility</label>
                    <Select
                        placeholder="Select visibility"
                        value={visibility}
                        onChange={(value) => {
                            setVisibility(value);
                            setFormErrors((prev) => ({ ...prev, visibility: undefined }));
                        }}
                        className="!w-full"
                        dropdownClassName="!border !border-gray-300 !rounded-md"
                        status={formErrors.visibility ? "error" : undefined}
                    >
                        <Option value="visible">Visible</Option>
                        <Option value="hidden">Hidden</Option>
                    </Select>
                    {formErrors.visibility && <p className="!text-red-500 !text-xs !mt-1">{formErrors.visibility}</p>}
                </div>

                {/* Regular Price and Sale Price are already a 2-col grid, keep as is inside this new grid */}
                <div className="!grid !grid-cols-2 !gap-4 !col-span-full">
                    {" "}
                    {/* Make this span full width of the 2-col grid */}
                    <div className="!mb-0">
                        <label className="!text-base !font-semibold !text-gray-800 !block !mb-1">Regular Price</label>
                        <Input
                            placeholder="Enter regular price"
                            value={regularPrice}
                            onChange={(e) => {
                                setRegularPrice(e.target.value);
                                setFormErrors((prev) => ({ ...prev, regularPrice: undefined }));
                            }}
                            className={getInputClassName("regularPrice")}
                        />
                        {formErrors.regularPrice && <p className="!text-red-500 !text-xs !mt-1">{formErrors.regularPrice}</p>}
                    </div>
                    <div className="!mb-0">
                        <label className="!text-base !font-semibold !text-gray-800 !block !mb-1">Sale Price</label>
                        <Input
                            placeholder="Enter sale price"
                            value={salePrice}
                            onChange={(e) => {
                                setSalePrice(e.target.value);
                                setFormErrors((prev) => ({ ...prev, salePrice: undefined }));
                            }}
                            className={getInputClassName("salePrice")}
                        />
                        {formErrors.salePrice && <p className="!text-red-500 !text-xs !mt-1">{formErrors.salePrice}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
});

// ==========================================================
// Product Image Gallery Component
// ==========================================================
interface ProductImageGalleryProps {
    allImages: MyUploadFile[];
    globalDefaultImageUid: string | null;
    setGlobalDefaultImageUid: (uid: string | null) => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ allImages, globalDefaultImageUid, setGlobalDefaultImageUid }) => {
    const [isMainImageModalVisible, setIsMainImageModalVisible] = useState(false);

    const handleOpenSelectMainImageModal = () => {
        if (allImages.length === 0) {
            message.warning("Vui lòng thêm ít nhất một màu sắc sản phẩm và tải ảnh lên trước khi chọn ảnh chính.");
            return;
        }
        setIsMainImageModalVisible(true);
    };

    const handleSelectImageAsGlobalDefaultFromModal = (uid: string) => {
        setGlobalDefaultImageUid(uid);
        setIsMainImageModalVisible(false);
        message.success("Ảnh sản phẩm chính đã được đặt thành công!");
    };

    return (
        <div className="!mb-8">
            {/* Custom Scrollbar Styles */}
            <style>
                {`
                .custom-scrollbar::-webkit-scrollbar {
                  height: 8px; /* Chiều cao của thanh cuộn ngang */
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent; /* Nền của thanh cuộn */
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: rgba(0, 0, 0, 0.2); /* Màu của thanh trượt */
                  border-radius: 4px; /* Bo tròn góc thanh trượt */
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background-color: rgba(0, 0, 0, 0.3); /* Màu khi di chuột qua */
                }

                .custom-scrollbar::-webkit-scrollbar-button {
                  display: none; /* Ẩn các nút mũi tên */
                }

                /* For Firefox */
                .custom-scrollbar {
                  scrollbar-width: thin; /* "auto" hoặc "thin" */
                  scrollbar-color: rgba(0, 0, 0, 0.2) transparent; /* Màu thanh trượt và nền */
                }
                `}
            </style>

            <div className="!flex !justify-between !items-center !mb-6">
                <h4 className="!text-base !font-semibold !text-gray-800">Thư viện ảnh sản phẩm</h4>
                {allImages.length > 0 && ( // Nút chỉ hiển thị khi có ảnh
                    <Button type="default" onClick={handleOpenSelectMainImageModal} className={`!bg-gray-200 !text-gray-800 hover:!bg-gray-300 !rounded-md`}>
                        {globalDefaultImageUid ? "Thay Đổi Ảnh Sản Phẩm Chính" : "Chọn Ảnh Sản Phẩm Chính"}
                    </Button>
                )}
            </div>

            {allImages.length === 0 ? (
                <div className="!text-center !py-8 !text-gray-500 !border !border-dashed !border-gray-300 !rounded-md">
                    <p>Chưa có hình ảnh nào trong thư viện.</p>
                    <p className="!text-sm">Vui lòng thêm màu sắc sản phẩm và tải ảnh lên.</p>
                </div>
            ) : (
                <div className="!flex !flex-nowrap !overflow-x-auto !gap-4 !pb-2 custom-scrollbar">
                    {" "}
                    {/* Added custom-scrollbar class */}
                    {allImages.map((file) => (
                        <div
                            key={file.uid}
                            className={`!relative !flex-shrink-0 !w-40 !h-32 !rounded-lg !overflow-hidden !cursor-pointer !border-2 ${
                                // Added !flex-shrink-0 and fixed width
                                file.uid === globalDefaultImageUid ? "!border-blue-500 !shadow-lg" : "!border-gray-300"
                            } hover:!border-blue-400 !transition-all`}
                            onClick={() => handleSelectImageAsGlobalDefaultFromModal(file.uid)}
                        >
                            {file.type && file.type.startsWith("image/") ? (
                                <img src={file.url} alt={file.name} className="!w-full !h-full !object-cover" />
                            ) : file.type && file.type.startsWith("video/") ? (
                                <div className="!w-full !h-full !flex !items-center !justify-center !bg-gray-200">
                                    <VideoCameraOutlined className="!text-3xl !text-gray-500" />
                                </div>
                            ) : (
                                <div className="!w-full !h-full !flex !items-center !justify-center !bg-gray-200">
                                    <FileOutlined className="!text-3xl !text-gray-500" />
                                </div>
                            )}
                            {file.uid === globalDefaultImageUid && (
                                <div className="!absolute !top-1 !right-1 !bg-blue-500 !text-white !rounded-full !p-1 !flex !items-center !justify-center">
                                    <StarFilled className="!text-sm" />
                                </div>
                            )}
                            <div className="!absolute !bottom-0 !left-0 !right-0 !bg-black !bg-opacity-50 !text-white !text-xs !p-1 !truncate">{file.name}</div>
                        </div>
                    ))}
                </div>
            )}

            <Modal title="Chọn Ảnh Sản Phẩm Chính" open={isMainImageModalVisible} onCancel={() => setIsMainImageModalVisible(false)} footer={null} width={800} className="!rounded-lg">
                <div className="!grid !grid-cols-3 md:!grid-cols-4 lg:!grid-cols-5 !gap-4 !p-4 !max-h-[60vh] !overflow-y-auto">
                    {allImages.length > 0 ? (
                        allImages.map((file) => (
                            <div
                                key={file.uid}
                                className={`!relative !w-32 !h-32 !rounded-lg !overflow-hidden !cursor-pointer !border-2 ${
                                    file.uid === globalDefaultImageUid ? "!border-blue-500 !shadow-lg" : "!border-gray-300"
                                } hover:!border-blue-400 !transition-all`}
                                onClick={() => handleSelectImageAsGlobalDefaultFromModal(file.uid)}
                            >
                                {file.type && file.type.startsWith("image/") ? (
                                    <img src={file.url} alt={file.name} className="!w-full !h-full !object-cover" />
                                ) : file.type && file.type.startsWith("video/") ? (
                                    <div className="!w-full !h-full !flex !items-center !justify-center !bg-gray-200">
                                        <VideoCameraOutlined className="!text-3xl !text-gray-500" />
                                    </div>
                                ) : (
                                    <div className="!w-full !h-full !flex !items-center !justify-center !bg-gray-200">
                                        <FileOutlined className="!text-3xl !text-gray-500" />
                                    </div>
                                )}
                                {file.uid === globalDefaultImageUid && (
                                    <div className="!absolute !top-1 !right-1 !bg-blue-500 !text-white !rounded-full !p-1 !flex !items-center !justify-center">
                                        <StarFilled className="!text-sm" />
                                    </div>
                                )}
                                <div className="!absolute !bottom-0 !left-0 !right-0 !bg-black !bg-opacity-50 !text-white !text-xs !p-1 !truncate">{file.name}</div>
                            </div>
                        ))
                    ) : (
                        <p className="!col-span-full !text-center !text-gray-500">Chưa có hình ảnh nào được tải lên.</p>
                    )}
                </div>
            </Modal>
        </div>
    );
};

// ==========================================================
// Product Colors Component (refactored to useState and forwardRef, removed AntD Form in Modal)
// ==========================================================
interface ProductColorsRef {
    getColorsData: () => ProductColor[];
    validateColors: () => boolean;
    // Removed getAllImages from ref
}

interface ProductColorsProps {
    onImagesChange: (images: MyUploadFile[]) => void; // New prop for callback
}

const ProductColors = forwardRef<ProductColorsRef, ProductColorsProps>((props, ref) => {
    const { onImagesChange } = props; // Destructure new prop

    const [colors, setColors] = useState<ProductColor[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingColorId, setEditingColorId] = useState<number | null>(null);

    // State riêng cho các trường trong modal
    const [modalSelectedColor, setModalSelectedColor] = useState<string | undefined>(undefined);
    const [modalQuantity, setModalQuantity] = useState<number | undefined>(undefined);
    const [modalFileList, setModalFileList] = useState<MyUploadFile[]>([]);
    const [modalErrors, setModalErrors] = useState<{ [key: string]: string | undefined }>({});
    const [uploadError, setUploadError] = useState<string | undefined>(undefined);

    const availableColors = [
        { name: "Red", value: "red", hex: "#FF0000" },
        { name: "Blue", value: "blue", hex: "#0000FF" },
        { name: "Green", value: "green", hex: "#00FF00" },
        { name: "Black", value: "black", hex: "#000000" },
        { name: "White", value: "white", hex: "#FFFFFF" },
        { name: "Yellow", value: "yellow", hex: "#FFFF00" },
        { name: "Purple", value: "purple", hex: "#800080" },
        { name: "Orange", value: "orange", hex: "#FFA500" },
        { name: "Pink", value: "pink", hex: "#FFC0CB" },
        { name: "Gray", value: "gray", hex: "#808080" },
    ];

    // Helper function to get all images from current colors state
    const getAllImagesFromColors = (currentColors: ProductColor[]): MyUploadFile[] => {
        return currentColors.flatMap((color) => color.images);
    };

    // Effect to call onImagesChange whenever colors state updates
    useEffect(() => {
        onImagesChange(getAllImagesFromColors(colors));
    }, [colors, onImagesChange]);

    const showModal = () => {
        setEditingColorId(null);
        setModalSelectedColor(undefined);
        setModalQuantity(undefined);
        setModalFileList([]);
        setModalErrors({});
        setUploadError(undefined);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingColorId(null);
        setModalSelectedColor(undefined);
        setModalQuantity(undefined);
        setModalFileList([]);
        setModalErrors({});
        setUploadError(undefined);
    };

    // Validation for modal form
    const validateModalForm = (): boolean => {
        let errors: { [key: string]: string | undefined } = {};
        let isValid = true;

        if (!modalSelectedColor) {
            errors.color = "Vui lòng chọn màu sắc!";
            isValid = false;
        }
        if (!modalQuantity || modalQuantity <= 0) {
            errors.quantity = "Vui lòng nhập số lượng hợp lệ!";
            isValid = false;
        }
        setModalErrors(errors);

        if (modalFileList.length === 0) {
            setUploadError("Vui lòng tải lên ít nhất một hình ảnh/video!");
            isValid = false;
        } else if (modalFileList.length > 3) {
            setUploadError("Mỗi màu chỉ cho phép tối đa 3 hình ảnh/video.");
            isValid = false;
        } else {
            setUploadError(undefined);
        }

        return isValid;
    };

    const handleAddOrUpdateColor = () => {
        if (!validateModalForm()) {
            return;
        }

        const selectedColorData = availableColors.find((c) => c.value === modalSelectedColor);
        if (!selectedColorData) {
            message.error("Màu sắc được chọn không hợp lệ.");
            return;
        }

        const imagesToProcess: MyUploadFile[] = modalFileList;

        const imagesToStore: MyUploadFile[] = imagesToProcess.map((file) => ({
            uid: file.uid,
            name: file.name,
            status: file.status || "done",
            url: file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : ""),
            type: file.type,
            originFileObj: file.originFileObj,
        }));

        if (editingColorId) {
            setColors(
                colors.map((color: ProductColor) =>
                    color.id === editingColorId
                        ? {
                              ...color,
                              quantity: modalQuantity!,
                              images: imagesToStore,
                          }
                        : color
                )
            );
        } else {
            const newColor: ProductColor = {
                id: Date.now(),
                ...selectedColorData,
                quantity: modalQuantity!,
                images: imagesToStore,
            };
            setColors([...colors, newColor]);
        }
        handleCancel();
    };

    const handleDeleteColor = (colorId: number) => {
        const colorToDelete = colors.find((color) => color.id === colorId);
        if (colorToDelete && colorToDelete.images) {
            colorToDelete.images.forEach((image) => {
                if (image.url && image.url.startsWith("blob:")) {
                    URL.revokeObjectURL(image.url);
                }
            });
        }
        const updatedColors = colors.filter((color) => color.id !== colorId);
        setColors(updatedColors);
    };

    const handleEditColor = (colorId: number) => {
        const colorToEdit = colors.find((color) => color.id === colorId);
        if (colorToEdit) {
            setEditingColorId(colorId);
            setModalSelectedColor(colorToEdit.value);
            setModalQuantity(colorToEdit.quantity);
            setModalFileList(colorToEdit.images);
            setModalErrors({});
            setUploadError(undefined);
            setIsModalVisible(true);
        }
    };

    const uploadProps: UploadProps = {
        fileList: modalFileList,
        onChange: ({ fileList: newFileList }) => {
            const typedFileList: MyUploadFile[] = newFileList.map((file) => file as MyUploadFile);
            setModalFileList(typedFileList);

            if (typedFileList.length <= 3) {
                setUploadError(undefined);
            }
        },
        beforeUpload: (file) => {
            if (modalFileList.length >= 3) {
                const errorMessage = "Mỗi màu chỉ cho phép tối đa 3 hình ảnh/video.";
                setUploadError(errorMessage);
                message.error(errorMessage);
                return Upload.LIST_IGNORE;
            }
            setUploadError(undefined);
            return false;
        },
        accept: "image/*,video/*",
        multiple: true,
        listType: "picture-card" as UploadListType,
        itemRender: (originNode, file, fileList, { download, preview, remove }) => {
            const myFile = file as MyUploadFile;

            return (
                <div className="ant-upload-list-item-container">
                    {originNode}
                    <div className="ant-upload-list-item-actions custom-actions">
                        {remove && (
                            <Tooltip title="Xóa">
                                <span onClick={remove} className="!cursor-pointer !text-red-500 hover:!text-red-700 !ml-2">
                                    <DeleteOutlined />
                                </span>
                            </Tooltip>
                        )}
                    </div>
                </div>
            );
        },
    };

    // Helper to get input class based on validation status for modal
    const getModalInputClassName = (fieldName: string) => {
        const baseClass = "!w-full !px-3 !py-2 !border !border-gray-300 !rounded-md focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent";
        return modalErrors[fieldName] ? `${baseClass} !border-red-500 focus:!ring-red-500` : baseClass;
    };

    useImperativeHandle(ref, () => ({
        getColorsData: () => colors,
        validateColors: () => {
            if (colors.length === 0) {
                message.error("Vui lòng thêm ít nhất một màu sắc sản phẩm.");
                return false;
            }
            return true;
        },
    }));

    return (
        <div>
            <div className="!flex !justify-between !items-center !mb-6">
                <h4 className="!text-base !font-semibold !text-gray-800">Product Colors</h4>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal} className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700 !rounded-md">
                    Thêm màu sắc sản phẩm
                </Button>
            </div>

            {colors.length === 0 ? (
                <div className="!text-center !py-8 !text-gray-500">
                    <p>Chưa có màu sắc nào được thêm</p>
                </div>
            ) : (
                <div className="!space-y-4">
                    {" "}
                    {/* Changed to space-y for vertical spacing */}
                    {colors.map((color) => {
                        return (
                            <div key={color.id} className="!p-1.5 !bg-white !rounded-lg">
                                {" "}
                                {/* Removed Card, added direct styling */}
                                {/* Changed to grid layout with 3 columns */}
                                <div className="flex justify-between !gap-4 !items-center">
                                    {/* Column 1: Color swatch and name */}
                                    <div className="!flex !items-center !space-x-3">
                                        <div className="!flex-shrink-0 !w-8 !h-8 !rounded-full !border-2 !border-gray-300" style={{ backgroundColor: color.hex }}></div>
                                        <h4 className="!font-medium !text-gray-900">{color.name}</h4>
                                    </div>

                                    {/* Column 2: Quantity */}
                                    <div className="!text-center">
                                        <p className="!text-sm !text-gray-500">Số lượng: {color.quantity}</p>
                                    </div>

                                    {/* Column 3: Actions */}
                                    <div className="!flex !space-x-2 !justify-center sm:!justify-end">
                                        <Button
                                            icon={<EditOutlined />}
                                            onClick={() => handleEditColor(color.id)}
                                            className="!border-blue-300 hover:!border-blue-500 !text-blue-600 !text-xs !px-2 !py-1"
                                        >
                                            Cập nhật
                                        </Button>
                                        <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteColor(color.id)} className="!border-red-300 hover:!border-red-500 !text-xs !px-2 !py-1">
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal title={editingColorId ? "Cập nhật màu sắc sản phẩm" : "Thêm màu sắc sản phẩm"} open={isModalVisible} onCancel={handleCancel} footer={null} className="!rounded-lg">
                <div className="!mt-4">
                    <div className="!mb-4">
                        <label className="!text-base !font-semibold !text-gray-800 !block !mb-1">Chọn màu sắc</label>
                        <Select
                            placeholder="Chọn màu sắc"
                            value={modalSelectedColor}
                            onChange={(value) => {
                                setModalSelectedColor(value);
                                setModalErrors((prev) => ({ ...prev, color: undefined }));
                            }}
                            className="!w-full"
                            dropdownClassName="!border !border-gray-300 !rounded-md"
                            disabled={!!editingColorId}
                            status={modalErrors.color ? "error" : undefined}
                        >
                            {availableColors.map((color) => (
                                <Option key={color.value} value={color.value} disabled={colors.some((existingColor) => existingColor.value === color.value && existingColor.id !== editingColorId)}>
                                    <div className="!flex !items-center !space-x-2">
                                        <div className="!w-4 !h-4 !rounded-full !border" style={{ backgroundColor: color.hex }}></div>
                                        <span>{color.name}</span>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                        {modalErrors.color && <p className="!text-red-500 !text-xs !mt-1">{modalErrors.color}</p>}
                    </div>

                    <div className="!mb-4">
                        <label className="!text-base !font-semibold !text-gray-800 !block !mb-1">Số lượng</label>
                        <Input
                            type="number"
                            placeholder="Nhập số lượng"
                            value={modalQuantity}
                            onChange={(e) => {
                                setModalQuantity(parseInt(e.target.value) || undefined);
                                setModalErrors((prev) => ({ ...prev, quantity: undefined }));
                            }}
                            min={1}
                            className={getModalInputClassName("quantity")}
                        />
                        {modalErrors.quantity && <p className="!text-red-500 !text-xs !mt-1">{modalErrors.quantity}</p>}
                    </div>

                    <div className="!mb-6">
                        <label className="!text-base !font-semibold !text-gray-800 !block !mb-1">Hình ảnh/Video sản phẩm</label>
                        <Upload
                            {...uploadProps}
                            showUploadList={{
                                showPreviewIcon: true,
                                showDownloadIcon: false,
                                showRemoveIcon: true,
                            }}
                        >
                            {modalFileList.length < 3 && (
                                <div>
                                    <PlusOutlined />
                                    <div className="!mt-2">Upload</div>
                                </div>
                            )}
                        </Upload>
                        {uploadError && <p className="!text-red-500 !text-xs !mt-1">{uploadError}</p>}
                    </div>

                    <div className="!flex !justify-end !space-x-2">
                        <Button onClick={handleCancel} className="!px-4 !py-2">
                            Hủy
                        </Button>
                        <Button type="primary" onClick={handleAddOrUpdateColor} className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700 !px-4 !py-2">
                            {editingColorId ? "Cập nhật" : "Thêm"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
});

// ==========================================================
// Main Product Details Content Component
// ==========================================================
const AdminAddProduct = () => {
    const productFormRef = React.useRef<ProductFormRef>(null);
    const productColorsRef = React.useRef<ProductColorsRef>(null);

    const [globalDefaultImageUid, setGlobalDefaultImageUid] = useState<string | null>(null);
    const [allImagesInGallery, setAllImagesInGallery] = useState<MyUploadFile[]>([]);

    // State for detailed description section
    const [descriptionOption, setDescriptionOption] = useState<"template" | "new">("template");
    const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined);
    const [customDescription, setCustomDescription] = useState<string>(""); // This would hold the rich text content

    useEffect(() => {
        console.log(customDescription);
    }, [customDescription]);

    // Mock data for templates
    const availableTemplates = [
        { id: "temp1", name: "Mô tả giày thể thao cơ bản", content: "Đây là mô tả cơ bản cho giày thể thao..." },
        { id: "temp2", name: "Mô tả quần áo thời trang", content: "Đây là mô tả chi tiết cho sản phẩm quần áo..." },
        { id: "temp3", name: "Mô tả phụ kiện cao cấp", content: "Mô tả sản phẩm phụ kiện với chất liệu cao cấp..." },
    ];

    // Callback function to receive all images from ProductColors
    const handleAllImagesChange = React.useCallback(
        (images: MyUploadFile[]) => {
            setAllImagesInGallery(images);
            // Kiểm tra và đặt lại globalDefaultImageUid nếu ảnh chính bị xóa
            if (globalDefaultImageUid && !images.some((img) => img.uid === globalDefaultImageUid)) {
                setGlobalDefaultImageUid(null);
                message.info("Ảnh sản phẩm chính đã bị xóa và được đặt lại.");
            }
        },
        [globalDefaultImageUid, setAllImagesInGallery, setGlobalDefaultImageUid]
    );

    const handleUpdateProduct = () => {
        const isProductFormValid = productFormRef.current?.validate();
        const areColorsValid = productColorsRef.current?.validateColors();

        // Thêm kiểm tra ảnh chính toàn cục ở đây
        const hasImages = allImagesInGallery.length > 0;
        const isGlobalDefaultImageSelected = globalDefaultImageUid !== null;

        // Validation for detailed description
        let isDetailedDescriptionValid = true;
        if (descriptionOption === "template" && !selectedTemplate) {
            message.error("Vui lòng chọn một template mô tả sản phẩm!");
            isDetailedDescriptionValid = false;
        } else if (descriptionOption === "new" && !customDescription.trim()) {
            message.error("Vui lòng nhập nội dung mô tả chi tiết sản phẩm!");
            isDetailedDescriptionValid = false;
        }

        if (isProductFormValid && areColorsValid && (!hasImages || isGlobalDefaultImageSelected) && isDetailedDescriptionValid) {
            const productFormData = productFormRef.current?.getData();
            const productColorsData = productColorsRef.current?.getColorsData();
            const finalGlobalDefaultImageUid = globalDefaultImageUid;

            const detailedDescriptionData = {
                option: descriptionOption,
                templateId: descriptionOption === "template" ? selectedTemplate : undefined,
                customContent: descriptionOption === "new" ? customDescription : undefined,
            };

            console.log("Product Data:", productFormData);
            console.log("Product Colors Data:", productColorsData);
            console.log("Global Default Image UID:", finalGlobalDefaultImageUid);
            console.log("Detailed Description Data:", detailedDescriptionData);

            message.success("Dữ liệu sản phẩm đã sẵn sàng để gửi!");
        } else {
            if (!isProductFormValid) {
                message.error("Vui lòng kiểm tra lại thông tin sản phẩm.");
            } else if (!areColorsValid) {
                // message.error đã được gọi từ validateColors
            } else if (hasImages && !isGlobalDefaultImageSelected) {
                message.error("Vui lòng chọn một ảnh chính cho sản phẩm!");
            }
            // Specific messages for detailed description are handled above
        }
    };

    return (
        <div>
            <h1 className="!text-2xl !font-bold !text-gray-900 !mb-4">Product Details</h1>
            <Breadcrumb />

            <div className="!bg-white !p-6 !rounded-lg !shadow-sm !mb-8">
                {/* Product Form fields */}
                <ProductForm ref={productFormRef} />

                {/* Product Image Gallery */}
                <ProductImageGallery allImages={allImagesInGallery} globalDefaultImageUid={globalDefaultImageUid} setGlobalDefaultImageUid={setGlobalDefaultImageUid} />

                {/* Product Colors - Truyền callback để nhận ảnh */}
                <ProductColors ref={productColorsRef} onImagesChange={handleAllImagesChange} />

                {/* --- Detailed Product Description Section --- */}
                <div className="!mt-8 !pt-6 !border-t !border-gray-200">
                    <h4 className="!text-base !font-semibold !text-gray-800 !mb-4">Mô tả chi tiết sản phẩm</h4>
                    <Radio.Group
                        onChange={(e) => {
                            setDescriptionOption(e.target.value);
                            setSelectedTemplate(undefined); // Reset template selection
                            setCustomDescription(""); // Clear custom description
                        }}
                        value={descriptionOption}
                        className="!mb-4"
                    >
                        <Radio value="new">Tạo template mới</Radio>
                        <Radio value="template">Sử dụng template mẫu</Radio>
                    </Radio.Group>

                    {descriptionOption === "template" && (
                        <div className="!mb-4">
                            <Select
                                placeholder="Chọn một template mô tả"
                                value={selectedTemplate}
                                onChange={(value) => setSelectedTemplate(value)}
                                className="!w-full"
                                dropdownClassName="!border !border-gray-300 !rounded-md"
                            >
                                {availableTemplates.map((template) => (
                                    <Option key={template.id} value={template.id}>
                                        {template.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    )}

                    {descriptionOption === "new" && (
                        <div className="!mb-4">
                            <Editor
                                apiKey="hmzm0nlodu2gg1kh1l7jd63rdgm4ufkleiair59pn7xblofl" // Thay thế bằng API Key của bạn nếu có
                                init={{
                                    height: 300,
                                    menubar: false,
                                    plugins: [
                                        "advlist",
                                        "autolink",
                                        "lists",
                                        "link",
                                        "image",
                                        "charmap",
                                        "preview",
                                        "anchor",
                                        "searchreplace",
                                        "visualblocks",
                                        "code",
                                        "fullscreen",
                                        "insertdatetime",
                                        "media",
                                        "table",
                                        "wordcount",
                                        "emoticons",
                                        "help",
                                    ],
                                    // Chuyển toolbar thành một chuỗi duy nhất để hiển thị trên một hàng
                                    toolbar:
                                        "undo redo | styleselect | " +
                                        "bold italic underline strikethrough | subscript superscript | " +
                                        "alignleft aligncenter alignright alignjustify | " +
                                        "bullist numlist outdent indent | blockquote | " +
                                        "link image media table | charmap emoticons | preview fullscreen | code help | removeformat",
                                    content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                    toolbar_sticky: true, // Thêm thuộc tính này để thanh công cụ dính
                                }}
                                value={customDescription}
                                onEditorChange={(newValue, _editor) => setCustomDescription(newValue)}
                            />
                        </div>
                    )}
                </div>
                {/* --- End Detailed Product Description Section --- */}

                <div className="!flex !justify-center !pt-6 !border-t !border-gray-200">
                    <Space size="middle">
                        <Button type="primary" onClick={handleUpdateProduct} className="!bg-gray-800 !border-gray-800 hover:!bg-gray-900 !px-6 !py-2 !rounded">
                            UPDATE
                        </Button>
                        <Button danger className="!bg-red-600 !border-red-600 hover:!bg-red-700 !text-white !px-6 !py-2 !rounded">
                            DELETE
                        </Button>
                        <Button className="!bg-white !text-gray-700 !px-6 !py-2 !rounded !border !border-gray-300 hover:!bg-gray-50">CANCEL</Button>
                    </Space>
                </div>
            </div>
        </div>
    );
};

export { AdminAddProduct };
