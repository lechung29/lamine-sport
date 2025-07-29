/** @format */

import React, { useState } from "react";
import { Button, Dropdown, Menu, Card, Space, Pagination, Progress } from "antd"; // Import Progress
import {
    PlusOutlined,
    MoreOutlined, // Ensure MoreOutlined is imported
    EditOutlined, // Import EditOutlined
    DeleteOutlined, // Import DeleteOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// ==========================================================
// MOCK DATA (Giữ nguyên mock data cho sản phẩm và danh mục)
// ==========================================================
const mockCategories = [
    { name: "Sneakers", count: 21 },
    { name: "Runners", count: 32 },
    { name: "Golf", count: 13 },
    { name: "Hiking", count: 14 },
    { name: "Football", count: 6 },
    { name: "Baseball", count: 11 },
];

const mockProducts = [
    {
        id: 1,
        name: "Adidas Ultra boost",
        category: "Sneaker",
        price: "110.40",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop",
        summary: "Long distance running requires a lot from athletes.",
        sales: 1269,
        remaining: 1269,
        remainingPercent: 85,
    },
    {
        id: 2,
        name: "Adidas Ultra boost",
        category: "Sneaker",
        price: "100.40",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=60&h=60&fit=crop",
        summary: "Long distance running requires a lot from athletes.",
        sales: 1269,
        remaining: 1269,
        remainingPercent: 75,
    },
    {
        id: 3,
        name: "Adidas Ultra boost",
        category: "Sneaker",
        price: "800.40",
        image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=60&h=60&fit=crop",
        summary: "Long distance running requires a lot from athletes.",
        sales: 1269,
        remaining: 1269,
        remainingPercent: 90,
    },
    {
        id: 4,
        name: "ADIZERO SL RUNNING",
        category: "Running",
        price: "64.40",
        image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=60&h=60&fit=crop",
        summary: "Long distance running requires a lot from athletes.",
        sales: 1269,
        remaining: 1269,
        remainingPercent: 85,
    },
    {
        id: 5,
        name: "ULTRABOOST CLEATS",
        category: "Sneaker",
        price: "800.40",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=60&h=60&fit=crop",
        summary: "Long distance running requires a lot from athletes.",
        sales: 1269,
        remaining: 1269,
        remainingPercent: 70,
    },
    {
        id: 6,
        name: "FORUM EXHIBIT LOW",
        category: "Sneaker",
        price: "74.00",
        image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=60&h=60&fit=crop",
        summary: "Long distance running requires a lot from athletes.",
        sales: 109,
        remaining: 1500,
        remainingPercent: 25,
    },
    {
        id: 7,
        name: "Adidas Ultra boost",
        category: "Sneaker",
        price: "110.40",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop",
        summary: "Long distance running requires a lot from athletes.",
        sales: 1269,
        remaining: 1269,
        remainingPercent: 85,
    },
    {
        id: 8,
        name: "Adidas Ultra boost",
        category: "Sneaker",
        price: "100.40",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=60&h=60&fit=crop",
        summary: "Long distance running requires a lot from athletes.",
        sales: 1269,
        remaining: 1269,
        remainingPercent: 75,
    },
    {
        id: 9,
        name: "Adidas Ultra boost",
        category: "Sneaker",
        price: "800.40",
        image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=60&h=60&fit=crop",
        summary: "Long distance running requires a lot from athletes.",
        sales: 1269,
        remaining: 1269,
        remainingPercent: 90,
    },
    {
        id: 10,
        name: "ADIZERO SL RUNNING",
        category: "Running",
        price: "64.40",
        image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=60&h=60&fit=crop",
        summary: "Long distance running requires a lot from athletes.",
        sales: 1269,
        remaining: 1269,
        remainingPercent: 85,
    },
    {
        id: 11,
        name: "ULTRABOOST CLEATS",
        category: "Sneaker",
        price: "800.40",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=60&h=60&fit=crop",
        summary: "Long distance running requires a lot from athletes.",
        sales: 1269,
        remaining: 1269,
        remainingPercent: 70,
    },
    {
        id: 12,
        name: "FORUM EXHIBIT LOW",
        category: "Sneaker",
        price: "74.00",
        image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=60&h=60&fit=crop",
        summary: "Long distance running requires a lot from athletes.",
        sales: 109,
        remaining: 1500,
        remainingPercent: 25,
    },
];

// Breadcrumb Component
const Breadcrumb = () => {
    return (
        <nav className="!text-sm !text-gray-600">
            <span>Home</span>
            <span className="!mx-2">-</span>
            <span className="!text-gray-900">All Products</span>
        </nav>
    );
};

// Product Card Component
const ProductCard = ({ product }) => {
    const productMenu = (
        <Menu>
            <Menu.Item key="edit" icon={<EditOutlined className="!text-blue-500" />}>
                Chỉnh sửa
            </Menu.Item>{" "}
            {/* Added EditOutlined icon with blue color */}
            <Menu.Item key="delete" icon={<DeleteOutlined className="!text-red-500" />}>
                Xóa
            </Menu.Item>{" "}
            {/* Added DeleteOutlined icon with red color */}
        </Menu>
    );

    return (
        <Card className="!bg-white !rounded-lg !shadow-sm !border !border-gray-200" bodyStyle={{ padding: "16px" }}>
            <div className="!flex !items-start !justify-between !mb-3">
                <div className="!flex !items-center !space-x-3">
                    <img src={product.image} alt={product.name} className="!w-12 !h-12 !rounded !object-cover" />
                    <div>
                        <h4 className="!text-sm !font-medium !text-gray-900 !mb-1">{product.name}</h4>
                        <span className="!text-xs !text-gray-500">{product.category}</span>
                    </div>
                </div>
                <Dropdown overlay={productMenu} trigger={["click"]} placement="bottomRight">
                    <Button type="text" icon={<MoreOutlined />} className="!text-gray-400" />
                </Dropdown>
            </div>

            <div className="!mb-3">
                <span className="!text-lg !font-bold !text-gray-900">${product.price}</span>
            </div>

            <div className="!mb-4">
                <h5 className="!text-xs !font-medium !text-gray-700 !mb-2">Summary</h5>
                <p className="!text-xs !text-gray-500 !leading-relaxed">{product.summary}</p>
            </div>

            <div className="!space-y-3">
                <div className="!flex !items-center !justify-between">
                    <span className="!text-xs !text-gray-600">Sales</span>
                    <div className="!flex !items-center !space-x-2">
                        <svg className="!w-3 !h-3 !text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="!text-xs !font-medium !text-gray-900">{product.sales}</span>
                    </div>
                </div>

                <div>
                    <div className="!flex !items-center !justify-between !mb-1">
                        <span className="!text-xs !text-gray-600">Remaining Products</span>
                        <span className="!text-xs !font-medium !text-gray-900">{product.remaining}</span>
                    </div>
                    <Progress percent={product.remainingPercent} size="small" strokeColor="#f59e0b" showInfo={false} className="!h-2" />
                </div>
            </div>
        </Card>
    );
};

// Main All Products Component
const AdminAllProducts = () => {
    // Using the mockProducts array directly as the source of data
    const products = mockProducts; // Use the mockProducts from the top of the file

    const navigate = useNavigate();

    return (
        // This div is the content that will be placed inside your AdminLayout's outlet
        <div>
            <div className="!flex min-[400px]:!items-center !justify-between min-[400px]:flex-row flex-col gap-4 !mb-6">
                <div>
                    <h1 className="!text-2xl !font-bold !text-gray-900 !mb-2">All Products</h1>
                    <Breadcrumb />
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/admin/products/add-product")}
                    className="!bg-gray-800 !border-gray-800 hover:!bg-gray-900 !px-6 !py-2 !h-auto !rounded"
                >
                    ADD NEW PRODUCT
                </Button>
            </div>
            {/* Products Grid */}
            <div className="!grid !grid-cols-1 min-[500px]:!grid-cols-2 min-[700px]:!grid-cols-3  md:!grid-cols-2 lg:!grid-cols-3 !gap-6 !mb-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {/* Pagination */}
            <div className="!flex !justify-center">
                <Pagination
                    current={1}
                    total={products.length} // Use actual products length for total
                    pageSize={9} // Assuming 9 products per page as per previous mock
                    showSizeChanger={false}
                    showQuickJumper={false}
                    className="!text-center"
                />
            </div>
        </div>
    );
};

export { AdminAllProducts }; // Export as named export
