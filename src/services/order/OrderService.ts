/** @format */

import instance from "@/config/axios/axios";
import { API_ROUTE } from "@/constants";
import { IQueryObject, IResponseAdvance, IResponseBase } from "@/types";
import { ICreateOrderPayload, IDashboardStats, IOrder, OrderStatus } from "@/types/orders";
import { createQueryString } from "@/utils";

class OrderService {
    public static createOrder(payload: ICreateOrderPayload): Promise<IResponseAdvance<IOrder>> {
        return instance.post(API_ROUTE.CREATE_ORDER, payload);
    }

    public static getUserOrder(): Promise<IResponseAdvance<IOrder[]>> {
        return instance.get(API_ROUTE.GET_USER_ORDERS);
    }

    public static cancelOrder(orderId: string): Promise<IResponseBase> {
        return instance.post(`/order/${orderId}${API_ROUTE.CANCEL_SINGLE_ORDER}`);
    }

    public static getAllOrders(queryObjects: IQueryObject): Promise<IResponseAdvance<{ orders: IOrder[]; totalCounts: number }>> {
        return instance.get(`${API_ROUTE.GET_ALL_ORDERS}${createQueryString(queryObjects)}`);
    }

    public static updateOrderStatus(orderList: string[], newStatus: OrderStatus): Promise<IResponseBase> {
        return instance.put(API_ROUTE.UPDATE_ORDER_STATUS, { orderCodes: orderList, newStatus });
    }

    public static getOrderDetail(orderId: string): Promise<IResponseAdvance<IOrder | null>> {
        return instance.get(`${API_ROUTE.GET_ORDER_DETAIL}/${orderId}`);
    }

    public static getDashboardStats(): Promise<IResponseAdvance<IDashboardStats>> {
        return instance.get(API_ROUTE.GET_DASHBOARD_STATS);
    }
}

export { OrderService };
