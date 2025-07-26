/** @format */

import { Breadcrumbs, ProductBasicInfo, productColor, ProductPhotoView, ProductFeatures, RelatedProductList, ProductDescriptionTab } from "@/components";
import React from "react";
import "react-photo-view/dist/react-photo-view.css";

const features = [
    { icon: <img width="40" height="40" src="https://img.icons8.com/dotty/80/security-checked.png" alt="security-checked" />, text: "Cam kết chính hãng 100%" },
    { icon: <img width="40" height="40" src="https://img.icons8.com/dotty/80/verified-account.png" alt="verified-account" />, text: "Bảo hành 12 tháng" },
    { icon: <img width="40" height="40" src="https://img.icons8.com/dotty/80/exchange-dollar.png" alt="exchange-dollar" />, text: "Đổi trả hàng trong 7 ngày" },
    { icon: <img width="40" height="40" src="https://img.icons8.com/dotty/80/free-shipping.png" alt="free-shipping" />, text: "Giao hàng nhanh toàn quốc" },
];

const ProductDetails: React.FunctionComponent = () => {
    return (
        <section className="w-full">
            <Breadcrumbs />
            <div className="w-full h-auto !px-[45px]">
                <div className="flex flex-wrap !mb-10">
                    <div className="w-full md:!pr-4 md:w-1/2 lg:w-3/8">
                        <ProductPhotoView photoList={productColor.concat(productColor).map((item) => item.imgUrl!)} />
                    </div>

                    <div className="w-full lg:!px-4 md:!pl-4 md:w-1/2 lg:w-3/8">
                        <ProductBasicInfo />
                    </div>

                    <div className="w-full lg:!pl-4 lg:w-1/4">
                        <div className="flex flex-col">
                            <ProductFeatures items={features} />
                        </div>
                    </div>
                </div>
                <RelatedProductList />
                <ProductDescriptionTab />
            </div>
        </section>
    );
};

export { ProductDetails };
