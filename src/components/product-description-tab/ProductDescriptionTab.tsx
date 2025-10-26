/** @format */

import React from "react";
import { Tabs } from "antd";
import "./ProductDescriptionTab.scss";
import { Box, Image, Text } from "../elements";

interface IProductDescriptionProps {
    content: string;
}
const ProductDescriptionTab: React.FunctionComponent<IProductDescriptionProps> = (props) => {
    const { content } = props;
    const tabItem = React.useMemo(() => {
        return [
            {
                key: "productDescription",
                label: <Text as="span" className="tab-nab-label" titleText="Mô tả sản phẩm" />,
                children: <Box className="tab-content" dangerouslySetInnerHTML={{ __html: content }} />,
                icon: (
                    <Image
                        width={28}
                        height={28}
                        src="https://img.icons8.com/external-outline-wichaiwi/64/external-description-business-outline-wichaiwi.png"
                        alt="external-description-business-outline-wichaiwi"
                    />
                ),
            },
        ];
    }, []);
    return (
        <Box className="w-full">
            <Tabs defaultActiveKey="2" className="product-description-tab-wrap" items={tabItem} />
        </Box>
    );
};

export { ProductDescriptionTab };
