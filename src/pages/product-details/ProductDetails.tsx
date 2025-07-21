/** @format */

import { Breadcrumbs, ProductBasicInfo, productColor, ProductPhotoView } from "@/components";
import React from "react";
import 'react-photo-view/dist/react-photo-view.css';

const ProductDetails: React.FunctionComponent = () => {
    return (
        <section className="w-full">
            <Breadcrumbs />
            <div className="w-full h-auto !px-[45px]">
                <div className="flex flex-wrap">
                    <div className="w-full !px-3 md:w-1/2 lg:w-3/8">
                        <ProductPhotoView photoList={productColor.concat(productColor).map(item => item.imgUrl!)} />
                    </div>

                    <div className="w-full !px-3 md:w-1/2 lg:w-3/8">
                        <ProductBasicInfo />
                    </div>

                    <div className="w-full !px-3 lg:w-1/4">
                        <div className="bg-red-100 p-4 h-full">Hỗ trợ & Khuyến mãi</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { ProductDetails };
