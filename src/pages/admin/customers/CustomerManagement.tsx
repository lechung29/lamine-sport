/** @format */

import React from "react";
import { Table, Input, Button, Space, Typography, Flex, Spin, Tag, Tooltip, Modal, Descriptions, Pagination, Empty } from "antd";
import type { TableProps } from "antd";
import { LoadingOutlined, EyeOutlined, LockOutlined, UnlockOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Box, Container, FilterButton, Image, Text as TextBase } from "@/components";
import { UserService } from "@/services";
import { ICustomerStatus, IFilterValueItem, IResponseStatus, IUserAdvanceInfo, IUserInformation } from "@/types";
import { useImmerState } from "@/hooks";
import { customerAdminFilterOptions, delayTime, formatCurrency } from "@/utils";
import { useNotification } from "@/context";

const { Text } = Typography;

interface ICustomerFilterValues {
    status?: string[];
}

interface ICustomerManagementState {
    searchValue: string;
    customers: (IUserInformation & IUserAdvanceInfo)[];
    searchText: string;
    currentPage: number;
    customerCounts: number;
    isLoading: boolean;
    activeFilters: ICustomerFilterValues;
    isOpenDeleteCustomerDialog: boolean;
    isOpenLockedCustomerDialog: boolean;
    isOpenViewCustomerInfoDialog: boolean;
    selectedCustomer?: IUserInformation & IUserAdvanceInfo;
    isUpdatingStatus: boolean;
    isDeletingCustomer: boolean;
}

const initialState: ICustomerManagementState = {
    searchValue: "",
    searchText: "",
    currentPage: 1,
    customerCounts: 0,
    customers: [],
    isLoading: false,
    activeFilters: {},
    isOpenDeleteCustomerDialog: false,
    isOpenLockedCustomerDialog: false,
    isOpenViewCustomerInfoDialog: false,
    isUpdatingStatus: false,
    isDeletingCustomer: false,
};

