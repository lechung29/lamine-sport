/** @format */

import React from "react";
import { Button, Table, Avatar, Tag, Flex, Spin, Pagination, Dropdown, Menu, Tooltip } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { IOrder, IOrderItem, IOrderPayment, OrderStatus } from "@/types/orders";
import { OrderService } from "@/services/order/OrderService";
import { IProductInfo, IResponseStatus } from "@/types";
import { useNotification } from "@/context";
import { delayTime, formatCurrency } from "@/utils";
import { useImmerState } from "@/hooks";
import { Box, Container, Image, Text } from "@/components";
import { CheckOutlined, CloseOutlined, DownOutlined, LoadingOutlined } from "@ant-design/icons";
import { IoArrowBackSharp } from "react-icons/io5";
import dayjs from "dayjs";
import "./index.scss";
import { isNull } from "lodash";

interface IOrderDetailState {
    orderInfo: IOrder | null;
    isLoading: boolean;
    currentPage: number;
    isUpdatingStatus: {
        isAccept: boolean;
        isReject: boolean;
        isChange: boolean;
    };
}

const initialState: IOrderDetailState = {
    orderInfo: null,
    isLoading: false,
    currentPage: 1,
    isUpdatingStatus: {
        isAccept: false,
        isChange: false,
        isReject: false,
    },
};

