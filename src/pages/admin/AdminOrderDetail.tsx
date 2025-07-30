/** @format */

import React, { useState } from "react";
import { Button, Select, Table, Avatar, Tag } from "antd";
import { useParams } from "react-router-dom";

const { Option } = Select;

const AdminOrdersDetail = () => {
    const { orderId } = useParams();
    // Khởi tạo trạng thái với giá trị từ orderData để đảm bảo đồng bộ ban đầu
    const [orderStatus, setOrderStatus] = useState("delivered");

    // Sample order data - thay thế bằng data thực từ API
    const orderData = {
        orderId: "#26BC663E",
        orderCreated: "Jan 26, 2023 10:30 AM",
        status: "delivered", // Giá trị mặc định của order
        customer: {
            name: "Shahnewaz Sakil",
            email: "support@mail.com",
            phone: "+9458 785 014",
            avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        },
        orderSummary: {
            orderDate: "04/05/2023",
            paymentMethod: "Online",
            paymentIcon: "VISA",
            shippingMethod: "Cash On Delivery",
        },
        deliverTo: {
            house: "7765 Spring Circle Chicago, IL 60621",
            street: "3169 Hamilton Drive",
            state: "Texas",
        },
        products: [
            {
                key: "1",
                name: "Whitetails Women's Open Sky",
                image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=100&h=100&fit=crop",
                unitPrice: "$171.00",
                quantity: 37,
                total: "$1200.33",
                color: "teal",
            },
            {
                key: "2",
                name: "Red Bag for kids",
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop",
                unitPrice: "$15.00",
                quantity: 10,
                total: "$15.00",
                color: "red",
            },
            {
                key: "3",
                name: "Sports shoe for women",
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
                unitPrice: "$145.00",
                quantity: 20,
                total: "$2500.00",
                color: "gray",
            },
        ],
        pricing: {
            subtotal: "$1237.00",
            shippingCost: "$49.55",
            grandTotal: "$1310.55",
        },
    };

    // Cập nhật trạng thái ban đầu của orderStatus khi component được render lần đầu
    // để nó khớp với trạng thái từ orderData.
    // Nếu orderData.status thay đổi sau khi fetch API, useEffect sẽ cần thiết.
    React.useEffect(() => {
        setOrderStatus(orderData.status);
    }, [orderData.status]);

    const handleStatusChange = (value) => {
        setOrderStatus(value);
    };

    const handleSave = () => {
        console.log("Saving order status:", orderStatus);
        // Handle save logic here, e.g., send API request to update order status
        // If successful, you might want to update orderData.status as well
        // setOrderData(prevData => ({ ...prevData, status: orderStatus }));
    };

    const productColumns = [
        {
            title: "PRODUCT",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <div className="!flex !items-center !space-x-3">
                    <div className="!relative">
                        <img src={record.image} alt={text} className="!w-12 !h-12 !rounded-lg !object-cover" />
                        <div className={`!absolute !top-0 !right-0 !w-4 !h-4 !rounded-full !transform !translate-x-1 !-translate-y-1`} style={{ backgroundColor: record.color }}></div>
                    </div>
                    <span className="!text-gray-900 !font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: "UNIT PRICE",
            dataIndex: "unitPrice",
            key: "unitPrice",
            render: (text) => <span className="!text-gray-700">{text}</span>,
        },
        {
            title: "QUANTITY",
            dataIndex: "quantity",
            key: "quantity",
            render: (text) => <span className="!text-gray-700">{text}</span>,
        },
        {
            title: "TOTAL",
            dataIndex: "total",
            key: "total",
            render: (text) => <span className="!text-gray-900 !font-semibold">{text}</span>,
        },
    ];

    return (
        <div className="!flex !flex-col !flex-grow !min-h-full">
            {/* Header */}
            <div className="!mb-6 !flex-shrink-0">
                <div className="!flex !items-center !justify-between !mb-4">
                    <div>
                        <h1 className="!text-2xl !font-semibold !text-gray-900">Order Details</h1>
                        <div className="!flex !items-center !text-sm !text-gray-500 !mt-1">
                            <span>Home</span>
                            <span className="!mx-2">•</span>
                            <span>Order Details #{orderId || orderData.orderId}</span>
                        </div>
                    </div>
                </div>

                {/* Order Info and Status */}
                <div className="!bg-white !rounded-lg !p-6 !shadow-sm !border !border-gray-200 !mb-6">
                    <div
                        className="
                        !flex 
                        !flex-col md:!flex-row  {/* ✅ Changed sm to md for better control on larger small screens */}
                        !items-start md:!items-center 
                        !justify-between 
                        !gap-4 md:!gap-6"
                    >
                        <div>
                            <div className="!text-lg !font-semibold !text-gray-900 !mb-1">Order ID : {orderData.orderId}</div>
                            <div className="!text-sm !text-gray-500">Order Created : {orderData.orderCreated}</div>
                        </div>
                        {/* Action Buttons Container */}
                        <div
                            className="
                            !flex 
                            !flex-wrap  {/* ✅ Added !flex-wrap to allow items to wrap */}
                            !items-center  {/* Changed to !items-center to align items when they are on the same line */}
                            !justify-start md:!justify-end  {/* ✅ Adjusted justify-content */}
                            !gap-2  {/* ✅ Added gap for spacing between items when wrapped */}
                            !w-full md:!w-auto"
                        >
                            {" "}
                            {/* Retained !w-full for responsiveness */}
                            <span className="!text-sm !text-gray-600 !whitespace-nowrap">Change Status :</span>
                            <Select value={orderStatus} onChange={handleStatusChange} className="!flex-1 !min-w-[120px]" size="middle">
                                {" "}
                                {/* ✅ Changed !w-full to !flex-1 !min-w-[120px] */}
                                <Option value="pending">Pending</Option>
                                <Option value="processing">Processing</Option>
                                <Option value="delivered">Delivered</Option>
                                <Option value="cancelled">Cancelled</Option>
                            </Select>
                            <Button type="primary" onClick={handleSave} className="!bg-blue-500 hover:!bg-blue-600 !flex-1 !min-w-[80px]">
                                {" "}
                                {/* ✅ Changed !w-full to !flex-1 !min-w-[80px] */}
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-6 !flex-grow">
                {/* Customer Details */}
                <div className="!bg-white !rounded-lg !p-6 !shadow-sm !border !border-gray-200">
                    <h3 className="!text-lg !font-semibold !text-gray-900 !mb-4">Customer Details</h3>
                    <div className="!space-y-4">
                        <div className="!flex !items-center !space-x-3">
                            <span className="!text-sm !text-gray-600 !w-16">Name</span>
                            <div className="!flex !items-center !space-x-3">
                                <Avatar src={orderData.customer.avatar} size={32} />
                                <span className="!text-gray-900">{orderData.customer.name}</span>
                            </div>
                        </div>
                        <div className="!flex !items-center !space-x-3">
                            <span className="!text-sm !text-gray-600 !w-16">Email</span>
                            <span className="!text-gray-900">{orderData.customer.email}</span>
                        </div>
                        <div className="!flex !items-center !space-x-3">
                            <span className="!text-sm !text-gray-600 !w-16">Phone</span>
                            <span className="!text-gray-900">{orderData.customer.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="!bg-white !rounded-lg !p-6 !shadow-sm !border !border-gray-200">
                    <h3 className="!text-lg !font-semibold !text-gray-900 !mb-4">Order Summary</h3>
                    <div className="!space-y-4">
                        <div className="!flex !items-center !justify-between">
                            <span className="!text-sm !text-gray-600">Order Date</span>
                            <span className="!text-gray-900">{orderData.orderSummary.orderDate}</span>
                        </div>
                        <div className="!flex !items-center !justify-between">
                            <span className="!text-sm !text-gray-600">Payment Method</span>
                            <div className="!flex !items-center !space-x-2">
                                <span className="!text-gray-900">{orderData.orderSummary.paymentMethod}</span>
                                <Tag color="blue" className="!text-xs !font-bold">
                                    VISA
                                </Tag>
                            </div>
                        </div>
                        <div className="!flex !items-center !justify-between">
                            <span className="!text-sm !text-gray-600">Shipping Method</span>
                            <span className="!text-gray-900">{orderData.orderSummary.shippingMethod}</span>
                        </div>
                    </div>
                </div>

                {/* Deliver To */}
                <div className="!bg-white !rounded-lg !p-6 !shadow-sm !border !border-gray-200">
                    <h3 className="!text-lg !font-semibold !text-gray-900 !mb-4">Deliver To</h3>
                    <div className="!space-y-4">
                        <div className="!flex !items-start !justify-between">
                            <span className="!text-sm !text-gray-600 !w-16">House</span>
                            <span className="!text-gray-900 !text-right !flex-1">{orderData.deliverTo.house}</span>
                        </div>
                        <div className="!flex !items-center !justify-between">
                            <span className="!text-sm !text-gray-600 !w-16">Street</span>
                            <span className="!text-gray-900">{orderData.deliverTo.street}</span>
                        </div>
                        <div className="!flex !items-center !justify-between">
                            <span className="!text-sm !text-gray-600 !w-16">State</span>
                            <span className="!text-gray-900">{orderData.deliverTo.state}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table and Order Price Summary */}
            <div className="!mt-8 !flex-grow !flex !flex-col">
                <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-6 !w-full !flex-grow">
                    {/* Products Table */}
                    <div className="lg:!col-span-2 !flex !flex-col">
                        <div className="!bg-white !rounded-lg !p-6 !shadow-sm !border !border-gray-200 !flex-grow !overflow-auto">
                            <Table columns={productColumns} dataSource={orderData.products} pagination={false} className="custom-table" size="middle" scroll={{ x: "max-content" }} />
                        </div>
                    </div>

                    {/* Order Price Summary */}
                    <div className="!bg-white !rounded-lg !p-6 !shadow-sm !border !border-gray-200 !flex-shrink-0">
                        <h3 className="!text-lg !font-semibold !text-gray-900 !mb-4">Order Price</h3>
                        <div className="!space-y-3">
                            <div className="!flex !items-center !justify-between">
                                <span className="!text-sm !text-gray-600">Subtotal</span>
                                <span className="!text-gray-900">{orderData.pricing.subtotal}</span>
                            </div>
                            <div className="!flex !items-center !justify-between">
                                <span className="!text-sm !text-gray-600">Shipping cost:</span>
                                <span className="!text-gray-900">{orderData.pricing.shippingCost}</span>
                            </div>
                            <hr className="!border-gray-200" />
                            <div className="!flex !items-center !justify-between">
                                <span className="!text-base !font-semibold !text-gray-900">Grand total:</span>
                                <span className="!text-lg !font-bold !text-gray-900">{orderData.pricing.grandTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-table .ant-table-thead > tr > th {
                    background-color: #f8f9fa;
                    border-bottom: 1px solid #e5e7eb;
                    font-weight: 600;
                    color: #6b7280;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .custom-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #f3f4f6;
                    padding: 16px;
                }

                .custom-table .ant-table-tbody > tr:hover > td {
                    background-color: #f9fafb;
                }
            `}</style>
        </div>
    );
};

export { AdminOrdersDetail };
