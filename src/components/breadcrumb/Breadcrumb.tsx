/** @format */

import { Breadcrumb } from "antd";
import React from "react";
import { breadcrumbState, IBreadcrumbItem, useAppSelector } from "@/redux-store";
import "./Breadcrumb.scss";

const Breadcrumbs: React.FC = () => {
    const { breadcrumbList } = useAppSelector(breadcrumbState);
    const getCustomizedBreadcrumbList = () => {
        const customizedBreadcrumbList: IBreadcrumbItem[] = [];
        breadcrumbList.forEach((item, id) => {
            if (id === breadcrumbList.length - 1) {
                customizedBreadcrumbList.push({
                    title: item.title,
                })
            } else {
                customizedBreadcrumbList.push(item);
            }
        })
        return customizedBreadcrumbList;
    } 
    return (
        <div className="!px-11 !mb-5 h-11 bg-[#f8f8f8]">
            <Breadcrumb 
                className="h-full flex items-center" 
                separator=">" 
                items={getCustomizedBreadcrumbList() as any} 
            />
        </div>
    );
};

export { Breadcrumbs };
