/** @format */

import instance from "@/config/axios/axios";
import { API_ROUTE } from "@/constants";
import { IQueryObject, IResponseAdvance, IResponseBase, IReview, ISubmitReviewPayload } from "@/types";
import { createQueryString } from "@/utils";

class ReviewService {
    public static submitReview(payload: ISubmitReviewPayload): Promise<IResponseBase> {
        return instance.post(API_ROUTE.CREATE_REVIEW, payload);
    }

    public static getAllReviews(queryObjects: IQueryObject): Promise<IResponseAdvance<{ reviews: IReview[]; totalCounts: number }>> {
        return instance.get(`${API_ROUTE.GET_ALL_REVIEWS}${createQueryString(queryObjects)}`);
    }

    public static deleteReview(reviewId: string): Promise<IResponseBase> {
        return instance.delete(`${API_ROUTE.DELETE_REVIEW}/${reviewId}`);
    }

    public static pinReview(reviewId: string, isPin: boolean): Promise<IResponseBase> {
        return instance.post(`${API_ROUTE.PIN_REVIEW}/${reviewId}`, { isPin });
    }

    public static getPinReviews(): Promise<IResponseAdvance<IReview[]>> {
        return instance.get(API_ROUTE.GET_PIN_REVIEW);
    }

    public static sendEmailToCustomer(reviewId: string, message: string): Promise<IResponseBase> {
        return instance.post(API_ROUTE.SEND_EMAIL_FOR_REVIEWER, { reviewId, message });
    }
}

export { ReviewService };
