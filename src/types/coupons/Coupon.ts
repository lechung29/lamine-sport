/** @format */

export enum CouponValueType {
    FixedAmount = 1,
    Percent,
}

export enum CouponStatus {
    Active = 1,
    Expired,
    Schedule,
    OutOfUsed,
}

export interface ICouponData {
    id: string;
    couponCode: string;
    valueType: CouponValueType;
    value: number;
    maxValue?: number;
    couponStatus: CouponStatus;
    startDate: Date;
    endDate: Date;
    couponQuantity: number;
    usedQuantity: number;
}

export interface ICreateCouponPayload {
    couponCode: string;
    discountType: CouponValueType;
    discountValue: number;
    maxValue: number | null;
    startDate: Date;
    endDate: Date;
    couponQuantity: number;
}