const OrderDetail: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<IOrderDetailState>(initialState);
    const { orderInfo, isLoading, currentPage, isUpdatingStatus } = state;
    const { id } = useParams();
    const notify = useNotification();
    const navigate = useNavigate();
    const ITEMS_PER_PAGE = 2;
    const isPending = orderInfo?.orderStatus === OrderStatus.WaitingConfirm;
    const isProcessing = orderInfo?.orderStatus === OrderStatus.Processing;

    React.useEffect(() => {
        const getOrderInfo = async () => {
            try {
                setState({ isLoading: true });
                const orderInfo = await OrderService.getOrderDetail(id as string);
                if (orderInfo.status === IResponseStatus.Error) {
                    notify.error(orderInfo.message);
                    await delayTime(1500).then(() => navigate("/admin/orders"));
                } else if (orderInfo.status === IResponseStatus.Success && isNull(orderInfo.data)) {
                    notify.error("Không tồn tại đơn hàng này trong hệ thống, vui lòng kiểm tra lại!");
                    await delayTime(1500).then(() => navigate("/admin/orders"));
                } else {
                    notify.success(orderInfo.message);
                    setState({ orderInfo: orderInfo.data, isLoading: false });
                }
            } catch (error) {
                console.log(error);
                notify.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
                await delayTime(1500).then(() => navigate("/admin/orders"));
            }
        };
        getOrderInfo();
    }, [id]);

    const handleAcceptOrderBulk = async () => {
        try {
            setState({ isUpdatingStatus: { ...isUpdatingStatus, isAccept: true } });
            const data = await OrderService.updateOrderStatus([orderInfo?.orderCode!], OrderStatus.Processing);
            if (data.status === IResponseStatus.Error) {
                notify.error(data.message);
            } else {
                notify.success(data.message);
                setState({ orderInfo: { ...orderInfo!, orderStatus: OrderStatus.Processing }, isUpdatingStatus: { ...isUpdatingStatus, isAccept: false } });
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi khi cập nhật trạng thái đơn hàng");
        }
    };

    const handleRejectOrderBulk = async () => {
        try {
            setState({ isUpdatingStatus: { ...isUpdatingStatus, isReject: true } });
            const data = await OrderService.updateOrderStatus([orderInfo?.orderCode!], OrderStatus.Cancel);
            if (data.status === IResponseStatus.Error) {
                notify.error(data.message);
            } else {
                notify.success(data.message);
                setState({ orderInfo: { ...orderInfo!, orderStatus: OrderStatus.Cancel }, isUpdatingStatus: { ...isUpdatingStatus, isReject: false } });
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi khi cập nhật trạng thái đơn hàng");
        }
    };

    const handleChangeBulkStatus = async (newStatus: string) => {
        try {
            setState({ isUpdatingStatus: { ...isUpdatingStatus, isChange: true } });
            const data = await OrderService.updateOrderStatus([orderInfo?.orderCode!], Number(newStatus));
            if (data.status === IResponseStatus.Error) {
                notify.error(data.message);
            } else {
                notify.success(data.message);
                setState({ orderInfo: { ...orderInfo!, orderStatus: Number(newStatus) }, isUpdatingStatus: { ...isUpdatingStatus, isReject: false } });
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi khi cập nhật trạng thái đơn hàng");
        }
    };

    const bulkStatusMenu = (
        <Menu onClick={({ key }) => handleChangeBulkStatus(key)}>
            <Menu.Item key={OrderStatus.Delivered.toString()}>Đã giao</Menu.Item>
            <Menu.Item key={OrderStatus.WaitingConfirm.toString()}>Chờ xác nhận</Menu.Item>
            <Menu.Item key={OrderStatus.Cancel.toString()}>Đã hủy</Menu.Item>
        </Menu>
    );

    const getItemToShow = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        return orderInfo?.orderItems.slice(startIndex, endIndex) || [];
    };

    const getProductItemInfo = (productId: string): IOrderItem => {
        return orderInfo?.orderItems.find((item) => item.product._id === productId) as IOrderItem;
    };

    const getPaymentText = (payment: IOrderPayment) => {
        const paymentText: Record<IOrderPayment, string> = {
            1: "Thanh toán khi nhận hàng",
            2: "Chuyển khoản",
        };

        return paymentText[payment];
    };

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

    const productColumns = [
        {
            title: "Sản phẩm",
            dataIndex: "product",
            key: "product",
            render: (productInfo: IProductInfo) => {
                const orderItem = getProductItemInfo(productInfo._id);
                return (
                    <Flex align="center" className="!space-x-3">
                        <Box className="!relative">
                            <Image
                                src={orderItem.product?.productColors.find((color) => color.value === orderItem.selectedColor)?.images[0].url}
                                alt={productInfo?.productName}
                                height={48}
                                width={48}
                                objectFit="cover"
                                className="!rounded-lg"
                            />
                        </Box>
                        <Text className="!text-gray-900" titleText={productInfo?.productName} />
                    </Flex>
                );
            },
        },
        {
            title: "Đơn giá",
            dataIndex: "unitPrice",
            key: "unitPrice",
            render: (price: number) => <Text className="!text-gray-700" titleText={formatCurrency(price)} />,
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            render: (quantity) => <Text className="!text-gray-700" titleText={quantity} />,
        },
        {
            title: "Tổng cộng",
            key: "total",
            render: (orderItem: IOrderItem) => <Text className="!text-gray-700" titleText={formatCurrency(orderItem.quantity * orderItem.unitPrice)} />,
        },
    ];

    return (
        <Flex vertical className="flex-grow w-full min-h-full">
            <Container bgColor="transparent" margin={[0, 0, 12, 0]} className="flex-shrink-0">
                <Flex align="center" justify="space-between">
                    <Box>
                        <Text className="!text-gray-900" size="2xl" fontWeight="bold" titleText="Chi tiết đơn hàng" margin={[0, 0, 12, 0]} />
                    </Box>
                </Flex>
            </Container>

            {isLoading ? (
                <Flex align="center" justify="center" className="min-h-[300px]">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                </Flex>
            ) : (
                <>
                    <Box bgColor="white" padding={[24, 24, 24, 24]} margin={[0, 0, 24, 0]} className="bg-white !rounded-lg !shadow-sm !border !border-gray-200 ">
                        <Box
                            className="
                        flex 
                        flex-col md:flex-row 
                        items-start md:items-center 
                        justify-between 
                        gap-4 md:gap-6"
                        >
                            <Box>
                                <Text size="lg" fontWeight="semibold" margin={[0, 0, 4, 0]} className="!text-gray-900" titleText={`Mã đơn hàng : ${orderInfo?.orderCode}`} />
                                <Text size="sm" className="!text-gray-500" titleText={`Thời gian đặt : ${dayjs(orderInfo?.createdAt).format("DD-MM-YYYY HH:mm:ss")}`} />
                            </Box>
                            <Box
                                className="
                            flex 
                            flex-wrap 
                            items-center
                            justify-start md:justify-end 
                            gap-2 
                            w-full md:w-auto"
                            >
                                {isPending && (
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
                                {isProcessing && (
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
                                            {getStatusText(OrderStatus.Processing)} <DownOutlined />
                                        </Button>
                                    </Dropdown>
                                )}
                                <Tooltip title="Quay lại trang trước">
                                    <Button type="default" icon={<IoArrowBackSharp />} onClick={() => navigate(-1)} className="!bg-[#e7e7e3] !text-gray-700 hover:!bg-gray-200 !rounded !border-none" />
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                    <Container bgColor="transparent" className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
                        <Box bgColor="white" padding={[24, 24, 24, 24]} className="!rounded-lg !shadow-sm !border !border-gray-200">
                            <Text size="lg" fontWeight="semibold" margin={[0, 0, 16, 0]} className="!text-gray-900" titleText="Thông tin khách hàng" />
                            <Box className="!space-y-4">
                                <Flex align="center" className="!space-x-3">
                                    <Text as="span" className="!text-gray-600 w-24" titleText="Tên khách hàng" />
                                    <Flex align="center" className="!space-x-3">
                                        <Avatar src={orderInfo?.userInfo?.avatar} size={32} />
                                        <Text as="span" className="!text-gray-900" titleText={orderInfo?.shippingInfo?.receiver} />
                                    </Flex>
                                </Flex>
                                <Flex align="center" className="!space-x-3">
                                    <Text as="span" className="!text-gray-600 w-24" titleText="Email" />
                                    <Text as="span" className="!text-gray-900" titleText={orderInfo?.shippingInfo.emailReceived} />
                                </Flex>
                                <Flex align="center" className="!space-x-3">
                                    <Text as="span" className="!text-gray-600 w-24" titleText="Số điện thoại" />
                                    <Text as="span" className="!text-gray-900" titleText={orderInfo?.shippingInfo?.phoneNumberReceived} />
                                </Flex>
                            </Box>
                        </Box>

                        <Box bgColor="white" padding={[24, 24, 24, 24]} className="!rounded-lg !shadow-sm !border !border-gray-200">
                            <Text size="lg" fontWeight="semibold" margin={[0, 0, 16, 0]} className="!text-gray-900" titleText="Thông tin đơn hàng" />
                            <Box className="!space-y-4">
                                <Flex align="center" justify="space-between">
                                    <Text as="span" className="!text-gray-600" titleText="Thời gian đặt hàng" />
                                    <Text as="span" className="!text-gray-900" titleText={dayjs(orderInfo?.createdAt).format("DD-MM-YYYY HH:mm:ss")} />
                                </Flex>
                                <Flex align="center" justify="space-between">
                                    <Text as="span" className="!text-gray-600" titleText="Phương thức thanh toán" />
                                    <Text as="span" className="!text-gray-900" titleText={getPaymentText(orderInfo?.paymentMethod!)} />
                                </Flex>
                                <Flex align="center" justify="space-between">
                                    <Text as="span" className="!text-gray-600" titleText="Trạng thái đơn hàng" />
                                    <Tag color={getStatusColor(orderInfo?.orderStatus!)} className="!rounded-full !px-3 !py-1 !text-xs !font-medium">
                                        {getStatusText(orderInfo?.orderStatus!)}
                                    </Tag>
                                </Flex>
                            </Box>
                        </Box>
                        <Box bgColor="white" padding={[24, 24, 24, 24]} className="!rounded-lg !shadow-sm !border !border-gray-200">
                            <Text size="lg" fontWeight="semibold" margin={[0, 0, 16, 0]} className="!text-gray-900" titleText="Thông tin giao hàng" />
                            <Box className="!space-y-4">
                                <Flex align="center" justify="space-between">
                                    <Text as="span" className="!text-gray-600" titleText="Địa chỉ nhận hàng" />
                                    <Text as="span" className="!text-gray-900" titleText={orderInfo?.shippingInfo.address} />
                                </Flex>
                                <Flex vertical align="flex-start">
                                    <Text as="span" className="!text-gray-600" titleText="Ghi chú" />
                                    <Text as="span" className="!text-gray-900" titleText={!!orderInfo?.shippingInfo.note ? orderInfo?.shippingInfo.note : "Không có"} />
                                </Flex>
                            </Box>
                        </Box>
                    </Container>
                    <Flex vertical className="!mt-8 flex-grow">
                        <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full flex-grow">
                            <Box className="lg:col-span-2 flex flex-col">
                                <Box bgColor="white" padding={[24, 24, 24, 24]} className="!rounded-lg !shadow-sm !border !border-gray-200 flex-grow overflow-auto">
                                    <Table columns={productColumns} dataSource={getItemToShow().map((item) => ({...item, key: item.product._id}))} pagination={false} className="custom-table !mb-2" size="middle" scroll={{ x: "max-content" }} />
                                    {orderInfo?.orderItems && orderInfo?.orderItems.length > 0 && (
                                        <Flex justify="end">
                                            <Pagination
                                                current={currentPage}
                                                total={orderInfo?.orderItems.length}
                                                pageSize={ITEMS_PER_PAGE}
                                                onChange={(page: number) => setState({ currentPage: page })}
                                                showSizeChanger={false}
                                                showQuickJumper={false}
                                                className="text-center"
                                                disabled={isLoading}
                                            />
                                        </Flex>
                                    )}
                                </Box>
                            </Box>
                            <Box bgColor="white" padding={[24, 24, 24, 24]} className="!rounded-lg !shadow-sm !border !border-gray-200 flex-shrink-0">
                                <Text size="lg" fontWeight="semibold" margin={[0, 0, 16, 0]} className="!text-gray-900" titleText="Giá trị đơn hàng" />
                                <Box className="!space-y-3">
                                    <Flex align="center" justify="space-between">
                                        <Text as="span" className="!text-gray-600" titleText="Tạm tính:" />
                                        <Text as="span" className="!text-gray-900" titleText={formatCurrency(orderInfo?.productsFees)} />
                                    </Flex>
                                    <Flex align="center" justify="space-between">
                                        <Text as="span" className="!text-gray-600" titleText="Phí giao hàng:" />
                                        <Text as="span" className="!text-red-500" titleText={formatCurrency(orderInfo?.shippingFees)} />
                                    </Flex>
                                    <Flex align="center" justify="space-between">
                                        <Text as="span" className="!text-gray-600" titleText="Giảm giá:" />
                                        <Text as="span" className="!text-blue-500" titleText={`- ${formatCurrency(orderInfo?.discountValue)}`} />
                                    </Flex>
                                    <hr className="!border-gray-200" />
                                    <Flex align="center" justify="space-between">
                                        <Text as="span" className="!text-gray-600" titleText="Tổng cộng:" />
                                        <Text as="span" size="lg" fontWeight="semibold" className="!text-gray-900" titleText={formatCurrency(orderInfo?.totalPrice)} />
                                    </Flex>
                                </Box>
                            </Box>
                        </Box>
                    </Flex>
                </>
            )}
        </Flex>
    );
};

export { OrderDetail };
