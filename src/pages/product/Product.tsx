/** @format */

import { Breadcrumbs, ProductFilter } from "@/components";
import { addBreadcrumb, breadcrumbState, useAppDispatch, useAppSelector } from "@/redux-store";
import React, { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { getAllProductBannerImages } from "./utils";
import { capitalizeFirstLetter } from "@/utils";

const Product: React.FC = () => {
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const { breadcrumbList } = useAppSelector(breadcrumbState);
    const category = searchParams.get("category");
    const location = useLocation();

    useEffect(() => {
        if (category) {
            const customizedTitle = capitalizeFirstLetter(category)
            dispatch(
                addBreadcrumb({
                    title: customizedTitle,
                    href: location.pathname + `?category=${customizedTitle}`,
                })
            );
        }
    }, []);


    return (
        <section className="w-full">
            <Breadcrumbs />
            <div className="w-full h-auto !px-11">
                <div 
                    className="w-full h-auto !mb-5" 
                    style={{ 
                        backgroundImage: `url(${getAllProductBannerImages(breadcrumbList[breadcrumbList.length - 1].title)})`, 
                        backgroundSize: "cover", 
                        backgroundPosition: "center",
                        aspectRatio: "auto 1900/300"
                    }} 
                />
                <div className="w-full flex">
                    <div className="w-1/4 !mr-4">
                        <ProductFilter />
                    </div>
                    <div className="flex-1 !ml-4">
                        Hello
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Product };
