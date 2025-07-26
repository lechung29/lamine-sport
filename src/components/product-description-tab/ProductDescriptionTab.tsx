/** @format */

import React from "react";
import { Tabs } from "antd";
import "./ProductDescriptionTab.scss";

const ProductDescriptionTab: React.FunctionComponent = () => {
    const tabItem = React.useMemo(() => {
        return [
            {
                key: "productDescription",
                label: <span className="tab-nab-label">Mô tả sản phẩm</span>,
                children: <div>{`Hello`}</div>,
                icon: (
                    <img
                        width="28"
                        height="28"
                        src="https://img.icons8.com/external-outline-wichaiwi/64/external-description-business-outline-wichaiwi.png"
                        alt="external-description-business-outline-wichaiwi"
                    />
                ),
            },
            {
                key: "refundPolicy",
                label: <span className="tab-nab-label">Chính sách dổi trả</span>,
                children: <div>{`Hello`}</div>,
                icon: <img width="28" height="28" src="https://img.icons8.com/dotty/80/exchange-dollar.png" alt="exchange-dollar" />,
            },
        ];
    }, []);
    return (
        <div className="w-full">
            <Tabs defaultActiveKey="2" className="product-description-tab-wrap" items={tabItem} />
        </div>
    );
};

export { ProductDescriptionTab };
