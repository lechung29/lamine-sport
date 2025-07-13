/** @format */

import { Breadcrumbs } from "@/components";
import { addBreadcrumb, useAppDispatch } from "@/redux-store";
import React, { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

const Product: React.FC = () => {
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");
    const location = useLocation();

    useEffect(() => {
        if (category) {
            dispatch(
                addBreadcrumb({
                    title: category,
                    href: location.pathname + `?category=${category}`,
                })
            );
        }
    }, []);

    return (
        <section className="w-full">
            <Breadcrumbs />
        </section>
    );
};

export { Product };
