/** @format */

import React from "react";
import { Table, Button, Input, Tag, Pagination, Dropdown, Spin, Menu, Flex, Typography, Tooltip, Empty } from "antd";
import { EyeOutlined, CheckOutlined, CloseOutlined, DownOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Box, Container, FilterButton, Image, Text as TextBase } from "@/components";
import { formatCurrency, orderAdminFilterOptions } from "@/utils";
import { OrderService } from "@/services/order/OrderService";
import { IFilterValueItem, IResponseStatus, IUserInformation } from "@/types";
import { useNotification } from "@/context";
import { IOrder, IOrderItem, IOrderPayment, OrderStatus } from "@/types/orders";
import { useImmerState } from "@/hooks";
import dayjs from "dayjs";

const { Text } = Typography;

interface IOrderFilterValues {
    orderStatus?: string[];
}

interface IOrderManagementState {
    searchValue: string;
    orders: IOrder[];
    searchText: string;
    currentPage: number;
    orderCounts: number;
    isLoading: boolean;
    isUpdatingStatus: {
        isAccept: boolean;
        isReject: boolean;
        isChange: boolean;
    };
    activeFilters: IOrderFilterValues;
    selectedRowKeys: string[];
}

const initialState: IOrderManagementState = {
    searchValue: "",
    searchText: "",
    currentPage: 1,
    orderCounts: 0,
    orders: [],
    isLoading: false,
    isUpdatingStatus: {
        isAccept: false,
        isChange: false,
        isReject: false,
    },
    activeFilters: {},
    selectedRowKeys: [],
};

