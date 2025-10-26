/** @format */

import { IUserInformation } from "../users";

export interface ISubmitReviewPayload {
    userId?: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    rating: number;
    comment: string;
}

export interface IReview {
    _id: string;
    userId?: string;
    userInfo?: IUserInformation;
    guestInfo?: {
        displayName: string;
        email: string;
        phoneNumber: string;
    };
    rating: number;
    comment: string;
    userType: "user" | "guest";
    isPin: boolean;
    createdAt: string;
    updatedAt: string;
}
