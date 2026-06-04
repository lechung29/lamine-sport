/** @format */

import React from "react";
import { Table, Tag, Button, Empty, Tooltip, Flex } from "antd";
import { FaEye } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import type { ColumnsType } from "antd/es/table";
import { BaseButton, Box, Container, Image, TableShimmer, Text } from "@/components";
import { Dialog } from "@/components";
import { IOrder, IOrderDetail, IOrderPayment, OrderStatus, PaymentStatus } from "@/types/orders";
import { OrderService } from "@/services/order/OrderService";
import { IResponseStatus } from "@/types";
import { formatDate } from "@/config";
import { delayTime, formatCurrency } from "@/utils";
import { useImmerState } from "@/hooks";
import { useNotification } from "@/context";
import { QrPaymentModal } from "../payment";

const getStatusTag = (status: OrderStatus, paymentStatus?: PaymentStatus) => {
    switch (status) {
        case OrderStatus.WaitingConfirm:
            if (paymentStatus === PaymentStatus.PendingPayment) {
                return <Tag color="orange">{"Chờ thanh toán"}</Tag>;
            }
            return <Tag color="orange">{"Đang chờ xác nhận"}</Tag>;
        case OrderStatus.Processing:
            return <Tag color="blue">{"Đang xử lý"}</Tag>;
        case OrderStatus.Delivered:
            return <Tag color="green">{"Đã giao"}</Tag>;
        case OrderStatus.Cancel:
            return <Tag color="red">{"Đã hủy"}</Tag>;
        default:
            return <Tag>{status}</Tag>;
    }
};

const getPaymentMethod = (paymentMethod: IOrderPayment) => {
    switch (paymentMethod) {
        case IOrderPayment.COD:
            return <Tag color="blue">{"Thanh toán khi nhận hàng"}</Tag>;
        case IOrderPayment.Transfer:
            return <Tag color="green">{"Chuyển khoản"}</Tag>;
        default:
            return <Tag color="green">{"Chuyển khoản"}</Tag>;
    }
};

interface IUserOrdersState {
    isLoading: boolean;
    orders: IOrderDetail[];
    isConfirmCancelOrderOpen: boolean;
    orderToCancel: string | null;
    isOrderDetailsOpen: boolean;
    selectedOrder: IOrderDetail | null;
    isCollapsed: boolean;
    isOpenPaymentModal: boolean;
}

const initialState: IUserOrdersState = {
    isLoading: true,
    orders: [],
    isConfirmCancelOrderOpen: false,
    orderToCancel: null,
    isOrderDetailsOpen: false,
    selectedOrder: null,
    isCollapsed: true,
    isOpenPaymentModal: false,
};