const OrderManagement: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<IOrderManagementState>(initialState);
    const { activeFilters, currentPage, orderCounts: orderCounts, isLoading, isUpdatingStatus, orders, searchText, searchValue, selectedRowKeys } = state;
    const notify = useNotification();
    const ITEMS_PER_PAGE = 10;

    const getOrderList = async () => {
        try {
            setState({ isLoading: true });
            const data = await OrderService.getAllOrders({
                search: searchValue,
                filters: activeFilters,
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            });
            if (data.status === IResponseStatus.Error) {
                setState({
                    orders: [],
                    orderCounts: 0,
                });
            } else {
                setState({
                    orders: data.data?.orders,
                    orderCounts: data.data?.totalCounts,
                });
            }
        } catch (error) {
            setState({
                orders: [],
                orderCounts: 0,
            });
        } finally {
            setState({ isLoading: false });
        }
    };

    React.useEffect(() => {
        getOrderList();
    }, [searchValue, activeFilters]);

    const handleSearch = (value) => {
        setState({ searchValue: value });
    };

    const handleApplyFilters = React.useCallback((filters: IFilterValueItem) => {
        setState({ activeFilters: filters, currentPage: 1 });
    }, []);

    const getStatusColor = (status: IOrder["orderStatus"]): string => {
        const colors: Record<IOrder["orderStatus"], string> = {
            1: "orange",
            2: "blue",
            3: "green",
            4: "red",
        };
        return colors[status] || "default";
    };

    const getStatusText = (status: IOrder["orderStatus"]) => {
        const statusTexts: Record<IOrder["orderStatus"], string> = {
            1: "Đang chờ",
            2: "Đang xử lý",
            3: "Đã giao",
            4: "Đã hủy",
        };
        return statusTexts[status] || status;
    };

    const getPaymentText = (payment: IOrderPayment) => {
        const paymentText: Record<IOrderPayment, string> = {
            1: "Thanh toán khi nhận hàng",
            2: "Chuyển khoản",
        };

        return paymentText[payment];
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

    const handleChangeBulkStatus = async (newStatus: string) => {
        try {
            setState({ isUpdatingStatus: { ...isUpdatingStatus, isChange: true } });
            const data = await OrderService.updateOrderStatus(selectedRowKeys, Number(newStatus));
            if (data.status === IResponseStatus.Error) {
                notify.error(data.message);
            } else {
                notify.success(data.message);
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi khi cập nhật trạng thái đơn hàng");
        } finally {
            setState({ selectedRowKeys: [], isUpdatingStatus: { ...isUpdatingStatus, isChange: false } });
            await getOrderList();
        }
    };

    const handleAcceptOrderBulk = async () => {
        try {
            setState({ isUpdatingStatus: { ...isUpdatingStatus, isAccept: true } });
            const data = await OrderService.updateOrderStatus(selectedRowKeys, OrderStatus.Processing);
            if (data.status === IResponseStatus.Error) {
                notify.error(data.message);
            } else {
                notify.success(data.message);
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi khi cập nhật trạng thái đơn hàng");
        } finally {
            setState({ selectedRowKeys: [], isUpdatingStatus: { ...isUpdatingStatus, isAccept: false } });
            await getOrderList();
        }
    };

    const handleRejectOrderBulk = async () => {
        try {
            setState({ isUpdatingStatus: { ...isUpdatingStatus, isReject: true } });
            const data = await OrderService.updateOrderStatus(selectedRowKeys, OrderStatus.Cancel);
            if (data.status === IResponseStatus.Error) {
                notify.error(data.message);
            } else {
                notify.success(data.message);
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi khi cập nhật trạng thái đơn hàng");
        } finally {
            setState({ selectedRowKeys: [], isUpdatingStatus: { ...isUpdatingStatus, isReject: false } });
            await getOrderList();
        }
    };

    const columns = [
        {
            title: "Order ID",
            dataIndex: "orderCode",
            key: "orderCode",
            width: 90,
            render: (text: string) => (
                <Tooltip title={text} placement="topLeft">
                    <Text ellipsis={true} className="text-gray-900" style={{ maxWidth: 90 }}>
                        {text}
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: "Khách hàng",
            dataIndex: "userInfo",
            key: "userInfo",
            width: 180,
            render: (userInfo: IUserInformation) => (
                <Flex align="center" className="!space-x-3">
                    <Image src={userInfo.avatar} alt={userInfo.displayName} objectFit="cover" height={32} width={32} className="!rounded-full" />
                    <Tooltip title={userInfo.displayName} placement="topLeft">
                        <Text ellipsis={true} className="text-gray-900" style={{ maxWidth: 120 }}>
                            {userInfo.displayName}
                        </Text>
                    </Tooltip>
                </Flex>
            ),
        },
        {
            title: "Số lượng",
            dataIndex: "orderItems",
            key: "quantity",
            width: 90,
            render: (orderItems: IOrderItem[]) => {
                let totalQty = 0;
                orderItems.forEach((item) => {
                    totalQty = totalQty + item.quantity;
                });
                return <TextBase as="span" className="!text-gray-700" titleText={`${totalQty} sản phẩm`} />;
            },
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (total: number) => <TextBase as="span" className="!text-gray-900" titleText={formatCurrency(total)} />,
        },
        {
            title: "Trạng thái",
            dataIndex: "orderStatus",
            key: "orderStatus",
            render: (orderStatus: OrderStatus) => (
                <Tag color={getStatusColor(orderStatus)} className="!rounded-full !px-3 !py-1 !text-xs !font-medium">
                    {getStatusText(orderStatus)}
                </Tag>
            ),
        },
        {
            title: "Phương thức thanh toán",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            width: 110,
            render: (paymentMethod: IOrderPayment) => <span className="!text-gray-700">{getPaymentText(paymentMethod)}</span>,
        },
        {
            title: "Ngày đặt",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt: string) => <TextBase className="!text-gray-600">{dayjs(createdAt).format("DD-MM-YYYY")}</TextBase>,
        },
        {
            title: "Hành động",
            key: "action",
            width: 60,
            render: (_: any, record: IOrder) => (
                <Link to={`/admin/orders/${record.orderCode}`}>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        className="
                            !text-gray-600
                            hover:!text-white
                            hover:!bg-[#364153]
                            hover:!border-[#364153]
                            !transition-colors !duration-200"
                        disabled={isLoading}
                    />
                </Link>
            ),
        },
    ];

    const onSelectChange = (newSelectedRowKeys: React.SetStateAction<any>) => {
        setState({ selectedRowKeys: newSelectedRowKeys });
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: () => ({
            disabled: isLoading,
        }),
    };

    const selectedOrdersDetails = selectedRowKeys.map((key: string) => orders.find((o) => o.orderCode === key)).filter(Boolean);
    const hasPendingSelected = selectedOrdersDetails.every((order) => order?.orderStatus === OrderStatus.WaitingConfirm);
    const hasProcessingSelected = selectedOrdersDetails.every((order) => order?.orderStatus === OrderStatus.Processing);

    const bulkStatusMenu = (
        <Menu onClick={({ key }) => handleChangeBulkStatus(key)}>
            <Menu.Item key={OrderStatus.Delivered.toString()}>Đã giao</Menu.Item>
            <Menu.Item key={OrderStatus.WaitingConfirm.toString()}>Chờ xác nhận</Menu.Item>
            <Menu.Item key={OrderStatus.Cancel.toString()}>Đã hủy</Menu.Item>
        </Menu>
    );

    return (
        <Flex vertical className="bg-transparent flex-grow min-h-full">
            <Box margin={[0, 0, 24, 0]}>
                <TextBase className="!text-gray-900" size="2xl" fontWeight="bold" titleText="Quản lý đơn hàng" margin={[0, 0, 16, 0]} />
            </Box>

            <Container bgColor="white" className="flex-grow !rounded-lg !shadow-sm" padding={[24, 24, 24, 24]}>
                <Flex align="center" justify="space-between" wrap="wrap" gap="middle" className="!mb-6">
                    <Input.Search
                        placeholder="Tìm theo khách hàng hoặc mã đơn hàng"
                        allowClear
                        onSearch={handleSearch}
                        value={searchText}
                        onChange={(e) => setState({ searchText: e.target.value })}
                        className="!w-full max-w-[300px]"
                        size="middle"
                        disabled={isLoading}
                    />

                    <Flex align="center" gap="small">
                        {selectedRowKeys.length > 0 && (
                            <>
                                {hasPendingSelected && (
                                    <>
                                        <Button
                                            type="default"
                                            icon={<CheckOutlined />}
                                            onClick={handleAcceptOrderBulk}
                                            className="!bg-green-100 !text-green-700 hover:!bg-green-200 !border-green-100 !rounded"
                                            disabled={isUpdatingStatus.isAccept || isUpdatingStatus.isReject}
                                            loading={isUpdatingStatus.isAccept}
                                        >
                                            Chấp nhận
                                        </Button>
                                        <Button
                                            type="default"
                                            icon={<CloseOutlined />}
                                            onClick={handleRejectOrderBulk}
                                            className="!bg-red-100 !text-red-700 hover:!bg-red-200 !border-red-100 !rounded"
                                            disabled={isUpdatingStatus.isAccept || isUpdatingStatus.isReject}
                                            loading={isUpdatingStatus.isReject}
                                        >
                                            Từ chối
                                        </Button>
                                    </>
                                )}

                                {hasProcessingSelected && (
                                    <Dropdown overlay={bulkStatusMenu} trigger={["click"]} disabled={isUpdatingStatus.isChange}>
                                        <Button
                                            type="default"
                                            className={`
                                                    !rounded
                                                    ${getStatusClasses("processing")}
                                                    hover:!brightness-90
                                                `}
                                            disabled={isUpdatingStatus.isChange}
                                            loading={isUpdatingStatus.isChange}
                                        >
                                            {getStatusText(OrderStatus.Processing)} ({selectedRowKeys.length}) <DownOutlined />
                                        </Button>
                                    </Dropdown>
                                )}
                            </>
                        )}
                        <FilterButton disabled={isLoading} onApplyFilters={handleApplyFilters} currentFilters={activeFilters} availableFilters={orderAdminFilterOptions} />
                    </Flex>
                </Flex>
                {isLoading ? (
                    <Flex align="center" justify="center" className="min-h-[300px]">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                    </Flex>
                ) : (
                    <React.Fragment>
                        <Table
                            columns={columns}
                            dataSource={orders.map((order) => ({ ...order, key: order.orderCode }))}
                            pagination={false}
                            className="w-full !mb-8"
                            rowKey="orderCode"
                            scroll={{ x: orders.length > 0 ? "max-content" : undefined }}
                            rowSelection={rowSelection}
                            locale={{ emptyText: <Empty description="Không có đơn hàng nào." /> }}
                        />
                        {orders.length > 0 && (
                            <Flex justify="end">
                                <Pagination
                                    current={currentPage}
                                    total={orderCounts}
                                    pageSize={ITEMS_PER_PAGE}
                                    onChange={(page: number) => setState({ currentPage: page })}
                                    showSizeChanger={false}
                                    showQuickJumper={false}
                                    className="text-center"
                                    disabled={isLoading}
                                />
                            </Flex>
                        )}
                    </React.Fragment>
                )}
            </Container>
        </Flex>
    );
};

export { OrderManagement };
