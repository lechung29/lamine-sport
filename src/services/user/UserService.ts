/** @format */

import instance from "@/config/axios/axios";
import { API_ROUTE } from "@/constants";
import { ICustomerStatus, IGetCustomerListInfo, IQueryObject, IResponseAdvance, IResponseBase } from "@/types";
import { createQueryString } from "@/utils";

class UserService {
    public static getAllCustomers(queryObjects: IQueryObject): Promise<IResponseAdvance<IGetCustomerListInfo>> {
        return instance.get(`${API_ROUTE.GET_ALL_CUSTOMERS}${createQueryString(queryObjects)}`);
    }

    public static updateCustomerStatus(id: string, status: ICustomerStatus): Promise<IResponseBase> {
        return instance.put(API_ROUTE.UPDATE_CUSTOMER_STATUS, { id, status });
    }

    public static deleteCustomer(id: string): Promise<IResponseBase> {
        return instance.delete(`${API_ROUTE.DELETE_CUSTOMER}/${id}`);
    }

    public static adminUpdateInfo(displayName: string, email: string): Promise<IResponseBase> {
        return instance.post(API_ROUTE.ADMIN_UPDATE_INFO, { displayName, email });
    }

    public static adminUpdatePassword(password: string, newPassword: string): Promise<IResponseBase> {
        return instance.post(API_ROUTE.ADMIN_UPDATE_PASSWORD, { password, newPassword });
    }

    public static userUpdateInfo(payload: { displayName: string; email: string; phoneNumber: string; address?: string; avatarUrl: string }): Promise<IResponseBase> {
        return instance.post(API_ROUTE.USER_UPDATE_INFO, payload);
    }

    public static userUpdatePassword(password: string, newPassword: string): Promise<IResponseBase> {
        return instance.post(API_ROUTE.USER_UPDATE_PASSWORD, { password, newPassword });
    }

    public static userCreatePassword(newPassword: string): Promise<IResponseBase> {
        return instance.post(API_ROUTE.USER_CREATE_PASSWORD, { newPassword });
    }
}

export { UserService };