const CustomerManagement: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<ICustomerManagementState>(initialState);
    const {
        searchValue,
        currentPage,
        customerCounts,
        customers,
        searchText,
        isLoading,
        activeFilters,
        isOpenDeleteCustomerDialog,
        isOpenLockedCustomerDialog,
        isOpenViewCustomerInfoDialog,
        isUpdatingStatus,
        isDeletingCustomer,
        selectedCustomer,
    } = state;
    const notify = useNotification();
    const ITEMS_PER_PAGE = 10;

    const loadCustomers = async () => {
        try {
            setState({ isLoading: true });
            const data = await UserService.getAllCustomers({
                search: searchValue,
                filters: activeFilters,
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            });
            if (data.status === IResponseStatus.Error) {
                setState({
                    customers: [],
                    customerCounts: 0,
                });
            } else {
                setState({
                    customers: data.data?.customers,
                    customerCounts: data.data?.totalCounts,
                });
            }
        } catch (error) {
            setState({
                customers: [],
                customerCounts: 0,
            });
        } finally {
            setState({ isLoading: false });
        }
    };

    React.useEffect(() => {
        loadCustomers();
    }, [searchValue, activeFilters]);

    const handleSearch = (value) => {
        setState({ searchValue: value });
    };

    const handleApplyFilters = React.useCallback((filters: IFilterValueItem) => {
        setState({ activeFilters: filters, currentPage: 1 });
    }, []);

    const getStatusColor = (status: IUserInformation["status"]): string => {
        const colors: Record<IUserInformation["status"], string> = {
            1: "green",
            2: "red",
        };
        return colors[status] || "default";
    };

    const renderStatus = (status: IUserInformation["status"]): string => {
        const text: Record<IUserInformation["status"], string> = {
            1: "Hoạt động",
            2: "Khóa",
        };
        return text[status];
    };

    const handleOpenViewCustomerInfoDialog = (customer: IUserInformation) => {
        setState({
            selectedCustomer: customer,
            isOpenViewCustomerInfoDialog: true,
        });
    };

    const handleCloseViewCustomerInfoDialog = () => {
        setState({
            selectedCustomer: undefined,
            isOpenViewCustomerInfoDialog: false,
        });
    };

    // const handleOpenDeleteCustomerDialog = (customer: IUserInformation) => {
    //     setState({
    //         selectedCustomer: customer,
    //         isOpenDeleteCustomerDialog: true,
    //     });
    // };

    const handleDeleteCustomer = async () => {
        try {
            setState({ isDeletingCustomer: true });
            const data = await UserService.deleteCustomer(selectedCustomer?._id!);
            setState({ isDeletingCustomer: false });
            if (data.status === IResponseStatus.Error) {
                notify.error(data.message);
                await delayTime(1000).then(() => setState({ isOpenDeleteCustomerDialog: false, selectedCustomer: undefined }));
            } else {
                notify.success(data.message);
                await delayTime(1000).then(() => setState({ isOpenDeleteCustomerDialog: false, selectedCustomer: undefined }));
                await loadCustomers();
            }
        } catch (error) {
            setState({ isOpenDeleteCustomerDialog: false, selectedCustomer: undefined });
        }
    };

    const handleOpenLockedCustomerDialog = (customer: IUserInformation) => {
        setState({
            selectedCustomer: customer,
            isOpenLockedCustomerDialog: true,
        });
    };

    const handleChangeCustomerStatus = async () => {
        try {
            setState({ isUpdatingStatus: true });
            const newStatus = selectedCustomer?.status === ICustomerStatus.Active ? ICustomerStatus.Locked : ICustomerStatus.Active;
            const data = await UserService.updateCustomerStatus(selectedCustomer?._id!, newStatus);
            setState({ isUpdatingStatus: false });
            if (data.status === IResponseStatus.Error) {
                notify.error(data.message);
                await delayTime(1000).then(() => setState({ isOpenLockedCustomerDialog: false, selectedCustomer: undefined }));
            } else {
                notify.success(data.message);
                await delayTime(1000).then(() => setState({ isOpenLockedCustomerDialog: false, selectedCustomer: undefined }));
                await loadCustomers();
            }
        } catch (error) {
            setState({ isOpenLockedCustomerDialog: false, selectedCustomer: undefined });
        }
    };

    const columns: TableProps<IUserInformation>["columns"] = [
        {
            title: "ID Khách hàng",
            dataIndex: "_id",
            key: "_id",
            width: 100,
            showSorterTooltip: false,
            render: (text: string) => (
                <Tooltip title={text} placement="topLeft">
                    <Text ellipsis={true} className="text-gray-900" style={{ maxWidth: 100 }}>
                        {text}
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: "Tên khách hàng",
            key: "displayName",
            sorter: (a, b) => a.displayName.localeCompare(b.displayName),
            showSorterTooltip: false,
            width: 160,
            render: (info: IUserInformation) => {
                return (
                    <Flex align="center" className="!space-x-3">
                        <Image src={info.avatar} alt={info.displayName} objectFit="cover" height={32} width={32} className="!rounded-full" />
                        <Tooltip title={info.displayName} placement="topLeft">
                            <Text ellipsis={true} className="font-semibold text-gray-900" style={{ maxWidth: 120 }}>
                                {info.displayName}
                            </Text>
                        </Tooltip>
                    </Flex>
                );
            },
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 180,
            render: (text: string) => (
                <Tooltip title={text} placement="topLeft">
                    <TextBase as="span" className="block truncate" titleText={text} />
                </Tooltip>
            ),
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: 120,
            render: (text: string) => (
                <Tooltip title={text} placement="topLeft">
                    <TextBase as="span" className="block truncate" titleText={text} />
                </Tooltip>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 100,
            render: (status: IUserInformation["status"]) => <Tag color={getStatusColor(status)}>{renderStatus(status)}</Tag>,
        },
        {
            title: "Hành động",
            key: "actions",
            width: 140,
            render: (_, customer) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" icon={<EyeOutlined />} disabled={isLoading} onClick={() => handleOpenViewCustomerInfoDialog(customer)} />
                    </Tooltip>
                    <Tooltip title={customer.status === ICustomerStatus.Active ? "Khóa người dùng" : "Mở khóa người dùng"}>
                        <Button
                            type="text"
                            icon={customer.status === ICustomerStatus.Active ? <LockOutlined /> : <UnlockOutlined />}
                            onClick={() => handleOpenLockedCustomerDialog(customer)}
                            danger={customer.status === ICustomerStatus.Active}
                            disabled={isLoading}
                        />
                    </Tooltip>
                    {/* <Tooltip title="Xóa người dùng">
                        <Button type="text" icon={<DeleteOutlined />} onClick={() => handleOpenDeleteCustomerDialog(customer)} danger disabled={isLoading} />
                    </Tooltip> */}
                </Space>
            ),
        },
    ];

    return (
        <Flex vertical className="bg-transparent flex-grow min-h-full">
            <Box margin={[0, 0, 24, 0]}>
                <TextBase className="!text-gray-900" size="2xl" fontWeight="bold" titleText="Quản lý khách hàng" margin={[0, 0, 16, 0]} />
            </Box>

            <Container bgColor="white" className="flex-grow !rounded-lg !shadow-sm" padding={[24, 24, 24, 24]}>
                <Flex align="center" justify="space-between" wrap="wrap" gap="middle" className="!mb-6">
                    <Flex align="center" justify="space-between" className="flex-grow !w-full sm:!w-auto" gap={16}>
                        <Input.Search
                            placeholder="Tìm kiếm theo tên, ID, hoặc email"
                            allowClear
                            onSearch={handleSearch}
                            value={searchText}
                            onChange={(e) => setState({ searchText: e.target.value })}
                            className="!w-full max-w-[300px]"
                            size="middle"
                            disabled={isLoading}
                        />
                        <FilterButton disabled={isLoading} onApplyFilters={handleApplyFilters} currentFilters={activeFilters} availableFilters={customerAdminFilterOptions} />
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
                            dataSource={customers.map((c) => ({ ...c, key: c._id }))}
                            rowKey="id"
                            pagination={false}
                            className="w-full !mb-8"
                            scroll={{ x: customers.length > 0 ? "max-content" : undefined }}
                            locale={{ emptyText: <Empty description="Không có người dùng nào." /> }}
                        />
                        {customers.length > 0 && (
                            <Flex justify="end">
                                <Pagination
                                    current={currentPage}
                                    total={customerCounts}
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

            {isOpenLockedCustomerDialog && (
                <Modal
                    title="Thay đổi trạng thái khách hàng"
                    open={isOpenLockedCustomerDialog}
                    onCancel={() => setState({ isOpenLockedCustomerDialog: false, selectedCustomer: undefined })}
                    footer={null}
                    centered
                    className="!rounded-lg"
                >
                    <Container margin={[16, 0, 0, 0]}>
                        <TextBase
                            className="text-gray-800 block"
                            titleText={`Bạn có chắc chắn muốn ${selectedCustomer?.status === ICustomerStatus.Active ? "khóa" : "mở khóa"} tài khoản này?`}
                            margin={[0, 0, 4, 0]}
                        />

                        <Flex justify="flex-end" className="!space-x-2">
                            <Button onClick={() => setState({ isOpenLockedCustomerDialog: false, selectedCustomer: undefined })} disabled={isUpdatingStatus} className="!px-4 !py-2">
                                Hủy
                            </Button>
                            <Button type="primary" loading={isUpdatingStatus} onClick={handleChangeCustomerStatus} className="!bg-red-600 !border-red-600 hover:!bg-red-700 !px-4 !py-2">
                                {selectedCustomer?.status === ICustomerStatus.Active ? "khóa" : "Mở khóa"}
                            </Button>
                        </Flex>
                    </Container>
                </Modal>
            )}

            {isOpenDeleteCustomerDialog && (
                <Modal
                    title="Xóa tài khoản khách hàng"
                    open={isOpenDeleteCustomerDialog}
                    onCancel={() => setState({ isOpenDeleteCustomerDialog: false, selectedCustomer: undefined })}
                    footer={null}
                    centered
                    className="!rounded-lg"
                >
                    <Container margin={[16, 0, 0, 0]}>
                        <TextBase className="text-gray-800 block" titleText="Bạn có chắc chắn muốn xóa tài khoản này?" margin={[0, 0, 4, 0]} />

                        <Flex justify="flex-end" className="!space-x-2">
                            <Button onClick={() => setState({ isOpenDeleteCustomerDialog: false, selectedCustomer: undefined })} disabled={isDeletingCustomer} className="!px-4 !py-2">
                                Hủy
                            </Button>
                            <Button type="primary" loading={isDeletingCustomer} onClick={handleDeleteCustomer} className="!bg-red-600 !border-red-600 hover:!bg-red-700 !px-4 !py-2">
                                Xóa
                            </Button>
                        </Flex>
                    </Container>
                </Modal>
            )}

            {isOpenViewCustomerInfoDialog && (
                <Modal
                    title={
                        <React.Fragment>
                            <UserOutlined className="!mr-2" />
                            <TextBase as="span" titleText={`Chi tiết khách hàng: ${selectedCustomer?.displayName}`} />
                        </React.Fragment>
                    }
                    open={isOpenViewCustomerInfoDialog}
                    onCancel={handleCloseViewCustomerInfoDialog}
                    footer={null}
                    width={700}
                    className="!max-w-[95vw]"
                >
                    {selectedCustomer && (
                        <Descriptions bordered column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }} className="!mt-4">
                            <Descriptions.Item label="ID Khách hàng" span={2}>
                                <Text strong>{selectedCustomer._id}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Tên khách hàng" span={2}>
                                {selectedCustomer.displayName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email" span={1}>
                                {selectedCustomer.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại" span={1}>
                                {selectedCustomer.phoneNumber}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={1}>
                                <Tag color={getStatusColor(selectedCustomer.status)}>{renderStatus(selectedCustomer.status)}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày đăng ký" span={1}>
                                {dayjs(selectedCustomer.createdAt).format("DD-MM-YYYY")}
                            </Descriptions.Item>

                            <Descriptions.Item label="Số lượng đơn hàng" span={2}>
                                {selectedCustomer.totalOrders}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng sản phẩm đã mua" span={2}>
                                {selectedCustomer.totalProducts}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền đã chi" span={2}>
                                <Text strong type="success">
                                    {formatCurrency(selectedCustomer.totalSpent)}
                                </Text>
                            </Descriptions.Item>
                        </Descriptions>
                    )}
                </Modal>
            )}
        </Flex>
    );
};

export { CustomerManagement };
