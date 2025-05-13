/** @format */

import { API_BASE_URL } from "@/constants";
import { AuthService } from "@/services";
import { IResponseStatus } from "@/types";
import axios from "axios";

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Process data before sending to server
instance.interceptors.request.use(
    async (config) => {
        if (config.url!.indexOf("/login") >= 0 || config.url!.indexOf("/refresh-token") >= 0) {
            return config;
        }
        const token = window.localStorage.getItem("accessToken");
        config.headers["X-Token"] = token;
        return config;
    },
    (err) => {
        return Promise.resolve(err.request.data);
    }
);

instance.interceptors.response.use(
    async (response) => {
        const axiosConfig = response.config;
        if (axiosConfig.url!.indexOf("/login") >= 0 || axiosConfig.url!.indexOf("/google") >= 0 || axiosConfig.url!.indexOf("/refresh-token") >= 0) {
            return response.data;
        }
        const { code, message } = response.data;
        if (code === 401) {
            if (message && message === "Error.Token.Expired") {
                const data = await AuthService.refreshToken();
                if (data.accessToken) {
                    axiosConfig.headers["X-Token"] = data.accessToken;
                    window.localStorage.setItem("accessToken", data.accessToken);
                    return instance(axiosConfig);
                } else {
                    // store.dispatch(handleUnauthorized(data.message))
                    console.log(data.message);
                }
            }
        }

        if (code === 403 || code === 500) {
            // if (message && message === "Error.Account.Locked.Expired") {
            //     console.log(message)
            // }
            console.log(message);
        }
        return response.data;
    },
    (err) => {
        const errorMessage = "Unable to connect to the server. This may be due to a network interruption or the server is temporarily unavailable. Please check your internet connection or refresh the page after a few minutes."
        if (axios.isAxiosError(err) && err.code === "ECONNABORTED") {
            return Promise.resolve({
                status: IResponseStatus.Error,
                message: errorMessage
            });
        }
        if (err?.response?.data) {
            return Promise.resolve(err.response.data);
        }
        return Promise.resolve({
            status: IResponseStatus.Error,
            message: err.message === "Network Error" ? errorMessage : err.message
        })
    }
);

export default instance;
