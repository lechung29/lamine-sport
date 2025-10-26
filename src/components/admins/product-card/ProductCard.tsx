/** @format */

import { IProductInfo } from "@/types";
import { Button, Card, Dropdown, Flex, Progress } from "antd";
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getProductType } from "@/pages/admin/products/utils/common";
import { classNames, formatCurrency } from "@/utils";
import { TooltipLabel } from "@/components/tooltip-label";
import { Box, Image, Text } from "@/components/elements";

interface IProductCardProps {
    product: IProductInfo;
    onDelete: (id: string) => Promise<void> | void;
    onUpdate: (id: string) => void;
}

const ProductCard: React.FunctionComponent<IProductCardProps> = (props) => {
    const { product, onUpdate, onDelete } = props;
    const { saleQuantity, stockQuantity } = product;

    const productMenu = {
        items: [
            {
                key: "edit",
                label: "Chỉnh sửa",
                icon: <EditOutlined className="!text-blue-500" />,
                onClick: () => onUpdate(product._id),
                className: "ant-dropdown-menu-item bg-transparent",
            },
            {
                key: "delete",
                label: "Xóa",
                icon: <DeleteOutlined className="!text-red-500" />,
                onClick: () => onDelete(product._id),
                className: "ant-dropdown-menu-item bg-transparent",
            },
        ],
    };
    const remainingPercent = (stockQuantity / (stockQuantity + saleQuantity)) * 100;

    return (
        <Card className="bg-white !rounded-lg !shadow-sm !border !border-gray-200" styles={{ body: { display: "flex", flexDirection: "column", height: "100%", padding: "16px" } }}>
            <Flex align="start" justify="space-between" className="!mb-3">
                <Flex align="center" className="!space-x-3">
                    <Image width={48} height={48} objectFit="cover" src={product.primaryImage.url} alt={product.productName} className="!rounded" />
                    <Box>
                        <TooltipLabel width="full" className="text-sm font-medium text-gray-800 !mb-1" text={product.productName} />
                        <Text size="xs" className="text-gray-500" titleText={getProductType(product.productType)} />
                    </Box>
                </Flex>
                <Dropdown menu={productMenu} trigger={["click"]} placement="bottomRight">
                    <Button type="text" icon={<MoreOutlined />} className="!text-gray-600" />
                </Dropdown>
            </Flex>

            <Box className="flex justify-end gap-1.5" margin={[0, 0, 12, 0]}>
                {product.salePrice && (
                    <Text as="span" size="sm" fontWeight="bold" className="text-red-700">
                        {formatCurrency(product.salePrice)}
                    </Text>
                )}
                <Text as="span" size="sm" fontWeight="bold" className={classNames("text-gray-600", { "line-through": product.salePrice })}>
                    {formatCurrency(product.originalPrice)}
                </Text>
            </Box>

            <Box className="!flex-1" margin={[0, 0, 12, 0]}>
                <Text size="sm" fontWeight="medium" className="!text-gray-700" titleText="Mô tả" margin={[0, 0, 4, 0]} />
                <TooltipLabel className="text-xs text-gray-500 leading-relaxed" lineDisplayed={2} text={product.description} />
            </Box>

            <Box className="!space-y-3">
                <Flex align="center" justify="space-between">
                    <Text as="span" size="xs" className="text-gray-600" titleText="Đã bán" />
                    <Flex align="center" className="!space-x-2">
                        <svg className="w-3 h-3 !text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <Text as="span" size="xs" fontWeight="medium" className="text-gray-900" titleText={product.saleQuantity.toString()} />
                    </Flex>
                </Flex>
                <Flex align="center" justify="space-between" className="!mb-1">
                    <Text as="span" size="xs" className="text-gray-600" titleText="Còn lại" />
                    <Text as="span" size="xs" fontWeight="medium" className="text-gray-900" titleText={product.stockQuantity.toString()} />
                </Flex>
                <Progress percent={remainingPercent} size="small" strokeColor="#f59e0b" showInfo={false} className="!h-2" />
            </Box>
        </Card>
    );
};

export { ProductCard };
