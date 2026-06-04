/** @format */

import { IProductInfo, ProductBasicColor } from "../products";
import { IUserInformation } from "../users";

export enum OrderStatus {
    WaitingConfirm = 1,
    Processing,
    Delivered,
    Cancel,
}

export enum IOrderPayment {
    COD = 1,
    Transfer,
}

export enum PaymentStatus {
    Pending = 1,
    Paid,
    Failed,
    Cancelled,
    PendingPayment,
}

export interface IOrderItem {
    product: IProductInfo;
    selectedColor: ProductBasicColor;
    selectedSize?: string;
    quantity: number;
    unitPrice: number;
}

export interface IOrder {
    _id: string;
    userId: string;
    userInfo?: IUserInformation;
    orderCode: string;
    orderItems: IOrderItem[];
    totalPrice: number;
    shippingInfo: {
        receiver: string;
        emailReceived: string;
        phoneNumberReceived: string;
        address: string;
        note?: string;
    };
    paymentMethod: IOrderPayment;
    paymentStatus: PaymentStatus;
    transactionRef?: string;
    paidAt?: string;
    orderStatus: OrderStatus;
    shippingFees: number;
    productsFees: number;
    discountValue?: number;
    couponCode?: string;
    createdAt: string;
}

export interface IOrderDetail extends IOrder {
    qrUrl?: string;
    transferContent?: string;
    bankInfo?: IBankInfo;
}

export interface ICreateOrderPayload {
    orderItems: IOrderItem[];
    shippingInfo: {
        receiver: string;
        emailReceived: string;
        phoneNumberReceived: string;
        address: string;
        note?: string;
    };
    paymentMethod: IOrderPayment;
    shippingFees: number;
    productsFees: number;
    discountValue?: number;
    totalPrice: number;
    couponCode?: string;
}

export interface IBankInfo {
    bankCode: string;
    accountNumber: string;
    accountName: string;
}

export interface ICreateOrderResponse {
    order: IOrder;
    qrUrl?: string;
    orderCode?: string;
    transferContent?: string;
    bankInfo?: IBankInfo;
}

export interface ICheckPaymentStatusResponse {
    orderCode: string;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    paidAt?: string;
}

export interface IDashboardStats {
    monthlyOrders: {
        total: number;
        percentageChange: number;
    };
    salesPerformance: {
        totalRevenue: number;
        percentageChange: number;
    };
    todayRevenue: number;
    monthlyNewUsers: {
        total: number;
        percentageChange: number;
    };
    pendingOrders: {
        waitingConfirm: number;
        processing: number;
        total: number;
    };
    productTypeRevenueByYear: {
        year: number;
        data: {
            productType: string;
            revenue: number;
        }[];
    }[];
    topSellingProducts: {
        productId: string;
        productName: string;
        totalQuantitySold: number;
        totalRevenue: number;
        percentage: number;
    }[];
}
