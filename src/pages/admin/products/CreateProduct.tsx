/** @format */

import React from "react";
import { Input, Button, Select, Space, Modal, Upload, Tooltip, Radio, Flex, Skeleton, Spin } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, StarFilled, VideoCameraOutlined, FileOutlined, LoadingOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile, UploadListType } from "antd/es/upload/interface";
import { Editor } from "@tinymce/tinymce-react";
import {
    ProductBasicColor,
    ProductGender,
    IProductImageFile,
    ProductTemplateOption,
    ProductType,
    ProductVisibility,
    SportType,
    IProductColorProps,
    ICreateNewProductPayload,
    IResponseStatus,
    ITemplateData,
} from "@/types";
import { BaseButton, Box, Container, Image, Text } from "@/components";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    classNames,
    clothingSizeOptions,
    formatPrice,
    isInputOnlyNumber,
    isValidPriceInput,
    parsePrice,
    productAvailableColors,
    productGenderOptions,
    productTypeOptions,
    productVisibilityOptions,
    shoeSizeOptions,
    sportTypeOptions,
    templateOptionList,
} from "@/utils";
import { uploadToCloudinary, formatFileSize } from "@/config/cloudinary";
import { validateColorModalForm, validateCreateOrUpdateProductForm, validateDetailDescription, validateMediaFile, validateProductColorList } from "./utils/validation";
import { useImmerState } from "@/hooks";
import { debounce } from "lodash";
import { useNotification } from "@/context";
import { ProductService, TemplateService } from "@/services";

const { TextArea } = Input;
const { Option } = Select;

interface IAdminCreateProductState {
    productName: string;
    brandName: string;
    description: string;
    productType: ProductType | null;
    sportTypes: SportType[];
    productGender: ProductGender | null;
    productSizes: string[];
    productVisibility: ProductVisibility | null;
    originalPrice: string;
    salePrice: string;
    productColors: IProductColorProps[];
    detailDescriptionOption: ProductTemplateOption;
    detailDescriptionSelectedTemplate: string;
    detailDescriptionSelectedTemplateId: string | null;
    detailDescriptionCustomTemplate: string;
    isOpenPrimaryImageDialog: boolean;
    isOpenAddColorDialog: boolean;
    isConfirmDeleteDialog: boolean;
    editingColorId: number | null;
    modalSelectedColor: ProductBasicColor | null;
    modalColorQuantity: number | null;
    modalImageList: IProductImageFile[];
    allProductImagesGallery: IProductImageFile[];
    primaryImageUid: string | null;
    isSubmitting: boolean;
    isUploadingImages: boolean;
    isLoadingProduct: boolean;
    descriptionTemplates: ITemplateData[];
    descriptionError: string;
    isLoadingTemplate: boolean;
}

interface IBasicFormError {
    productName: string;
    description: string;
    productType: string;
    sportType: string;
    productGender: string;
    productSizes: string;
    productVisibility: string;
    originalPrice: string;
    salePrice: string;
    productColors: string;
    allProductImagesGallery: string;
}

interface IAddColorModalError {
    colorError: string;
    quantityError: string;
    imageUploadError: string;
}

const initialState: IAdminCreateProductState = {
    productName: "",
    brandName: "",
    description: "",
    productSizes: [],
    productType: null,
    sportTypes: [],
    productGender: null,
    productVisibility: null,
    productColors: [],
    allProductImagesGallery: [],
    originalPrice: "",
    salePrice: "",
    detailDescriptionOption: ProductTemplateOption.SelectFromLibrary,
    detailDescriptionCustomTemplate: "",
    detailDescriptionSelectedTemplateId: null,
    detailDescriptionSelectedTemplate: "",
    isOpenPrimaryImageDialog: false,
    isOpenAddColorDialog: false,
    isConfirmDeleteDialog: false,
    editingColorId: null,
    modalSelectedColor: null,
    modalColorQuantity: null,
    modalImageList: [],
    primaryImageUid: null,
    isSubmitting: false,
    isUploadingImages: false,
    isLoadingProduct: false,
    descriptionTemplates: [],
    descriptionError: "",
    isLoadingTemplate: false,
};

const initialBasicFormError: IBasicFormError = {
    productName: "",
    description: "",
    productType: "",
    sportType: "",
    productGender: "",
    productColors: "",
    productSizes: "",
    productVisibility: "",
    salePrice: "",
    originalPrice: "",
    allProductImagesGallery: "",
};

const initialAddColorModalErrorState: IAddColorModalError = {
    colorError: "",
    quantityError: "",
    imageUploadError: "",
};

