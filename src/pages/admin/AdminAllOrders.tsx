/** @format */

import React, { useState } from "react";
import { Table, Button, Input, Select, Tag, Pagination, Checkbox, Space, Dropdown, Menu, Tooltip } from "antd"; // Import Tooltip
import { SearchOutlined, EyeOutlined, CheckOutlined, CloseOutlined, DownOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Option } = Select;

const AdminAllOrders = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    // Sample data - thay thế bằng data thực từ API
    const [ordersData, setOrdersData] = useState([
        {
            key: "1",
            orderId: "#470063DR",
            customer: {
                name: "William Watson",
                avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            },
            qty: 2,
            total: "$171.00",
            status: "pending",
            date: "16 Jan, 2023",
            paymentMethod: "Cash on Delivery",
        },
        {
            key: "2",
            orderId: "#19893507",
            customer: {
                name: "Shahnewaz Sakil",
                avatar: "https://randomuser.me/api/portraits/men/2.jpg",
            },
            qty: 5,
            total: "$1044.00",
            status: "pending",
            date: "18 Feb, 2023",
            paymentMethod: "Credit Card",
        },
        {
            key: "3",
            orderId: "#26BC663E",
            customer: {
                name: "Bootstrap Turner",
                avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            },
            qty: 7,
            total: "$542.00",
            status: "processing", // Example of an order already in processing
            date: "25 Jan, 2023",
            paymentMethod: "PayPal",
        },
        {
            key: "4",
            orderId: "#373F9567",
            customer: {
                name: "Robert Downy",
                avatar: "https://randomuser.me/api/portraits/men/3.jpg",
            },
            qty: 15,
            total: "$1450.00",
            status: "pending",
            date: "10 Feb, 2023",
            paymentMethod: "Transfer",
        },
        {
            key: "5",
            orderId: "#AD6ACD89",
            customer: {
                name: "Dr. Stephene",
                avatar: "https://randomuser.me/api/portraits/women/2.jpg",
            },
            qty: 1,
            total: "$540.00",
            status: "delivered", // Example of a delivered order
            date: "24 Jan, 2023",
            paymentMethod: "Credit Card",
        },
        {
            key: "6",
            orderId: "#CDEF4567",
            customer: {
                name: "Alice Wonderland",
                avatar: "https://randomuser.me/api/portraits/women/3.jpg",
            },
            qty: 3,
            total: "$250.00",
            status: "processing",
            date: "01 Mar, 2023",
            paymentMethod: "Transfer",
        },
    ]);

    const getStatusColor = (status: string) => {
        const statusColors: { [key: string]: string } = {
            pending: "orange",
            processing: "blue",
            delivered: "green",
            cancel: "red",
            refunded: "purple",
        };
        return statusColors[status] || "default";
    };

    const getStatusText = (status: string) => {
        const statusTexts: { [key: string]: string } = {
            pending: "Pending",
            processing: "Processing",
            delivered: "Delivered",
            cancel: "Cancelled",
            refunded: "Refunded",
        };
        return statusTexts[status] || status;
    };

    const getStatusClasses = (status: string) => {
        switch (status) {
            case "pending":
                return "!bg-yellow-100 !text-yellow-700 !border-yellow-100";
            case "processing":
                return "!bg-blue-100 !text-blue-700 !border-blue-100";
            case "delivered":
                return "!bg-green-100 !text-green-700 !border-green-100";
            case "cancel":
                return "!bg-red-100 !text-red-700 !border-red-100";
            case "refunded":
                return "!bg-purple-100 !text-purple-700 !border-purple-100";
            default:
                return "!bg-gray-100 !text-gray-700 !border-gray-100";
        }
    };

    const handleChangeBulkStatus = (newStatus: string) => {
        setOrdersData((prevOrders) =>
            prevOrders.map((order) => {
                if (selectedRowKeys.includes(order.key) && order.status === "processing") {
                    if (newStatus === "refunded" && order.paymentMethod !== "Transfer") {
                        // Logic to prevent refunding non-transfer payments if desired,
                        // though the menu item itself is conditional.
                        return order;
                    }
                    return { ...order, status: newStatus };
                }
                return order;
            })
        );
        setSelectedRowKeys([]);
        console.log(`Selected orders bulk status changed to ${newStatus}`);
    };

    const handleAcceptOrderBulk = () => {
        setOrdersData((prevOrders) => prevOrders.map((order) => (selectedRowKeys.includes(order.key) && order.status === "pending" ? { ...order, status: "processing" } : order)));
        setSelectedRowKeys([]);
        console.log("Selected orders accepted.");
    };

    const handleRejectOrderBulk = () => {
        setOrdersData((prevOrders) =>
            prevOrders.map((order) => {
                if (selectedRowKeys.includes(order.key) && order.status === "pending") {
                    if (order.paymentMethod === "Transfer") {
                        return { ...order, status: "refunded" };
                    } else {
                        return { ...order, status: "cancel" };
                    }
                }
                return order;
            })
        );
        setSelectedRowKeys([]);
        console.log("Selected orders rejected.");
    };

    const columns = [
        {
            title: "ORDER ID",
            dataIndex: "orderId",
            key: "orderId",
            render: (text: string) => <span className="!text-gray-900">{text}</span>,
        },
        {
            title: "CUSTOMER",
            dataIndex: "customer",
            key: "customer",
            render: (customer: {
                avatar: string | undefined;
                name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
            }) => (
                <div className="!flex !items-center !space-x-3">
                    <img src={customer.avatar} alt={customer.name as string} className="!w-8 !h-8 !rounded-full !object-cover" />
                    <span className="!text-gray-900">{customer.name}</span>
                </div>
            ),
        },
        {
            title: "QTY",
            dataIndex: "qty",
            key: "qty",
            width: 80,
            render: (qty: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined) => (
                <span className="!text-gray-700">{qty}</span>
            ),
        },
        {
            title: "TOTAL",
            dataIndex: "total",
            key: "total",
            render: (total: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined) => (
                <span className="!text-gray-900">{total}</span>
            ),
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={getStatusColor(status)} className="!rounded-full !px-3 !py-1 !text-xs !font-medium">
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: "PAYMENT METHOD",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            render: (method: string) => <span className="!text-gray-700">{method}</span>,
        },
        {
            title: "DATE",
            dataIndex: "date",
            key: "date",
            render: (date: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined) => (
                <span className="!text-gray-600">{date}</span>
            ),
        },
        {
            title: "ACTION",
            key: "action",
            width: 80,
            render: (_: any, record: any) => (
                <Link to={`/admin/orders/${record.orderId}`}>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        className="
            !text-gray-600 
            hover:!text-white 
            hover:!bg-[#364153] 
            hover:!border-[#364153] 
            !transition-colors !duration-200" // Thêm transition để hiệu ứng mượt mà hơn
                    />
                </Link>
            ),
        },
    ];

    const onSelectChange = (newSelectedRowKeys: React.SetStateAction<any>) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const filteredOrders = ordersData.filter((order) => {
        const matchesSearch = order.orderId.toLowerCase().includes(searchValue.toLowerCase()) || order.customer.name.toLowerCase().includes(searchValue.toLowerCase());
        const matchesStatus = statusFilter === "All" || order.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const selectedOrdersDetails = selectedRowKeys.map((key: string) => filteredOrders.find((o) => o.key === key)).filter(Boolean); // Lọc trên filteredOrders để đảm bảo key tồn tại

    const hasPendingSelected = selectedOrdersDetails.some((order) => order?.status === "pending");
    const hasProcessingSelected = selectedOrdersDetails.some((order) => order?.status === "processing");
    const hasOtherStatusesSelected = selectedOrdersDetails.some((order) => order?.status !== "pending" && order?.status !== "processing");

    const bulkStatusMenu = (
        <Menu onClick={({ key }) => handleChangeBulkStatus(key)}>
            <Menu.Item key="delivered">Delivered</Menu.Item>
            <Menu.Item key="cancel">Cancelled</Menu.Item>
            {selectedOrdersDetails.some((order) => order?.status === "processing" && order?.paymentMethod === "Transfer") && <Menu.Item key="refunded">Refunded</Menu.Item>}
        </Menu>
    );

    return (
        // ✅ Updated: Div bọc ngoài cùng cho phép tiêu đề và breadcrumb nằm ngoài card trắng.
        // Nó cũng đảm bảo component giãn nở để lấp đầy không gian.
        <div className="!flex !flex-col !flex-grow !min-h-full">
            {/* ✅ Updated: Tiêu đề và Breadcrumb nằm ngoài container màu trắng */}
            {/* Sử dụng !mb-6 để tạo khoảng cách với card bên dưới */}
            <div className="!flex !flex-col sm:!flex-row !items-start sm:!items-center !justify-between !mb-6 !flex-shrink-0">
                <div>
                    <h1 className="!text-2xl !font-semibold !text-gray-900">Order List</h1>
                    <div className="!flex !items-center !text-sm !text-gray-500 !mt-1">
                        <span>Home</span>
                        <span className="!mx-2">•</span>
                        <span>Order List</span>
                    </div>
                </div>
            </div>

            {/* ✅ Updated: Đây là container màu trắng mới, bao bọc search, filter, table và pagination */}
            {/* Nó sẽ giãn nở để lấp đầy không gian còn lại sau tiêu đề */}
            <div className="!bg-white !rounded-lg !shadow-sm !border !border-gray-200 !flex !flex-col !flex-grow">
                {/* Header (Search, Filter and Actions Bar) */}
                <div className="!p-6 !border-b !border-gray-200 !flex-shrink-0">
                    <div className="!flex !flex-wrap !items-center !justify-between !gap-4">
                        {/* Search Input Container */}
                        <div className="!w-full min-[500px]:!w-[280px] !flex-none">
                            <Input
                                placeholder="Search by order id or customer"
                                prefix={<SearchOutlined className="!text-gray-400" />}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="!w-full"
                            />
                        </div>

                        {/* Status Filter and Conditional Bulk Actions Container */}
                        <div className="!flex !flex-wrap !items-center !gap-2 !w-full sm:!w-auto !justify-end !ml-auto !flex-shrink-0">
                            <span className="!text-sm !text-gray-600 !font-bold">Status:</span>
                            <Select value={statusFilter} onChange={setStatusFilter} className="!w-32" size="middle">
                                <Option value="All">All</Option>
                                <Option value="Pending">Pending</Option>
                                <Option value="Processing">Processing</Option>
                                <Option value="Delivered">Delivered</Option>
                                <Option value="Cancel">Cancelled</Option>
                                <Option value="Refunded">Refunded</Option>
                            </Select>

                            {/* CONDITIONAL BUTTONS START HERE */}
                            {selectedRowKeys.length > 0 && (
                                <>
                                    {/* Action: Bulk Accept Order */}
                                    {hasPendingSelected && !hasProcessingSelected && !hasOtherStatusesSelected && (
                                        <>
                                            <Tooltip title="Chấp nhận đơn hàng">
                                                <Button
                                                    type="default"
                                                    icon={<CheckOutlined />}
                                                    onClick={handleAcceptOrderBulk}
                                                    className="!bg-green-100 !text-green-700 hover:!bg-green-200 !border-green-100 !rounded"
                                                />
                                            </Tooltip>

                                            {/* Action: Bulk Reject Order (only for pending) */}
                                            <Tooltip title="Từ chối đơn hàng">
                                                <Button
                                                    type="default"
                                                    icon={<CloseOutlined />}
                                                    onClick={handleRejectOrderBulk}
                                                    className="!bg-red-100 !text-red-700 hover:!bg-red-200 !border-red-100 !rounded"
                                                />
                                            </Tooltip>
                                        </>
                                    )}

                                    {/* Dropdown for Processing orders */}
                                    {!hasPendingSelected && hasProcessingSelected && !hasOtherStatusesSelected && (
                                        <Dropdown overlay={bulkStatusMenu} trigger={["click"]}>
                                            <Button
                                                type="default"
                                                className={`
                                                    !rounded
                                                    ${getStatusClasses("processing")}
                                                    hover:!brightness-90
                                                `}
                                            >
                                                {getStatusText("processing")} ({selectedRowKeys.length}) <DownOutlined />
                                            </Button>
                                        </Dropdown>
                                    )}

                                    {/* Optional: Message if mixed selection or unallowed statuses are selected */}
                                    {(hasPendingSelected && hasProcessingSelected) ||
                                        (hasOtherStatusesSelected && <span className="!text-red-500 !text-sm">Vui lòng chọn đơn hàng có cùng trạng thái (Pending hoặc Processing)</span>)}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table - ✅ Đảm bảo nó có thể giãn nở để đẩy Pagination xuống dưới cùng */}
                <div className="!p-6 !flex-grow !overflow-auto">
                    {" "}
                    {/* Added !overflow-auto here to allow table to scroll if content is too long for the allocated flex-grow space */}
                    <Table columns={columns} dataSource={filteredOrders} pagination={false} className="custom-table" size="middle" scroll={{ x: "max-content" }} rowSelection={rowSelection} />
                </div>

                {/* Pagination - ✅ Đảm bảo nó không bị co lại quá mức và nằm ở cuối */}
                <div className="!flex !flex-col sm:!flex-row !items-center !justify-between !mt-auto !p-6 !border-t !border-gray-200 !flex-shrink-0">
                    {" "}
                    {/* Added !mt-auto for pushing to bottom, !p-6 and !border-t for consistent styling */}
                    <span className="!text-sm !text-gray-600">
                        Showing {filteredOrders.length} items of {ordersData.length}
                    </span>
                    <Pagination current={1} total={filteredOrders.length} pageSize={10} showSizeChanger={false} className="!flex !items-center" />
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
                    padding: 16px 16px;
                }

                .custom-table .ant-table-tbody > tr:hover > td {
                    background-color: #f9fafb;
                }

                .ant-tag {
                    border: none;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
};

export { AdminAllOrders };
