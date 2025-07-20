/** @format */

import { Breadcrumbs, Pagination, ProductFilter, ProductItem, ProductSort } from "@/components";
import { addBreadcrumb, breadcrumbState, useAppDispatch, useAppSelector } from "@/redux-store";
import React, { useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { getAllProductBannerImages } from "./utils";
import { capitalizeFirstLetter } from "@/utils";

const Product: React.FC = () => {
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const { breadcrumbList } = useAppSelector(breadcrumbState);
    const category = searchParams.get("category");
    const location = useLocation();
    // const navigate = useNavigate();
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (category) {
            const customizedTitle = capitalizeFirstLetter(category);
            dispatch(
                addBreadcrumb([{
                    title: customizedTitle,
                    href: location.pathname + `?category=${customizedTitle}`,
                }])
            );
        }
        // navigate("/product", { replace: true });
    }, []);

    return (
        <section className="w-full">
            <Breadcrumbs />
            <div className="w-full h-auto !px-[45px]">
                <div
                    className="w-full h-auto !mb-5"
                    style={{
                        backgroundImage: `url(${getAllProductBannerImages(breadcrumbList[breadcrumbList.length - 1].title)})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        aspectRatio: "auto 1900/300",
                    }}
                    ref={ref}
                />
                <div className="w-full flex">
                    <div className="w-4/17 !mr-4">
                        <ProductFilter />
                    </div>
                    <div className="flex-1 !ml-4">
                        <div className="w-full !mb-4 flex items-center justify-end">
                            <ProductSort />
                        </div>
                        <div className="w-full !mb-8 flex flex-wrap gap-4">
                            {Array.from({length: 12}).map(() => (
                                <ProductItem />
                            ))}
                        </div>
                        <div className="flex items-center justify-center" onMouseDown={(e) => e.preventDefault()}>
                            <Pagination 
                                currentPage={currentPage}
                                totalItems={100}
                                onChangePage={(newPage) => {
                                    setCurrentPage(newPage);
                                    ref.current?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Product };
