/** @format */

import instance from "@/config/axios/axios";
import { API_ROUTE } from "@/constants";
import { ICouponData, ICreateCouponPayload, IQueryObject, IResponseAdvance, IResponseBase } from "@/types";
import { createQueryString } from "@/utils";
// import { createQueryString } from "@/utils";

class CouponService {
    public static createCoupon(payload: ICreateCouponPayload): Promise<IResponseBase> {
        return instance.post(API_ROUTE.CREATE_COUPON, payload);
    }

    public static getAllCoupon(queryObjects: IQueryObject): Promise<IResponseAdvance<{ coupons: ICouponData[]; totalCounts: number }>> {
        return instance.get(`${API_ROUTE.GET_ALL_COUPON}${createQueryString(queryObjects)}`);
    }

    public static updateCoupon(payload: ICreateCouponPayload): Promise<IResponseBase> {
        return instance.put(API_ROUTE.UPDATE_COUPON, payload);
    }

    public static deleteCoupon(couponCode: string): Promise<IResponseBase> {
        return instance.delete(`${API_ROUTE.DELETE_COUPON}/${couponCode}`);
    }

    public static validateCoupon(couponCode: string, userId?: string): Promise<IResponseAdvance<ICouponData>> {
        return instance.post(API_ROUTE.VALIDATE_COUPON, { couponCode, userId });
    }
}

export { CouponService };
