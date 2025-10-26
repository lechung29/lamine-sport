/** @format */

import instance from "@/config/axios/axios";
import { API_ROUTE } from "@/constants";
import { IQueryObject, IResponseAdvance, IResponseBase, ITemplateData } from "@/types";
import { createQueryString } from "@/utils";

class TemplateService {
    public static createTemplate(name: string, content: string): Promise<IResponseBase> {
        return instance.post(API_ROUTE.CREATE_TEMPLATE, { templateName: name, templateContent: content });
    }

    public static getAllTemplates(queryObjects: IQueryObject = {}): Promise<IResponseAdvance<{ templates: ITemplateData[]; totalCounts: number }>> {
        return instance.get(`${API_ROUTE.GET_ALL_TEMPLATE}${createQueryString(queryObjects)}`);
    }

    public static updateTemplate(id: string, name: string, content: string): Promise<IResponseBase> {
        return instance.put(`${API_ROUTE.UPDATE_TEMPLATE}/${id}`, { templateName: name, templateContent: content });
    }

    public static deleteTemplate(id: string): Promise<IResponseBase> {
        return instance.delete(`${API_ROUTE.DELETE_TEMPLATE}/${id}`);
    }
}

export { TemplateService };
