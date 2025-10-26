/** @format */

import { CloudinaryUploadResponse } from "@/config";

export enum ProductType {
    Shoes = 1,
    TShirt,
    Shorts,
    Skirt,
    Accessory,
}

export enum SportType {
    Jogging = 1,
    Tennis,
    Cycling,
    Football,
    TableTennis,
    Badminton,
    Basketball,
    Volleyball,
    Swimming,
    Camping,
    Fitness,
}

export enum ProductGender {
    Unisex = 1,
    Male,
    Female,
}

export enum ProductVisibility {
    Hidden = 1,
    Visibility,
}

export enum ProductBasicColor {
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

export enum ProductTemplateOption {
    CreateNew = 1,
    SelectFromLibrary,
}

export interface IProductColor {
    color: ProductBasicColor;
    colorQuantity: number;
    colorImgList: string[];
}

export interface IProductInfo {
    _id: string;
    productName: string;
    brandName?: string;
    description: string;
    productType: ProductType;
    sportTypes: SportType[];
    productGender: ProductGender;
    productSizes: string[];
    productVisibility: ProductVisibility;
    originalPrice: number;
    salePrice?: number;
    productColors: IProductColorProps[];
    primaryImage: IProductImageFile;
    detailsDescriptionId: string | null;
    detailsDescription: string;
    refundPolicyDescription: string;
    stockQuantity: number;
    saleQuantity: number;
}

export interface IProductImageFile {
    uid: string;
    name: string;
    url?: string;
    type?: string;
    file?: File;
    cloudinaryData?: CloudinaryUploadResponse;
}

export interface IProductColorProps {
    id: number;
    name: string;
    value: ProductBasicColor;
    hex: string;
    quantity: number;
    sale: number;
    images: IProductImageFile[];
}

export interface ICreateNewProductPayload {
    productName: string;
    brandName?: string;
    description: string;
    productType: ProductType;
    sportTypes: SportType[];
    productGender: ProductGender;
    productSizes: string[];
    productVisibility: ProductVisibility;
    originalPrice: number;
    salePrice?: number;
    productColors: IProductColorProps[];
    primaryImage: IProductImageFile;
    detailsDescriptionId: string | null;
    detailsDescription: string;
}

export interface IGetProductListInfo {
    products: IProductInfo[];
    totalCounts: number;
}

export interface IProductCountBySportType {
    value: SportType;
    productCount: number;
}

export enum IProductPriceRangeValue {
    LessThan500K = 1,
    From500KTo1M,
    From1MTo2M,
    From2MTo5M,
    MoreThan5M,
}
