/** @format */

import { Breadcrumb } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface RouteItem {
    path: string;
    breadcrumbName: string;
    children?: RouteItem[];
}

const routes: RouteItem[] = [
    {
        path: "/",
        breadcrumbName: "Trang chủ",
        children: [
            {
                path: "products",
                breadcrumbName: "Sản phẩm",
                children: [
                    {
                        path: "detail",
                        breadcrumbName: "Chi tiết",
                    },
                ],
            },
            {
                path: "about",
                breadcrumbName: "Giới thiệu",
            },
            {
                path: "login",
                breadcrumbName: "Đăng nhập",
            },
        ],
    },
];

const generateBreadcrumb = (pathname: string, routes: RouteItem[]) => {
    const segments = pathname.split("/").filter(Boolean);
    const result: { path: string; breadcrumbName: string }[] = [];
    let currentPath = "";

    const findRoute = (segments: string[], routeList: RouteItem[]) => {
        for (const segment of segments) {
            const matchedRoute = routeList.find((r) => r.path === segment);
            if (matchedRoute) {
                currentPath += `/${matchedRoute.path}`;
                result.push({ path: currentPath, breadcrumbName: matchedRoute.breadcrumbName });
                if (matchedRoute.children) {
                    routeList = matchedRoute.children;
                }
            }
        }
    };

    findRoute(segments, routes);
    return result;
};
const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const breadcrumbItems = generateBreadcrumb(location.pathname, routes).map((item) => ({
        key: item.path,
        title: <Link to={item.path}>{item.breadcrumbName}</Link>,
    }));

    return <Breadcrumb items={[{ key: "/", title: <Link to="/">Trang chủ</Link> }, ...breadcrumbItems]} />;
};

export { Breadcrumbs};
