/** @format */

import { Breadcrumb } from "antd";
import React from "react";
import { breadcrumbState, IBreadcrumbItem, useAppSelector } from "@/redux-store";
import "./Breadcrumb.scss";
import { Box } from "../elements";

const Breadcrumbs: React.FunctionComponent = () => {
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
        <Box className="!px-4 sm:!px-8 lg:!px-[45px] !mb-5 h-11 bg-[#f8f8f8]">
            <Breadcrumb 
                className="h-full flex items-center" 
                separator=">" 
                items={getCustomizedBreadcrumbList() as any} 
            />
        </Box>
    );
};

export { Breadcrumbs };
