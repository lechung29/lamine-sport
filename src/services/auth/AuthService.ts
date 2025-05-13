/** @format */

import instance from "@/config/axios/axios";
import { API_ROUTE } from "@/constants";
import { ILoginPayload, IRegisterPayload } from "@/models";
import { IResponseAdvance, IResponseBase } from "@/types";

class AuthService {
    public static registerUser(payload: IRegisterPayload): Promise<IResponseBase> {
        return instance.post(API_ROUTE.SIGNUP, payload);
    }

    public static loginUser(payload: ILoginPayload): Promise<IResponseAdvance<any>> {
        return instance.post(API_ROUTE.LOGIN, payload);
    }

    public static refreshToken(): Promise<any> {
        return instance.get(API_ROUTE.REFRESH_TOKEN);
    }
}

export { AuthService };
