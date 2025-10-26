/** @format */

import { API_BASE_URL, API_ROUTE } from "@/constants";
import { store } from "@/redux-store";
import { handleUnauthorized } from "@/redux-store/reducers/auth";
import { IResponseStatus } from "@/types";
import { AccountLockedError, UnauthorizedError } from "@/utils";
import axios, { InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

instance.interceptors.request.use(
    (config) => {
        const publicEndpoints = ["/login", "/register", "/google", "/forgot-password", "/refresh-token"];
        const isPublicEndpoint = publicEndpoints.some((endpoint) => config.url?.includes(endpoint));

        if (!isPublicEndpoint) {
            const token = localStorage.getItem("accessToken");
            if (token && config.headers) {
                config.headers["x-token"] = token;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    async (response) => {
        if (response.data?.code === 403) {
            const accountLockedMessage = "Tài khoản của bạn đã bị khóa, vui lòng liên hệ bộ phận chăm sóc khách hàng để hỗ trợ";

            if (response.data.message === accountLockedMessage) {
                localStorage.removeItem("accessToken");
                store.dispatch(handleUnauthorized(accountLockedMessage));
                throw new AccountLockedError(accountLockedMessage);
            }

            return response.data;
        }

        // Kiểm tra code 401
        if (response.data?.code === 401) {
            const originalRequest = response.config as CustomAxiosRequestConfig;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["x-token"] = token;
                        return instance(originalRequest);
                    })
                    .then((res) => res)
                    .catch((err) => Promise.reject(err));
            }

            if (originalRequest._retry) {
                localStorage.removeItem("accessToken");
                const currentAuthState = store.getState().auth;
                if (!currentAuthState.isOpenDialog) {
                    store.dispatch(handleUnauthorized("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại"));
                }
                throw new UnauthorizedError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshResponse: any = await instance.get(API_ROUTE.REFRESH_TOKEN);
                const { accessToken } = refreshResponse;
                if (accessToken) {
                    localStorage.setItem("accessToken", accessToken);
                    instance.defaults.headers.common["x-token"] = accessToken;
                    originalRequest.headers["x-token"] = accessToken;

                    processQueue(null, accessToken);

                    const retryResponse = await instance(originalRequest);
                    return retryResponse;
                } else {
                    throw new UnauthorizedError("Không thể làm mới phiên đăng nhập");
                }
            } catch (refreshError: any) {
                processQueue(refreshError, null);
                localStorage.removeItem("accessToken");

                if (!(refreshError instanceof AccountLockedError)) {
                    const currentAuthState = store.getState().auth;
                    if (!currentAuthState.isOpenDialog) {
                        store.dispatch(handleUnauthorized("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại"));
                    }
                }
                throw refreshError;
            } finally {
                isRefreshing = false;
            }
        }

        return response.data;
    },
    async (error) => {
        // Xử lý network error
        if (axios.isAxiosError(error)) {
            if (error.code === "ECONNABORTED" || error.message === "Network Error") {
                const errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.";
                return Promise.resolve({
                    status: IResponseStatus.Error,
                    message: errorMessage,
                });
            }
        }

        if (error?.response?.data) {
            return Promise.resolve(error.response.data);
        }

        return Promise.resolve({
            status: IResponseStatus.Error,
            message: error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau",
        });
    }
);

export default instance;
