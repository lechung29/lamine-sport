/** @format */

import instance from "@/config/axios/axios";
import { API_ROUTE } from "@/constants";
import { ICreateProgramPayload, IDiscountProgram, IResponseAdvance, IResponseBase } from "@/types";

class DiscountService {
    public static createProgram(payload: ICreateProgramPayload): Promise<IResponseBase> {
        return instance.post(API_ROUTE.CREATE_PROGRAM, payload);
    }

    public static getCurrentProgram(): Promise<IResponseAdvance<IDiscountProgram | null>> {
        return instance.get(API_ROUTE.GET_CURRENT_PROGRAM);
    }

    public static updateProgram(id: string, payload: Partial<ICreateProgramPayload>): Promise<IResponseBase> {
        return instance.put(API_ROUTE.UPDATE_PROGRAM, { _id: id, ...payload });
    }

    public static cancelProgram(payload: Pick<IDiscountProgram, "_id" | "status">): Promise<IResponseBase> {
        return instance.put(API_ROUTE.CANCEL_PROGRAM, payload);
    }
}

export { DiscountService };
