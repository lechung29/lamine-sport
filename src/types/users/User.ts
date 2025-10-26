/** @format */

export enum ICustomerStatus {
    Active = 1,
    Locked,
}

export interface IRegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export type ILoginPayload = Pick<IRegisterPayload, "email" | "password">;

export interface IUserInformation {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
    avatar: string;
    address?: string;
    role: "admin" | "user";
    status: ICustomerStatus;
}

export interface IUserAdvanceInfo {
    totalOrders: number,
    totalProducts: number,
    totalSpent: number
}

export interface IGetCustomerListInfo {
    customers: (IUserInformation & IUserAdvanceInfo)[];
    totalCounts: number;
}