const CreateProduct: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<IAdminCreateProductState>(initialState);
    const [colorModalErrors, setColorModalErrors] = useImmerState<IAddColorModalError>(initialAddColorModalErrorState);
    const [basicFormError, setBasicFormError] = useImmerState<IBasicFormError>(initialBasicFormError);
    const {
        productName,
        brandName,
        description,
        productType,
        sportTypes,
        productGender,
        productSizes,
        productVisibility,
        productColors,
        allProductImagesGallery,
        originalPrice,
        salePrice,
        detailDescriptionOption,
        detailDescriptionCustomTemplate,
        detailDescriptionSelectedTemplateId,
        detailDescriptionSelectedTemplate,
        isOpenPrimaryImageDialog,
        isOpenAddColorDialog,
        isConfirmDeleteDialog,
        editingColorId,
        modalSelectedColor,
        modalColorQuantity,
        modalImageList,
        primaryImageUid,
        isSubmitting,
        isUploadingImages,
        isLoadingProduct,
        descriptionError,
        descriptionTemplates,
        isLoadingTemplate,
    } = state;
    const [searchParams] = useSearchParams();
    const notify = useNotification();
    const navigate = useNavigate();
    const productId = searchParams.get("id");

    const memoizedModalImageList = React.useMemo(() => modalImageList, [modalImageList]);
    const memoizedAllProductImagesGallery = React.useMemo(() => allProductImagesGallery, [allProductImagesGallery]);

    // Cache for stable blob URLs
    const imageUrlCache = React.useRef<Map<string, string>>(new Map());

    React.useEffect(() => {
        const getProductDetail = async (id: string) => {
            setState({ isLoadingProduct: true });
            const productDetails = await ProductService.getProductById(id);
            if (productDetails.status === IResponseStatus.Error) {
                notify.error(productDetails.message);
                setState({ isLoadingProduct: false });
                navigate("/admin/products");
            } else {
                setState({
                    isLoadingProduct: false,
                    productName: productDetails.data?.product.productName,
                    brandName: productDetails.data?.product.brandName,
                    description: productDetails.data?.product.description,
                    productType: productDetails.data?.product.productType,
                    sportTypes: productDetails.data?.product.sportTypes,
                    productGender: productDetails.data?.product.productGender,
                    productSizes: productDetails.data?.product.productSizes,
                    productVisibility: productDetails.data?.product.productVisibility,
                    productColors: productDetails.data?.product.productColors,
                    originalPrice: productDetails.data?.product.originalPrice.toString(),
                    salePrice: productDetails.data?.product.salePrice?.toString(),
                    primaryImageUid: productDetails.data?.product.primaryImage.uid,
                    allProductImagesGallery: productDetails.data?.product.productColors.flatMap((color) => color.images),
                    detailDescriptionSelectedTemplateId: productDetails.data?.product.detailsDescriptionId,
                    detailDescriptionOption: !!productDetails.data?.product.detailsDescriptionId ? ProductTemplateOption.SelectFromLibrary : ProductTemplateOption.CreateNew,
                    detailDescriptionSelectedTemplate: !!productDetails.data?.product.detailsDescriptionId ? productDetails.data.product.detailsDescription : "",
                    detailDescriptionCustomTemplate: !!productDetails.data?.product.detailsDescriptionId ? "" : productDetails.data?.product.detailsDescription,
                });
            }
        };
        if (productId) {
            getProductDetail(productId);
        }
    }, []);

    React.useEffect(() => {
        const getTemplate = async () => {
            try {
                setState({ isLoadingTemplate: true });
                const result = await TemplateService.getAllTemplates();
                if (result.status === IResponseStatus.Error) {
                    setState({ descriptionTemplates: [] });
                } else {
                    setState({ descriptionTemplates: result.data?.templates });
                }
            } catch (error) {
                console.log(error);
                setState({ descriptionTemplates: [] });
            } finally {
                setState({ isLoadingTemplate: false });
            }
        };

        getTemplate();
    }, []);

    // Clean up cached URLs on component unmount
    React.useEffect(() => {
        return () => {
            imageUrlCache.current.forEach((url) => URL.revokeObjectURL(url));
            imageUrlCache.current.clear();
        };
    }, []);

    const getImageUrl = (image: IProductImageFile): string | undefined => {
        if (image.cloudinaryData?.url) return image.cloudinaryData.url;
        if (image.url) return image.url;
        if (image.file) {
            const cachedUrl = imageUrlCache.current.get(image.uid);
            if (cachedUrl) return cachedUrl;
            const newUrl = URL.createObjectURL(image.file);
            imageUrlCache.current.set(image.uid, newUrl);
            return newUrl;
        }
        return undefined;
    };

    React.useEffect(() => {
        const allImages = productColors.flatMap((color) => color.images);
        if (JSON.stringify(allImages) !== JSON.stringify(memoizedAllProductImagesGallery)) {
            setState({ allProductImagesGallery: allImages });
        }
        if (primaryImageUid && !allImages.some((img) => img.uid === primaryImageUid)) {
            setState({ primaryImageUid: null });
        }
    }, [productColors, primaryImageUid, memoizedAllProductImagesGallery]);

    const getInputClassName = (fieldName: string) => {
        const baseClass = "w-full !px-3 !py-2 !border !border-gray-300 !rounded-md focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent";
        return basicFormError[fieldName] ? `${baseClass} !border-red-500 focus:!ring-red-500` : baseClass;
    };

    const getModalInputClassName = (fieldName: string) => {
        const baseClass = "!w-full !px-3 !py-2 !border !border-gray-300 !rounded-md focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent";
        return colorModalErrors[fieldName] ? `${baseClass} !border-red-500 focus:!ring-red-500` : baseClass;
    };

    const showModal = () => setState({ isOpenAddColorDialog: true });

    const resetModalState = () => {
        memoizedModalImageList.forEach((img) => {
            if (img.url && img.file && img.url.startsWith("blob:") && !imageUrlCache.current.has(img.uid)) {
                URL.revokeObjectURL(img.url);
            }
        });
        setState({
            isOpenAddColorDialog: false,
            editingColorId: null,
            modalSelectedColor: null,
            modalColorQuantity: null,
            modalImageList: [],
        });
        setColorModalErrors({
            colorError: "",
            quantityError: "",
            imageUploadError: "",
        });
    };

    const convertUploadFileToProductImage = (uploadFile: UploadFile): IProductImageFile => {
        const url = uploadFile.url || (uploadFile.originFileObj ? imageUrlCache.current.get(uploadFile.uid) || URL.createObjectURL(uploadFile.originFileObj) : undefined);
        if (url && uploadFile.originFileObj && !imageUrlCache.current.has(uploadFile.uid)) {
            imageUrlCache.current.set(uploadFile.uid, url);
        }
        return {
            uid: uploadFile.uid,
            name: uploadFile.name,
            url,
            type: uploadFile.type,
            file: uploadFile.originFileObj,
            cloudinaryData: (uploadFile as any).cloudinaryData,
        };
    };

    const debouncedHandleModalImageListChange = debounce((newFileList: UploadFile[]) => {
        const productImageList: IProductImageFile[] = newFileList.map((uploadFile) => {
            const existingImage = memoizedModalImageList.find((img) => img.uid === uploadFile.uid);
            if (existingImage && existingImage.url) {
                return existingImage;
            }
            return convertUploadFileToProductImage(uploadFile);
        });
        setState({ modalImageList: productImageList });
        setColorModalErrors({ imageUploadError: "" });
    }, 300);

    const handleAddOrUpdateColor = () => {
        const { isValid, colorModalErrors } = validateColorModalForm(modalSelectedColor, modalColorQuantity, memoizedModalImageList);
        if (!isValid) {
            setColorModalErrors(colorModalErrors);
            return;
        }

        const selectedColorData = productAvailableColors.find((c) => c.value === modalSelectedColor);
        if (!selectedColorData) {
            setColorModalErrors({ colorError: "Màu sắc được chọn không hợp lệ" });
            return;
        }

        const processedImages = memoizedModalImageList.map((img) => ({
            ...img,
            url: getImageUrl(img),
        }));

        if (editingColorId) {
            setState({
                productColors: productColors.map((color) =>
                    color.id === editingColorId
                        ? {
                              ...color,
                              quantity: modalColorQuantity!,
                              images: processedImages,
                          }
                        : color
                ),
            });
        } else {
            const newColor: IProductColorProps = {
                id: Date.now() + Math.random(),
                ...selectedColorData,
                quantity: modalColorQuantity!,
                sale: 0,
                images: processedImages,
            };
            setState({ productColors: [...productColors, newColor] });
        }
        setBasicFormError({ allProductImagesGallery: "", productColors: "" });
        resetModalState();
    };

    const handleDeleteColor = (colorId: number) => {
        const colorToDelete = productColors.find((color) => color.id === colorId);
        if (colorToDelete) {
            colorToDelete.images.forEach((img) => {
                if (img.url && img.file && img.url.startsWith("blob:")) {
                    URL.revokeObjectURL(img.url);
                    imageUrlCache.current.delete(img.uid);
                }
            });
        }

        setState({ productColors: productColors.filter((color) => color.id !== colorId) });
    };

    const onShowEditColorModal = (colorId: number) => {
        const colorToEdit = productColors.find((color) => color.id === colorId);
        if (colorToEdit) {
            const imagesForModal = colorToEdit.images.map((img) => {
                const modalImg: IProductImageFile = {
                    uid: img.uid,
                    name: img.name,
                    type: img.type,
                    file: img.file ? new File([img.file], img.name, { type: img.type }) : undefined,
                    url: getImageUrl(img),
                    cloudinaryData: img.cloudinaryData,
                };
                return modalImg;
            });

            setState({
                isOpenAddColorDialog: true,
                editingColorId: colorId,
                modalSelectedColor: colorToEdit.value,
                modalColorQuantity: colorToEdit.quantity,
                modalImageList: imagesForModal,
            });
            setColorModalErrors({ imageUploadError: "" });
        }
    };

    const onShowPrimaryImageModal = () => setState({ isOpenPrimaryImageDialog: true });

    const onSelectPrimaryImage = (uid: string) => {
        setState({ primaryImageUid: uid, isOpenPrimaryImageDialog: false });
        setBasicFormError({ allProductImagesGallery: "" });
    };

    const uploadProps: UploadProps = {
        fileList: memoizedModalImageList.map((img) => ({
            uid: img.uid,
            name: img.name,
            status: "done" as const,
            url: getImageUrl(img),
            type: img.type,
            cloudinaryData: img.cloudinaryData,
        })),
        onChange: ({ fileList: newFileList }) => debouncedHandleModalImageListChange(newFileList),
        beforeUpload: (file) => {
            const { isValid, errorMessage } = validateMediaFile(file);
            if (memoizedModalImageList.length >= 3) {
                const error = "Mỗi màu chỉ cho phép tối đa 3 hình ảnh/video.";
                setColorModalErrors({ imageUploadError: error });
                return Upload.LIST_IGNORE;
            }
            if (!isValid) {
                setColorModalErrors({ imageUploadError: errorMessage });
                return Upload.LIST_IGNORE;
            }
            setColorModalErrors({ imageUploadError: "" });
            return false;
        },
        onRemove: (file) => {
            const fileToRemove = memoizedModalImageList.find((img) => img.uid === file.uid);
            if (fileToRemove?.url && fileToRemove.url.startsWith("blob:")) {
                URL.revokeObjectURL(fileToRemove.url);
                imageUrlCache.current.delete(fileToRemove.uid);
            }
            setState({
                modalImageList: memoizedModalImageList.filter((img) => img.uid !== file.uid),
            });
            setColorModalErrors({ imageUploadError: "" });
        },
        accept: "image/*,video/*",
        multiple: true,
        listType: "picture-card" as UploadListType,
        showUploadList: {
            showPreviewIcon: true,
            showDownloadIcon: true,
            showRemoveIcon: true,
        },
        itemRender: (_originNode, file, _fileList, { remove }) => {
            const imageFile = memoizedModalImageList.find((img) => img.uid === file.uid);
            const imageUrl = imageFile ? getImageUrl(imageFile) : undefined;
            return (
                <div className="ant-upload-list-item-container">
                    <div className="ant-upload-list-item ant-upload-list-item-done">
                        <Box className="ant-upload-list-item-thumbnail">
                            {imageFile?.type?.startsWith("image/") ? (
                                imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={imageFile.name}
                                        className="ant-upload-list-item-image transition-opacity duration-300"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/placeholder.png";
                                        }}
                                    />
                                ) : (
                                    <Skeleton.Image active className="w-full h-full" />
                                )
                            ) : imageFile?.type?.startsWith("video/") ? (
                                <Flex align="center" justify="center" className="w-full h-full bg-gray-200">
                                    <VideoCameraOutlined className="text-2xl text-gray-500" />
                                </Flex>
                            ) : (
                                <Flex align="center" justify="center" className=" w-full h-full bg-gray-200">
                                    <FileOutlined className="text-2xl text-gray-500" />
                                </Flex>
                            )}
                        </Box>
                        <Box className="ant-upload-list-item-actions">
                            {remove && (
                                <Tooltip title="Xóa">
                                    <Button type="text" size="small" icon={<DeleteOutlined />} onClick={remove} className="text-red-500 hover:text-red-700" />
                                </Tooltip>
                            )}
                        </Box>
                        <Box className="ant-upload-list-item-name" title={imageFile?.name}>
                            {imageFile?.name}
                            {imageFile?.file && (
                                <Text as="span" margin={[0, 0, 0, 4]} size="xs" className="text-gray-500">
                                    ({formatFileSize(imageFile.file.size)})
                                </Text>
                            )}
                        </Box>
                    </div>
                </div>
            );
        },
    };

    const uploadAllImagesToCloudinary = async (): Promise<IProductColorProps[]> => {
        setState({ isUploadingImages: true });
        try {
            const uploadedColors: IProductColorProps[] = [];
            for (const color of productColors) {
                const uploadedImages: IProductImageFile[] = [];
                for (const imageFile of color.images) {
                    if (imageFile.file && !imageFile.cloudinaryData) {
                        try {
                            const cloudinaryResponse = await uploadToCloudinary(imageFile.file, "products");
                            const completedImage: IProductImageFile = {
                                ...imageFile,
                                url: cloudinaryResponse.url,
                                cloudinaryData: cloudinaryResponse,
                                file: undefined,
                            };
                            uploadedImages.push(completedImage);
                            imageUrlCache.current.delete(imageFile.uid);
                        } catch (error) {
                            const errorMessage = `Lỗi khi tải ảnh ${imageFile.name}: ${error instanceof Error ? error.message : "Unknown error"}`;
                            notify.error(errorMessage);
                            throw new Error(errorMessage);
                        }
                    } else {
                        uploadedImages.push({
                            ...imageFile,
                            file: imageFile.file ? new File([imageFile.file], imageFile.name, { type: imageFile.type }) : undefined,
                        });
                    }
                }
                uploadedColors.push({
                    ...color,
                    images: uploadedImages,
                });
            }
            setState({ isUploadingImages: false });
            return uploadedColors;
        } catch (error) {
            setState({ isUploadingImages: false });
            throw error;
        }
    };

    const handleSubmitProduct = async () => {
        const parsedOriginalPrice = parsePrice(originalPrice);
        const parsedSalePrice = parsePrice(salePrice);
        const { isValidBasicForm, formErrors } = validateCreateOrUpdateProductForm({
            productName,
            description,
            productType,
            sportTypes,
            productGender,
            productSizes,
            productVisibility,
            originalPrice: parseInt(parsedOriginalPrice ?? ""),
            salePrice: parseInt(parsedSalePrice ?? ""),
        });
        const { isValidColorList, colorListErrorMessage } = validateProductColorList(productColors);
        const detailDescriptionContent = detailDescriptionOption === ProductTemplateOption.CreateNew ? detailDescriptionCustomTemplate : detailDescriptionSelectedTemplate;
        const { isDetailDescriptionValid, detailDescriptionErrorMessage } = validateDetailDescription(detailDescriptionOption, detailDescriptionContent);
        const hasImages = memoizedAllProductImagesGallery.length > 0;
        const isSelectedPrimaryImage = primaryImageUid !== null;

        if (!isValidBasicForm || !isValidColorList || (hasImages && !isSelectedPrimaryImage) || !isDetailDescriptionValid) {
            if (!isValidBasicForm) {
                setBasicFormError(formErrors);
            }
            if (!isValidColorList) {
                setBasicFormError({ productColors: colorListErrorMessage });
            }

            if (!hasImages) {
                setBasicFormError({ allProductImagesGallery: "Vui lòng tải ảnh cho sản phẩm" });
            }

            if (hasImages && !isSelectedPrimaryImage) {
                setBasicFormError({ allProductImagesGallery: "Vui lòng chọn một ảnh chính cho sản phẩm" });
            }

            if (!isDetailDescriptionValid) {
                setState({ descriptionError: detailDescriptionErrorMessage });
            }
            return;
        }

        try {
            setState({ isSubmitting: true });
            const uploadedColors = await uploadAllImagesToCloudinary();
            let primaryImage: IProductImageFile | undefined;
            if (primaryImageUid) {
                const allUploadedImages = uploadedColors.flatMap((color) => color.images);
                primaryImage = allUploadedImages.find((img) => img.uid === primaryImageUid);
            }

            const productPayload: ICreateNewProductPayload = {
                productName,
                brandName,
                description,
                productType: productType!,
                sportTypes: sportTypes!,
                productGender: productGender!,
                productSizes: productSizes || [],
                productVisibility: productVisibility!,
                originalPrice: parseFloat(parsedOriginalPrice!),
                salePrice: parseFloat(parsedSalePrice!),
                productColors: uploadedColors,
                primaryImage: primaryImage!,
                detailsDescriptionId: detailDescriptionSelectedTemplateId,
                detailsDescription: detailDescriptionContent,
            };

            const serviceCall = productId ? ProductService.updateProduct(productId, productPayload) : ProductService.createNewProduct(productPayload);

            await serviceCall.then((data) => {
                if (data.status === IResponseStatus.Error) {
                    notify.error(data.message);
                } else {
                    notify.success(data.message);
                    navigate("/admin/products");
                }
            });
            setState({ productColors: uploadedColors });
        } catch (error) {
            console.error("Error creating/updating product:", error);
            notify.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu sản phẩm");
        } finally {
            setState({ isSubmitting: false });
        }
    };

    const handleDeleteProduct = async () => {
        await ProductService.deleteProduct(productId!)
            .then((data) => {
                if (data.status === IResponseStatus.Error) {
                    notify.error(data.message);
                } else {
                    notify.success(data.message);
                }
            })
            .then(() => {
                navigate("/admin/products");
            });
    };

    const renderImageGallery = () => {
        return (
            <Flex wrap="nowrap" className="overflow-x-auto gap-4 !pb-2 custom-scrollbar">
                {memoizedAllProductImagesGallery.map((file) => {
                    const imageUrl = getImageUrl(file);
                    return (
                        <Box
                            key={file.uid}
                            className={classNames(
                                "relative flex-shrink-0 w-40 h-32 !rounded-lg overflow-hidden cursor-pointer !border-2 hover:!border-blue-400 !transition-all",
                                {
                                    "!border-blue-500 !shadow-lg": file.uid === primaryImageUid,
                                },
                                {
                                    "!border-gray-300": file.uid !== primaryImageUid,
                                }
                            )}
                            onClick={() => onSelectPrimaryImage(file.uid)}
                        >
                            {file.type?.startsWith("image/") ? (
                                imageUrl ? (
                                    <Image
                                        width="100%"
                                        height="100%"
                                        objectFit="cover"
                                        src={imageUrl}
                                        alt={file.name}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/placeholder.png";
                                        }}
                                        className="transition-opacity duration-300"
                                    />
                                ) : (
                                    <Skeleton.Image active className="w-full h-full" />
                                )
                            ) : file.type?.startsWith("video/") ? (
                                <Flex align="center" justify="center" className="w-full h-full bg-gray-200">
                                    <VideoCameraOutlined className="text-3xl text-gray-500" />
                                </Flex>
                            ) : (
                                <Flex align="center" justify="center" className="w-full h-full bg-gray-200">
                                    <FileOutlined className="!text-3xl !text-gray-500" />
                                </Flex>
                            )}
                            {file.uid === primaryImageUid && (
                                <Box className="!absolute !top-1 !right-1 !bg-blue-500 !text-white !rounded-full !p-1 !flex !items-center !justify-center">
                                    <StarFilled className="!text-sm" />
                                </Box>
                            )}
                            <Box padding={[4, 4, 4, 4]} className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs truncate">
                                {file.name}
                            </Box>
                        </Box>
                    );
                })}
            </Flex>
        );
    };

    const renderColorImages = (images: IProductImageFile[]) => {
        return (
            <Flex wrap="wrap" gap={8}>
                {images.map((image) => {
                    const imageUrl = getImageUrl(image);
                    return (
                        <Box key={image.uid} className="relative w-20 h-20 !rounded-md overflow-hidden !border !border-gray-300">
                            {image.type?.startsWith("image/") ? (
                                imageUrl ? (
                                    <Image
                                        width="100%"
                                        height="100%"
                                        objectFit="cover"
                                        src={imageUrl}
                                        alt={image.name}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/placeholder.png";
                                        }}
                                        className="transition-opacity duration-300"
                                    />
                                ) : (
                                    <Skeleton.Image active className="w-full h-full" />
                                )
                            ) : image.type?.startsWith("video/") ? (
                                <Flex align="center" justify="center" className="w-full h-full bg-gray-200">
                                    <VideoCameraOutlined className="text-lg text-gray-500" />
                                </Flex>
                            ) : (
                                <Flex align="center" justify="center" className="w-full h-full bg-gray-200">
                                    <FileOutlined className="text-lg text-gray-500" />
                                </Flex>
                            )}
                        </Box>
                    );
                })}
            </Flex>
        );
    };

    return (
        <Container bgColor="transparent flex-grow min-h-full">
            <Box margin={[0, 0, 24, 0]}>
                <Text className="!text-gray-900" size="2xl" fontWeight="bold" titleText={productId ? "Cập nhật sản phẩm" : "Tạo sản phẩm"} padding={[0, 0, 16, 0]} />
            </Box>
            <Container className="!rounded-lg !shadow-sm" bgColor="white" padding={[24, 24, 24, 24]} margin={[0, 0, 32, 0]}>
                {isLoadingProduct ? (
                    <Flex align="center" justify="center" className="min-h-100">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                    </Flex>
                ) : (
                    <React.Fragment>
                        <Container margin={[0, 0, 32, 0]} className="space-y-4">
                            <Container className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Box margin={[0, 0, 0, 0]}>
                                    <Text as="label" size="base" fontWeight="semibold" className="!text-gray-800 block" titleText="Tên sản phẩm" margin={[0, 0, 4, 0]} />
                                    <Input
                                        name="productName"
                                        placeholder="Nhập tên sản phẩm"
                                        value={productName}
                                        onChange={(e) => {
                                            setState({ productName: e.target.value });
                                            setBasicFormError({ productName: "" });
                                        }}
                                        className={getInputClassName("productName")}
                                        disabled={isUploadingImages || isSubmitting}
                                    />
                                    {basicFormError.productName && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={basicFormError.productName} />}
                                </Box>

                                <Box margin={[0, 0, 0, 0]}>
                                    <Text as="label" size="base" fontWeight="semibold" className="!text-gray-800 block" titleText="Thương hiệu" margin={[0, 0, 4, 0]} />
                                    <Input
                                        name="brandName"
                                        placeholder="Nhập tên thương hiệu"
                                        value={brandName}
                                        onChange={(e) => setState({ brandName: e.target.value })}
                                        className={getInputClassName("brandName")}
                                        disabled={isUploadingImages || isSubmitting}
                                    />
                                </Box>

                                <Box margin={[0, 0, 0, 0]} className="md:col-span-2">
                                    <Text as="label" size="base" fontWeight="semibold" className="!text-gray-800 block" titleText="Mô tả chung" margin={[0, 0, 4, 0]} />
                                    <TextArea
                                        name="description"
                                        rows={4}
                                        placeholder="Nhập mô tả chung"
                                        value={description}
                                        onChange={(e) => {
                                            setState({ description: e.target.value });
                                            setBasicFormError({ description: "" });
                                        }}
                                        className={`${getInputClassName("description")} resize-none`}
                                        disabled={isUploadingImages || isSubmitting}
                                    />
                                    {basicFormError.description && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={basicFormError.description} />}
                                </Box>

                                <Box margin={[0, 0, 0, 0]}>
                                    <Text as="label" size="base" fontWeight="semibold" className="!text-gray-800 block" titleText="Loại sản phẩm" margin={[0, 0, 4, 0]} />
                                    <Select
                                        placeholder="Chọn loại sản phẩm"
                                        value={productType}
                                        onChange={(value) => {
                                            setState({ productType: value, productSizes: [] });
                                            setBasicFormError({ productType: "", productSizes: "" });
                                        }}
                                        className="w-full"
                                        status={basicFormError.productType ? "error" : undefined}
                                        disabled={isUploadingImages || isSubmitting}
                                    >
                                        {productTypeOptions.map((type) => (
                                            <Option key={type.value} value={type.value}>
                                                {type.label}
                                            </Option>
                                        ))}
                                    </Select>
                                    {basicFormError.productType && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={basicFormError.productType} />}
                                </Box>

                                <Box margin={[0, 0, 0, 0]}>
                                    <Text as="label" size="base" fontWeight="semibold" className="!text-gray-800 block" titleText="Môn thể thao" margin={[0, 0, 4, 0]} />
                                    <Select
                                        placeholder="Chọn môn thể thao"
                                        mode="multiple"
                                        value={sportTypes}
                                        onChange={(value: SportType[]) => {
                                            setState({ sportTypes: value });
                                            setBasicFormError({ sportType: "" });
                                        }}
                                        className="w-full"
                                        status={basicFormError.sportType ? "error" : undefined}
                                        disabled={isUploadingImages || isSubmitting}
                                    >
                                        {sportTypeOptions.map((type) => (
                                            <Option key={type.value} value={type.value}>
                                                {type.label}
                                            </Option>
                                        ))}
                                    </Select>
                                    {basicFormError.sportType && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={basicFormError.sportType} />}
                                </Box>

                                <Box margin={[0, 0, 0, 0]}>
                                    <Text as="label" size="base" fontWeight="semibold" className="!text-gray-800 block" titleText="Giới tính" margin={[0, 0, 4, 0]} />
                                    <Select
                                        placeholder="Chọn giới tính"
                                        value={productGender}
                                        onChange={(value) => {
                                            setState({ productGender: value });
                                            setBasicFormError({ productGender: "" });
                                        }}
                                        className="w-full"
                                        status={basicFormError.productGender ? "error" : undefined}
                                        disabled={isUploadingImages || isSubmitting}
                                    >
                                        {productGenderOptions.map((type) => (
                                            <Option key={type.value} value={type.value}>
                                                {type.label}
                                            </Option>
                                        ))}
                                    </Select>
                                    {basicFormError.productGender && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={basicFormError.productGender} />}
                                </Box>

                                {(productType === ProductType.Shoes || productType === ProductType.TShirt || productType === ProductType.Shorts || productType === ProductType.Skirt) && (
                                    <Box margin={[0, 0, 0, 0]}>
                                        <Text as="label" size="base" fontWeight="semibold" className="!text-gray-800 block" titleText="Kích thước" margin={[0, 0, 4, 0]} />
                                        <Select
                                            placeholder="Chọn kích thước"
                                            mode="multiple"
                                            value={productSizes}
                                            onChange={(value: string[]) => {
                                                setState({ productSizes: value });
                                                setBasicFormError({ productSizes: "" });
                                            }}
                                            className="w-full"
                                            status={basicFormError.productSizes ? "error" : undefined}
                                            disabled={isUploadingImages || isSubmitting}
                                        >
                                            {productType === ProductType.Shoes
                                                ? shoeSizeOptions.map((size) => (
                                                      <Option key={size} value={size}>
                                                          {size}
                                                      </Option>
                                                  ))
                                                : clothingSizeOptions.map((size) => (
                                                      <Option key={size} value={size}>
                                                          {size}
                                                      </Option>
                                                  ))}
                                        </Select>
                                        {basicFormError.productSizes && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={basicFormError.productSizes} />}
                                    </Box>
                                )}

                                <Box margin={[0, 0, 0, 0]}>
                                    <Text as="label" size="base" fontWeight="semibold" className="!text-gray-800 block" titleText="Hiển thị" margin={[0, 0, 4, 0]} />
                                    <Select
                                        placeholder="Chọn chế độ hiển thị sản phẩm"
                                        value={productVisibility}
                                        onChange={(value) => {
                                            setState({ productVisibility: value });
                                            setBasicFormError({ productVisibility: "" });
                                        }}
                                        className="!w-full"
                                        status={basicFormError.productVisibility ? "error" : undefined}
                                        disabled={isUploadingImages || isSubmitting}
                                    >
                                        {productVisibilityOptions.map((option) => (
                                            <Option value={option.value}>{option.label}</Option>
                                        ))}
                                    </Select>
                                    {basicFormError.productVisibility && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={basicFormError.productVisibility} />}
                                </Box>

                                <Container className="grid grid-cols-2 gap-4 col-span-full">
                                    <Box margin={[0, 0, 0, 0]}>
                                        <Text as="label" size="base" fontWeight="semibold" className="!text-gray-800 block" titleText="Giá gốc" margin={[0, 0, 4, 0]} />
                                        <Input
                                            name="originalPrice"
                                            placeholder="Nhập giá gốc sản phẩm"
                                            value={formatPrice(originalPrice)}
                                            onChange={(e) => {
                                                if (e.target.value === "") {
                                                    setState({ originalPrice: "" });
                                                    setBasicFormError({ originalPrice: "" });
                                                } else {
                                                    const rawValue = parsePrice(e.target.value);
                                                    if (isValidPriceInput(rawValue)) {
                                                        setState({ originalPrice: rawValue });
                                                        setBasicFormError({ originalPrice: "" });
                                                    }
                                                }
                                            }}
                                            suffix="đ"
                                            className={getInputClassName("originalPrice")}
                                            disabled={isUploadingImages || isSubmitting}
                                        />
                                        {basicFormError.originalPrice && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={basicFormError.originalPrice} />}
                                    </Box>
                                    <Box margin={[0, 0, 0, 0]}>
                                        <Text as="label" size="base" fontWeight="semibold" className="!text-gray-800 block" titleText="Giá khuyến mãi" margin={[0, 0, 4, 0]} />
                                        <Input
                                            name="salePrice"
                                            placeholder="Nhập giá khuyến mãi"
                                            value={formatPrice(salePrice)}
                                            onChange={(e) => {
                                                if (e.target.value === "") {
                                                    setState({ salePrice: "" });
                                                    setBasicFormError({ salePrice: "" });
                                                } else {
                                                    const rawValue = parsePrice(e.target.value);
                                                    if (isValidPriceInput(rawValue)) {
                                                        setState({ salePrice: rawValue });
                                                        setBasicFormError({ salePrice: "" });
                                                    }
                                                }
                                            }}
                                            suffix="đ"
                                            className={getInputClassName("salePrice")}
                                            disabled={isUploadingImages || isSubmitting}
                                        />
                                        {basicFormError.salePrice && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={basicFormError.salePrice} />}
                                    </Box>
                                </Container>
                            </Container>
                        </Container>

                        <Container margin={[0, 0, 32, 0]}>
                            <Flex align="center" justify="space-between" className="!mb-6 gap-2 max-[470px]:flex-col max-[470px]:!items-start">
                                <Text size="base" fontWeight="semibold" className="text-gray-800" titleText="Thư viện ảnh sản phẩm" />
                                {memoizedAllProductImagesGallery.length > 0 && (
                                    <BaseButton radius="md" displayText={primaryImageUid ? "Thay Đổi Ảnh Sản Phẩm Chính" : "Chọn Ảnh Sản Phẩm Chính"} onClick={onShowPrimaryImageModal} />
                                )}
                            </Flex>

                            {isUploadingImages && (
                                <Container margin={[0, 0, 16, 0]} padding={[16, 16, 16, 16]} className="text-center bg-blue-50 !rounded-md">
                                    <Text titleText="Đang tải ảnh lên Cloudinary..." className="text-blue-600" />
                                </Container>
                            )}

                            {memoizedAllProductImagesGallery.length === 0 ? (
                                <Container padding={[32, 32, 32, 32]} className="text-center text-gray-500 !border !border-dashed !border-gray-300 !rounded-md">
                                    <Text as="p" titleText="Chưa có hình ảnh nào trong thư viện." />
                                    <Text size="sm" titleText="Vui lòng thêm màu sắc sản phẩm và tải ảnh lên." />
                                </Container>
                            ) : (
                                renderImageGallery()
                            )}

                            {basicFormError.allProductImagesGallery && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={basicFormError.allProductImagesGallery} />}

                            {isOpenPrimaryImageDialog && (
                                <Modal
                                    title="Chọn Ảnh Sản Phẩm Chính"
                                    open={isOpenPrimaryImageDialog}
                                    onCancel={() => setState({ isOpenPrimaryImageDialog: false })}
                                    footer={null}
                                    width={800}
                                    className="!rounded-lg"
                                >
                                    <Container padding={[16, 16, 16, 16]} className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto">
                                        {memoizedAllProductImagesGallery.length > 0 ? (
                                            memoizedAllProductImagesGallery.map((file) => {
                                                const imageUrl = getImageUrl(file);
                                                return (
                                                    <Box
                                                        key={file.uid}
                                                        className={classNames(
                                                            "relative flex-shrink-0 w-32 h-32 !rounded-lg overflow-hidden cursor-pointer !border-2 hover:!border-blue-400 transition-all",
                                                            {
                                                                "!border-blue-500 !shadow-lg": file.uid === primaryImageUid,
                                                            },
                                                            {
                                                                "!border-gray-300": file.uid !== primaryImageUid,
                                                            }
                                                        )}
                                                        onClick={() => onSelectPrimaryImage(file.uid)}
                                                    >
                                                        {file.type?.startsWith("image/") ? (
                                                            imageUrl ? (
                                                                <Image
                                                                    width="100%"
                                                                    height="100%"
                                                                    objectFit="cover"
                                                                    src={imageUrl}
                                                                    alt={file.name}
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.src = "/placeholder.png";
                                                                    }}
                                                                    className="transition-opacity duration-300"
                                                                />
                                                            ) : (
                                                                <Skeleton.Image active className="w-full h-full" />
                                                            )
                                                        ) : file.type?.startsWith("video/") ? (
                                                            <Flex align="center" justify="center" className="w-full h-full bg-gray-200">
                                                                <VideoCameraOutlined className="text-3xl text-gray-500" />
                                                            </Flex>
                                                        ) : (
                                                            <Flex align="center" justify="center" className="w-full h-full bg-gray-200">
                                                                <FileOutlined className="!text-3xl !text-gray-500" />
                                                            </Flex>
                                                        )}
                                                        {file.uid === primaryImageUid && (
                                                            <Box className="!absolute !top-1 !right-1 !bg-blue-500 !text-white !rounded-full !p-1 !flex !items-center !justify-center">
                                                                <StarFilled className="!text-sm" />
                                                            </Box>
                                                        )}
                                                        <Box padding={[4, 4, 4, 4]} className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs truncate">
                                                            {file.name}
                                                        </Box>
                                                    </Box>
                                                );
                                            })
                                        ) : (
                                            <Text textAlign="center" className="col-span-full text-gray-500" titleText="Chưa có hình ảnh nào được tải lên." />
                                        )}
                                    </Container>
                                </Modal>
                            )}
                        </Container>

                        <Container margin={[0, 0, 32, 0]}>
                            <Flex align="center" justify="space-between" className="!mb-6 gap-2 max-[470px]:flex-col max-[470px]:!items-start">
                                <Text size="base" fontWeight="semibold" className="text-gray-800" titleText="Màu sản phẩm" />
                                <BaseButton
                                    radius="md"
                                    displayText={
                                        <React.Fragment>
                                            <PlusOutlined />
                                            <Text as="span" titleText="Thêm màu sắc sản phẩm" />
                                        </React.Fragment>
                                    }
                                    onClick={showModal}
                                    disabled={isUploadingImages || isSubmitting}
                                />
                            </Flex>

                            {isUploadingImages && (
                                <Container margin={[0, 0, 16, 0]} padding={[16, 16, 16, 16]} className="text-center bg-blue-50 !rounded-md">
                                    <Text titleText="Đang tải ảnh lên Cloudinary..." className="text-blue-600" />
                                </Container>
                            )}

                            {productColors.length === 0 ? (
                                <Text titleText="Chưa có màu sắc nào được thêm" textAlign="center" padding={[32, 32, 32, 32]} className="text-gray-500" />
                            ) : (
                                <Container className="space-y-4">
                                    {productColors.map((color) => (
                                        <Box key={color.id} padding={[16, 16, 16, 16]} className="bg-gray-50 !rounded-lg">
                                            <Flex align="center" justify="space-between" gap={16} className="!mb-4 flex-wrap">
                                                <Flex align="center" gap={12}>
                                                    <Box className="flex-shrink-0 w-8 h-8 !rounded-full !border-2 !border-gray-300" bgColor={color.hex} />
                                                    <Text as="p" fontWeight="medium" size="base" className="text-gray-900" titleText={color.name} />
                                                </Flex>
                                                <Text as="p" textAlign="center" size="sm" className="text-gray-500" titleText={`Số lượng: ${color.quantity}`} />

                                                <Flex justify="center" className="sm:justify-end" gap={8}>
                                                    <Button
                                                        icon={<EditOutlined />}
                                                        onClick={() => onShowEditColorModal(color.id)}
                                                        disabled={isUploadingImages || isSubmitting}
                                                        className="!border-blue-300 hover:!border-blue-500 !text-blue-600 text-xs !px-2 !py-1"
                                                    >
                                                        Cập nhật
                                                    </Button>
                                                    <Button
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => handleDeleteColor(color.id)}
                                                        disabled={isUploadingImages || isSubmitting}
                                                        className="!border-red-300 hover:!border-red-500 text-xs !px-2 !py-1"
                                                    >
                                                        Xóa
                                                    </Button>
                                                </Flex>
                                            </Flex>

                                            {color.images.length > 0 ? renderColorImages(color.images) : <Text titleText="Không có hình ảnh cho màu này" className="text-gray-500 text-sm" />}
                                        </Box>
                                    ))}
                                </Container>
                            )}

                            {basicFormError.productColors && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={basicFormError.productColors} />}

                            {isOpenAddColorDialog && (
                                <Modal
                                    title={editingColorId ? "Cập nhật màu sắc sản phẩm" : "Thêm màu sắc sản phẩm"}
                                    open={isOpenAddColorDialog}
                                    onCancel={resetModalState}
                                    footer={null}
                                    className="!rounded-lg"
                                >
                                    <Container margin={[16, 0, 0, 0]}>
                                        <Box margin={[0, 0, 16, 0]}>
                                            <Text size="base" fontWeight="semibold" className="text-gray-800 block" titleText="Chọn màu sắc" margin={[0, 0, 4, 0]} />
                                            <Select
                                                placeholder="Chọn màu sắc"
                                                value={modalSelectedColor}
                                                onChange={(value) => {
                                                    setState({ modalSelectedColor: value });
                                                    setColorModalErrors({ colorError: "" });
                                                }}
                                                className="!w-full"
                                                disabled={!!editingColorId}
                                                status={colorModalErrors.colorError ? "error" : undefined}
                                            >
                                                {productAvailableColors.map((color) => (
                                                    <Option
                                                        key={color.value}
                                                        value={color.value}
                                                        disabled={productColors.some((existingColor) => existingColor.value === color.value && existingColor.id !== editingColorId)}
                                                    >
                                                        <Flex align="center" className="!space-x-2">
                                                            <Box className="w-4 h-4 !rounded-full !border" bgColor={color.hex} />
                                                            <Text as="span" titleText={color.name} />
                                                        </Flex>
                                                    </Option>
                                                ))}
                                            </Select>
                                            {colorModalErrors.colorError && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={colorModalErrors.colorError} />}
                                        </Box>

                                        <Box margin={[0, 0, 16, 0]}>
                                            <Text as="label" size="base" fontWeight="semibold" className="!text-gray-800 block" titleText="Số lượng" margin={[0, 0, 4, 0]} />
                                            <Input
                                                placeholder="Nhập số lượng"
                                                value={modalColorQuantity ?? ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if ((isInputOnlyNumber(value) && parseInt(value) >= 0) || value === "") {
                                                        setState({ modalColorQuantity: value ? Number(value) : null });
                                                        setColorModalErrors({ quantityError: "" });
                                                    }
                                                }}
                                                className={getModalInputClassName("quantityError")}
                                            />
                                            {colorModalErrors.quantityError && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={colorModalErrors.quantityError} />}
                                        </Box>

                                        <Box margin={[0, 0, 24, 0]}>
                                            <Text as="label" size="base" fontWeight="semibold" className="!text-gray-800 block" titleText="Hình ảnh/Video sản phẩm" margin={[0, 0, 4, 0]} />
                                            <Upload {...uploadProps}>
                                                {memoizedModalImageList.length < 3 && (
                                                    <Box>
                                                        <PlusOutlined />
                                                        <Text margin={[8, 0, 0, 0]} titleText="Tải lên" />
                                                    </Box>
                                                )}
                                            </Upload>
                                            {colorModalErrors.imageUploadError && <p className="!text-red-500 !text-xs !mt-1">{colorModalErrors.imageUploadError}</p>}
                                        </Box>

                                        <Flex justify="flex-end" className="!space-x-2">
                                            <Button onClick={resetModalState} className="!px-4 !py-2" disabled={isUploadingImages}>
                                                Hủy
                                            </Button>
                                            <Button
                                                type="primary"
                                                onClick={handleAddOrUpdateColor}
                                                className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700 !px-4 !py-2"
                                                disabled={isUploadingImages}
                                            >
                                                {editingColorId ? "Cập nhật" : "Thêm"}
                                            </Button>
                                        </Flex>
                                    </Container>
                                </Modal>
                            )}
                        </Container>

                        <Container margin={[32, 0, 0, 0]} padding={[24, 0, 24, 0]} className="!border-t !border-gray-200">
                            <Text size="base" fontWeight="semibold" titleText="Mô tả chi tiết sản phẩm" margin={[0, 0, 16, 0]} className="!text-gray-800" />
                            <Radio.Group
                                onChange={(e) => {
                                    setState({
                                        detailDescriptionOption: e.target.value,
                                        descriptionError: "",
                                    });
                                }}
                                value={detailDescriptionOption}
                                className="!mb-4"
                                disabled={isSubmitting}
                            >
                                {templateOptionList.map((template) => (
                                    <Radio key={template.value} value={template.value}>
                                        {template.label}
                                    </Radio>
                                ))}
                            </Radio.Group>

                            {detailDescriptionOption === ProductTemplateOption.SelectFromLibrary && (
                                <Container margin={[0, 0, 16, 0]}>
                                    <Select
                                        placeholder="Chọn một template mô tả"
                                        value={detailDescriptionSelectedTemplateId || undefined}
                                        onChange={(value) => {
                                            const templateOption = descriptionTemplates.find((item) => item._id === value)!;
                                            setState({ detailDescriptionSelectedTemplateId: value, detailDescriptionSelectedTemplate: templateOption.templateContent, descriptionError: "" });
                                        }}
                                        className="w-full"
                                        loading={isLoadingTemplate}
                                        disabled={isSubmitting}
                                    >
                                        {descriptionTemplates.map((template) => (
                                            <Option key={template._id} value={template._id}>
                                                {template.templateName}
                                            </Option>
                                        ))}
                                    </Select>
                                    {descriptionError && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={descriptionError} />}
                                </Container>
                            )}

                            {detailDescriptionOption === ProductTemplateOption.CreateNew && (
                                <Container margin={[0, 0, 16, 0]}>
                                    <Editor
                                        apiKey="hmzm0nlodu2gg1kh1l7jd63rdgm4ufkleiair59pn7xblofl"
                                        init={{
                                            height: 320,
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
                                            toolbar:
                                                "undo redo | styleselect | fontsize | " +
                                                "forecolor backcolor | " +
                                                "bold italic underline strikethrough | subscript superscript | " +
                                                "alignleft aligncenter alignright alignjustify | " +
                                                "bullist numlist outdent indent | blockquote | " +
                                                "link image media table | charmap emoticons | preview fullscreen | code help | removeformat",
                                            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                            toolbar_sticky: true,
                                            fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
                                            color_map: [
                                                "000000",
                                                "Đen",
                                                "FF0000",
                                                "Đỏ",
                                                "00FF00",
                                                "Xanh lá",
                                                "0000FF",
                                                "Xanh dương",
                                                "FFFF00",
                                                "Vàng",
                                                "FF00FF",
                                                "Hồng",
                                                "00FFFF",
                                                "Xanh cyan",
                                                "FFFFFF",
                                                "Trắng",
                                                "808080",
                                                "Xám",
                                                "FFA500",
                                                "Cam",
                                                "800080",
                                                "Tím",
                                                "A52A2A",
                                                "Nâu",
                                            ],
                                        }}
                                        value={detailDescriptionCustomTemplate}
                                        onEditorChange={(newValue) => setState({ detailDescriptionCustomTemplate: newValue, descriptionError: "" })}
                                        disabled={isSubmitting}
                                    />
                                    {descriptionError && <Text as="p" size="xs" margin={[4, 0, 0, 0]} className="text-red-500" titleText={descriptionError} />}
                                </Container>
                            )}
                        </Container>

                        {isConfirmDeleteDialog && (
                            <Modal title={"Xóa sản phẩm"} open={isConfirmDeleteDialog} onCancel={() => setState({ isConfirmDeleteDialog: false })} footer={null} className="!rounded-lg">
                                <Container margin={[16, 0, 0, 0]}>
                                    <Text className="text-gray-800 block" titleText="Bạn có chắc chắn muốn xóa sản phẩm này?" margin={[0, 0, 4, 0]} />

                                    <Flex justify="flex-end" className="!space-x-2">
                                        <Button onClick={() => setState({ isConfirmDeleteDialog: false })} className="!px-4 !py-2">
                                            Hủy
                                        </Button>
                                        <Button type="primary" onClick={handleDeleteProduct} className="!bg-red-600 !border-red-600 hover:!bg-red-700 !px-4 !py-2">
                                            Xóa
                                        </Button>
                                    </Flex>
                                </Container>
                            </Modal>
                        )}

                        <Flex justify="center" className="!pt-6">
                            <Space size="middle">
                                <BaseButton
                                    radius="md"
                                    padding={[8, 24, 8, 24]}
                                    displayText={isSubmitting ? (productId ? "Đang cập nhật..." : "Đang tạo...") : productId ? "Cập nhật" : "Tạo mới"}
                                    onClick={handleSubmitProduct}
                                    disabled={isUploadingImages || isSubmitting}
                                />
                                {productId && (
                                    <BaseButton
                                        colors={{
                                            normal: {
                                                bgColor: "#ff4d4f",
                                                textColor: "white",
                                            },
                                            hover: {
                                                bgColor: "#c10007",
                                                textColor: "white",
                                            },
                                        }}
                                        radius="md"
                                        padding={[8, 32, 8, 32]}
                                        displayText="Xóa"
                                        disabled={isUploadingImages || isSubmitting}
                                        onClick={() => setState({ isConfirmDeleteDialog: true })}
                                    />
                                )}
                                <BaseButton
                                    colors={{
                                        normal: {
                                            bgColor: "white",
                                            textColor: "#333",
                                        },
                                        hover: {
                                            bgColor: "#fbf9fa",
                                            textColor: "#333",
                                        },
                                    }}
                                    radius="md"
                                    className="!border !border-gray-300"
                                    padding={[8, 32, 8, 32]}
                                    displayText="Hủy"
                                    disabled={isUploadingImages || isSubmitting}
                                    onClick={() => navigate("/admin/products")}
                                />
                            </Space>
                        </Flex>
                    </React.Fragment>
                )}
            </Container>
        </Container>
    );
};

export { CreateProduct };
