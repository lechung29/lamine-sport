/** @format */

import instance from "@/config/axios/axios";
import { API_ROUTE } from "@/constants";
import { ILoginPayload, IRegisterPayload, IResponseAdvance, IResponseBase, IUserInformation } from "@/types";

class AuthService {
    public static registerCustomer(payload: IRegisterPayload): Promise<IResponseBase> {
        return instance.post(API_ROUTE.SIGNUP, { ...payload, isAdmin: true });
    }

    public static loginCustomer(payload: ILoginPayload): Promise<IResponseAdvance<IUserInformation & { accessToken: string }>> {
        return instance.post(API_ROUTE.LOGIN, payload);
    }

    public static loginWithGoogle(payload: {
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
    }): Promise<IResponseAdvance<IUserInformation & { isFirstLogin: boolean; accessToken: string }>> {
        return instance.post(API_ROUTE.GOOGLE, payload);
    }

    public static forgotPasswordCustomer(email: string): Promise<IResponseBase> {
        return instance.post(API_ROUTE.FORGOT_PASSWORD, { email });
    }

    public static verifyRecoveryPasswordToken(email: string, token: string): Promise<IResponseBase> {
        return instance.get(`${API_ROUTE.VERIFY_RP_TOKEN}?token=${token}&email=${email}`);
    }

    public static resetPasswordByRPToken(email: string, password: string): Promise<IResponseBase> {
        return instance.put(API_ROUTE.RESET_PASSWORD_BY_RP_TOKEN, { email, password });
    }

    public static refreshToken(): Promise<any> {
        return instance.get(API_ROUTE.REFRESH_TOKEN);
    }

    public static logoutCustomer(): Promise<IResponseBase> {
        return instance.post(API_ROUTE.LOGOUT);
    }
}

export { AuthService };