const UserOrders: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<IUserOrdersState>(initialState);
    const [dependencyReload, setDependencyReload] = React.useState(false);
    const { isLoading, orders, isConfirmCancelOrderOpen, orderToCancel, isOrderDetailsOpen, selectedOrder, isCollapsed, isOpenPaymentModal } = state;
    const notify = useNotification();
    const showOrderDetails = (orderCode: string) => {
        const order = orders.find((o) => o.orderCode === orderCode);
        if (order) {
            setState({ selectedOrder: order, isOrderDetailsOpen: true });
        }
    };

    const handleCloseDetailsModal = () => {
        setState({ selectedOrder: null, isOrderDetailsOpen: false, isCollapsed: true });
    };

    const getMyOrders = async () => {
        setState({ isLoading: true });
        const data = await OrderService.getUserOrder();
        if (data.status === IResponseStatus.Success) {
            setState({ orders: data.data! });
        }
        setState({ isLoading: false });
    };

    React.useEffect(() => {
        getMyOrders();
    }, [dependencyReload]);

    const cancelOrder = async () => {
        try {
            const data = await OrderService.cancelOrder(orderToCancel!);
            if (data.status === IResponseStatus.Success) {
                notify.success(data.message);
            } else {
                notify.error(data.message);
            }
        } catch (error) {
            notify.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
        } finally {
            handleCloseCancelModal();
            await getMyOrders();
        }
    };

    const handleOpenCancelModal = (orderId: string) => {
        setState({ orderToCancel: orderId, isConfirmCancelOrderOpen: true });
    };

    const handleCloseCancelModal = () => {
        setState({ orderToCancel: null, isConfirmCancelOrderOpen: false });
    };

    const columns: ColumnsType<IOrder> = [
        {
            title: "Mã Đơn Hàng",
            dataIndex: "orderCode",
            key: "orderCode",
        },
        {
            title: "Ngày Đặt",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt: string) => <>{formatDate(createdAt)}</>,
        },
        {
            title: "Trạng Thái",
            dataIndex: "orderStatus",
            key: "orderStatus",
            render: (status: OrderStatus, record: IOrder) => getStatusTag(status, record.paymentStatus),
        },
        {
            title: "Tổng Tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (total: number) => <div>{formatCurrency(total)}</div>,
        },
        {
            title: "Hành Động",
            key: "action",
            width: 80,
            render: (_, record) => (
                <Flex className="space-x-2!">
                    <Tooltip title="Xem chi tiết">
                        <Button icon={<FaEye />} onClick={() => showOrderDetails(record.orderCode)} className="flex items-center justify-center p-2!" />
                    </Tooltip>
                    {record.orderStatus === OrderStatus.WaitingConfirm && (
                        <Tooltip title="Hủy đơn hàng">
                            <Button icon={<FaXmark />} onClick={() => handleOpenCancelModal(record._id)} className="p-2! bg-red-100! text-red-500! border-none! hover:bg-red-200!" />
                        </Tooltip>
                    )}
                </Flex>
            ),
        },
    ];

    const productsToDisplay = isCollapsed && selectedOrder && selectedOrder.orderItems.length > 3 ? selectedOrder.orderItems.slice(0, 3) : selectedOrder?.orderItems;

    const handleQrPaymentSuccess = async () => {
        notify.success("Thanh toán thành công! Đơn hàng đã được ghi nhận.");
        await delayTime(500);
        setState({ isOpenPaymentModal: false });
        handleCloseDetailsModal();
        setDependencyReload((prev) => !prev);
    };

    const handleQrTimeout = () => {
        notify.error("QR đã hết hạn. Đơn hàng chưa được hoàn tất, vui lòng thanh toán đơn hàng trong trang đơn hàng của bạn để tiếp tục hoặc hủy đơn hàng.");
        setState({ isOpenPaymentModal: false });
    };

    const handleQrClose = async () => {
        setState({ isOpenPaymentModal: false });
        notify.warning("Bạn đã đóng cửa sổ thanh toán QR. Đơn hàng chưa được hoàn tất, vui lòng thanh toán đơn hàng trong trang đơn hàng của bạn để tiếp tục hoặc hủy đơn hàng");
    };
    return (
        <Container className="h-full relative text-[#333]">
            <Text padding={[16, 0, 16, 0]} fontWeight="semibold" size="3xl" textAlign="center" titleText="Đơn hàng của bạn" />
            <Box bgColor="#fff" padding={[16, 16, 16, 16]} className="rounded-xl! border! border-gray-200! shadow-xs! overflow-x-auto! custom-scrollbar">
                {isLoading ? (
                    <Box className="w-full">
                        <table className="min-w-full">
                            <TableShimmer rows={5} />
                        </table>
                    </Box>
                ) : (
                    <Table
                        key="order-list"
                        columns={columns}
                        dataSource={orders}
                        rowKey="orderCode"
                        pagination={{ pageSize: 5 }}
                        className="border-none!"
                        locale={{ emptyText: <Empty description="Không có đơn hàng nào." /> }}
                    />
                )}
            </Box>

            {isConfirmCancelOrderOpen && (
                <Dialog title="Xác nhận hủy đơn hàng" isOpen={isConfirmCancelOrderOpen} onClose={handleCloseCancelModal} onConfirm={cancelOrder} confirmText="Xác nhận hủy" confirmButtonStyle="danger">
                    <Text titleText={`Bạn có chắc chắn muốn hủy đơn hàng ${orderToCancel} không? Hành động này không thể hoàn tác.`} />
                </Dialog>
            )}

            <QrPaymentModal
                open={isOpenPaymentModal}
                qrUrl={selectedOrder?.qrUrl!}
                orderCode={selectedOrder?.orderCode!}
                transferContent={selectedOrder?.transferContent!}
                totalPrice={selectedOrder?.totalPrice!}
                bankInfo={selectedOrder?.bankInfo}
                onSuccess={handleQrPaymentSuccess}
                onTimeout={handleQrTimeout}
                onClose={handleQrClose}
            />

            <Dialog title={`Chi tiết đơn hàng: ${selectedOrder?.orderCode}`} isOpen={isOrderDetailsOpen} onClose={handleCloseDetailsModal} withoutFooter>
                {selectedOrder && (
                    <Box className="space-y-4!">
                        <Flex align="center" justify="space-between">
                            <Box>
                                <Text margin={[0, 0, 8, 0]} fontWeight="semibold" color="#6a7282" titleText="Ngày đặt hàng" />
                                <Text
                                    fontWeight="medium"
                                    size="sm"
                                    color="#1e2939"
                                    padding={[4, 8, 4, 8]}
                                    className="inline-block bg-gray-200 rounded-md!"
                                    titleText={formatDate(selectedOrder?.createdAt)}
                                />
                            </Box>
                            <Box>
                                <Text margin={[0, 0, 8, 0]} fontWeight="semibold" color="#6a7282" titleText="Phương thức thanh toán" />
                                {getPaymentMethod(selectedOrder.paymentMethod)}
                            </Box>
                        </Flex>
                        <Flex align="center" justify="space-between">
                            <Box>
                                <Text margin={[0, 0, 8, 0]} fontWeight="semibold" color="#6a7282" titleText="Trạng thái" />
                                {getStatusTag(selectedOrder.orderStatus, selectedOrder.paymentStatus)}
                            </Box>
                            {selectedOrder.qrUrl && <BaseButton className="w-32.5" displayText="Thanh toán" onClick={() => setState({ isOpenPaymentModal: true })} />}
                        </Flex>
                        <Box className="space-y-3! max-h-[300px] overflow-y-auto custom-scrollbar">
                            <Text margin={[0, 0, 8, 0]} fontWeight="semibold" color="#6a7282" titleText="Các sản phẩm" />
                            {productsToDisplay?.map((item) => (
                                <Box
                                    key={item.product._id}
                                    padding={[12, 12, 12, 12]}
                                    className="flex flex-col space-y-3! bg-gray-50 rounded-md! min-[500px]:flex-row min-[500px]:justify-between min-[500px]:items-center"
                                >
                                    <Flex align="flex-start" className="space-x-4! w-full min-[500px]:w-1/2">
                                        <Image
                                            src={item.product.productColors.find((color) => color.value === item.selectedColor)?.images[0].url}
                                            alt={item.product.productName}
                                            objectFit="cover"
                                            rounded="md"
                                            height={64}
                                            width={64}
                                        />
                                        <Box className="flex-1">
                                            <Text fontWeight="medium" color="#333" size="base" titleText={item.product.productName} />
                                            <Text size="sm" color="#6a7282" titleText={`Màu: ${item.selectedColor} ${item.selectedSize ? `| Size: ${item.selectedSize}` : ""}`} />
                                            <Text margin={[4, 0, 0, 0]} size="sm" color="#6a7282" titleText={formatCurrency(item.unitPrice)} />
                                        </Box>
                                    </Flex>
                                    <Flex justify="space-between" className="w-full min-[500px]:w-1/2">
                                        <Box className="text-left min-[500px]:text-center! min-[500px]:w-1/2">
                                            <Text color="#6a7282" size="base" titleText={`Số lượng: ${item.quantity}`} />
                                        </Box>
                                        <Box className="text-right min-[500px]:text-center! min-[500px]:w-1/2">
                                            <Text fontWeight="bold" color="#fb2c36" size="base" titleText={formatCurrency(item.quantity * item.unitPrice)} />
                                        </Box>
                                    </Flex>
                                </Box>
                            ))}
                            {selectedOrder.orderItems.length > 3 && (
                                <Button type="link" onClick={() => setState({ isCollapsed: !isCollapsed })} className="w-full p-0! text-sm font-semibold! text-[#002d3a]!">
                                    {isCollapsed ? `Xem thêm ${selectedOrder.orderItems.length - 3} sản phẩm` : "Thu gọn"}
                                </Button>
                            )}
                        </Box>

                        <Box margin={[16, 0, 0, 0]} padding={[16, 0, 0, 0]} className="border-t! border-gray-200!">
                            <Flex align="center" justify="space-between">
                                <Text fontWeight="semibold" color="#6a7282" size="sm" titleText="Tạm tính" />
                                <Text fontWeight="bold" color="gray" size="base" titleText={formatCurrency(selectedOrder.productsFees)} />
                            </Flex>
                            <Flex align="center" justify="space-between">
                                <Text fontWeight="semibold" color="#6a7282" size="sm" titleText="Phí giao hàng" />
                                <Text fontWeight="bold" color="gray" size="base" titleText={formatCurrency(selectedOrder.shippingFees)} />
                            </Flex>
                            <Flex align="center" justify="space-between">
                                <Text fontWeight="semibold" color="#6a7282" size="sm" titleText="Giảm giá" />
                                <Text fontWeight="bold" color="#1677ff" size="base" titleText={`- ${formatCurrency(selectedOrder.discountValue)}`} />
                            </Flex>
                            <Flex align="center" justify="space-between">
                                <Text fontWeight="semibold" color="#6a7282" size="sm" titleText="Tổng tiền" />
                                <Text fontWeight="bold" color="#fb2c36" size="xl" titleText={formatCurrency(selectedOrder.totalPrice)} />
                            </Flex>
                        </Box>
                    </Box>
                )}
            </Dialog>
        </Container>
    );
};

export { UserOrders };
