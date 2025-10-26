/** @format */

import React from "react";
import { Button, Input, Select, Table, Tag, Pagination, Modal, DatePicker, InputNumber, Flex, Spin, Tooltip, Typography, Empty } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, TagsOutlined, LoadingOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "./CouponManagement.scss";

import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

import { BaseButton, Box, Container, FilterButton, Text as TextBase } from "@/components";
import { CouponStatus, CouponValueType, ICouponData, IFilterValueItem, IResponseStatus } from "@/types";
import { useImmerState } from "@/hooks";
import { couponAdminFilterOptions, delayTime } from "@/utils";
import { useNotification } from "@/context";
import { CouponService } from "@/services";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface ICouponFilterValue {
    valueType?: number[];
    couponStatus?: number;
}

interface ICouponManagementState {
    // Basic state
    coupons: ICouponData[];
    searchText: string;
    searchValue: string;
    totalCounts: number;
    currentPage: number;
    activeFilters: ICouponFilterValue;

    // Add coupon form state
    isOpenAddCouponDialog: boolean;
    couponCode: string;
    discountType: CouponValueType;
    discountValue: number | null;
    maxValue: number | null;
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    couponQuantity: number | null;
    isAddingCoupon: boolean;
    isDeletingCoupon: boolean;
    isLoading: boolean;

    isOpenDeleteDialog: boolean;
    editingCoupon: ICouponData | null;
    deletingCoupon: ICouponData | null;
}

const initialState: ICouponManagementState = {
    coupons: [],
    searchText: "",
    searchValue: "",
    totalCounts: 0,
    currentPage: 1,
    activeFilters: {},
    isOpenAddCouponDialog: false,
    couponCode: "",
    discountType: CouponValueType.Percent,
    discountValue: null,
    maxValue: null,
    startDate: null,
    endDate: null,
    couponQuantity: null,
    isAddingCoupon: false,
    isLoading: false,
    isDeletingCoupon: false,
    isOpenDeleteDialog: false,
    deletingCoupon: null,
    editingCoupon: null,
};
const CouponManagement: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<ICouponManagementState>(initialState);
    const {
        couponCode,
        couponQuantity,
        coupons,
        currentPage,
        totalCounts,
        discountType,
        discountValue,
        maxValue,
        endDate,
        searchText,
        searchValue,
        isOpenAddCouponDialog,
        startDate,
        isAddingCoupon,
        isDeletingCoupon,
        isLoading,
        activeFilters,
        isOpenDeleteDialog,
        deletingCoupon,
        editingCoupon,
    } = state;
    const notify = useNotification();
    const ITEMS_PER_PAGE = 10;

    const getCouponList = async () => {
        try {
            setState({ isLoading: true });
            const data = await CouponService.getAllCoupon({
                filters: activeFilters,
                search: searchValue,
                limit: ITEMS_PER_PAGE,
                page: currentPage,
            });
            if (data.status === IResponseStatus.Error) {
                setState({ coupons: [], totalCounts: 0 });
            } else {
                setState({ coupons: data.data?.coupons, totalCounts: data.data?.totalCounts });
            }
        } catch (error) {
            setState({ coupons: [], totalCounts: 0 });
        } finally {
            setState({ isLoading: false });
        }
    };
    React.useEffect(() => {
        getCouponList();
    }, [searchValue, activeFilters]);

    const getStatusColor = (status: CouponStatus): string => {
        const colors: Record<CouponStatus, string> = {
            1: "green",
            2: "red",
            3: "blue",
            4: "volcano",
        };
        return colors[status] || "default";
    };

    const renderStatus = (status: CouponStatus): string => {
        const text: Record<CouponStatus, string> = {
            1: "Đang hiệu lực",
            2: "Hết hạn",
            3: "Lên lịch",
            4: "Hết lượt sử dụng",
        };
        return text[status];
    };

    const resetForm = (): void => {
        setState({
            couponCode: "",
            discountType: CouponValueType.Percent,
            discountValue: null,
            maxValue: null,
            startDate: null,
            endDate: null,
            couponQuantity: null,
        });
    };

    const handleDeleteCoupon = async () => {
        try {
            setState({ isDeletingCoupon: true });
            const data = await CouponService.deleteCoupon(deletingCoupon?.couponCode!);
            setState({ isDeletingCoupon: false });
            if (data.status === IResponseStatus.Error) {
                notify.error(data.message);
                await delayTime(1000).then(() => setState({ isOpenDeleteDialog: false, deletingCoupon: null }));
            } else {
                notify.success(data.message);
                await delayTime(1000).then(() => setState({ isOpenDeleteDialog: false, deletingCoupon: null }));
                await getCouponList();
            }
        } catch (error) {
            setState({ isOpenDeleteDialog: false, deletingCoupon: null });
        }
    };

    const handleAddUpdateCoupon = async (): Promise<void> => {
        if (!couponCode.trim() || discountValue === null || startDate === null || endDate === null || couponQuantity === null) {
            notify.error("Vui lòng điền đầy đủ tất cả các trường bắt buộc của mã giảm giá");
            return;
        }
        const now = dayjs(new Date());
        if (endDate.isBefore(now)) {
            notify.error("Mã giảm giá mới phải có ngày hết hạn lớn hơn thời điểm hiện tại");
            return;
        }
        try {
            setState({ isAddingCoupon: true });
            const promise = editingCoupon ? CouponService.updateCoupon : CouponService.createCoupon;
            const data = await promise({
                couponCode: couponCode.trim(),
                discountType,
                discountValue,
                maxValue,
                startDate: startDate.toDate(),
                endDate: endDate.toDate(),
                couponQuantity,
            });
            setState({ isAddingCoupon: false });
            if (data.status === IResponseStatus.Error) {
                notify.error(data.message);
            } else {
                notify.success(data.message);
                await delayTime(1000).then(() => handleCancelAddEditDialog());
                await getCouponList();
            }
        } catch (error) {
            notify.error("Có lỗi xảy ra khi thêm mã giảm giá");
        }
    };

    const handleAddClick = (): void => {
        setState({ isOpenAddCouponDialog: true });
    };

    const handleOpenEditDialog = (coupon: ICouponData): void => {
        setState({
            editingCoupon: coupon,
            isOpenAddCouponDialog: true,
            couponCode: coupon.couponCode,
            discountType: coupon.valueType,
            discountValue: coupon.value,
            maxValue: coupon.maxValue,
            startDate: dayjs(coupon.startDate),
            endDate: dayjs(coupon.endDate),
            couponQuantity: coupon.couponQuantity,
        });
    };

    const handleCancelAddEditDialog = () => {
        setState({ isOpenAddCouponDialog: false, editingCoupon: null });
        resetForm();
    };

    const handleOpenDeleteDialog = (coupon: ICouponData): void => {
        setState({ deletingCoupon: coupon, isOpenDeleteDialog: true });
    };

    const handleCancelDeleteDialog = (): void => {
        setState({ deletingCoupon: null, isOpenDeleteDialog: false });
    };

    const handleSearch = (value) => {
        setState({ searchValue: value });
    };

    const handleApplyFilters = React.useCallback((filters: IFilterValueItem) => {
        setState({ activeFilters: filters });
    }, []);

    const columns: ColumnsType<ICouponData> = [
        {
            title: "Mã phiếu giảm giá",
            dataIndex: "couponCode",
            key: "couponCode",
            width: 140,
            sorter: (a, b) => a.couponCode.localeCompare(b.couponCode),
            showSorterTooltip: false,
            render: (text: string) => (
                <Tooltip title={text} placement="topLeft">
                    <Text ellipsis={true} className="!font-mono !text-gray-700" style={{ maxWidth: 120 }}>
                        {text}
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: "Giá trị",
            key: "value",
            width: 100,
            render: (_, record: ICouponData) => (
                <TextBase fontWeight="semibold" className="!text-gray-900">
                    {record.valueType === CouponValueType.Percent ? `${record.value}%` : `${record.value}₫`}
                </TextBase>
            ),
        },
        {
            title: "Trạng thái",
            key: "status",
            width: 120,
            render: (_, record: ICouponData) => {
                const status = renderStatus(record.couponStatus);
                return (
                    <Tag color={getStatusColor(record.couponStatus)} className="!px-3 !py-1 !rounded-full text-xs font-medium">
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: "Bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            width: 120,
            render: (text: string) => <TextBase className="!text-gray-600">{dayjs(text).format("DD-MM-YYYY")}</TextBase>,
        },
        {
            title: "Kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            width: 120,
            render: (text: string) => <TextBase className="!text-gray-600">{dayjs(text).format("DD-MM-YYYY")}</TextBase>,
        },
        {
            title: "Số lượt sử dụng",
            key: "used",
            width: 130,
            render: (_: any, record: ICouponData) => (
                <TextBase className="!text-gray-600">
                    {record.usedQuantity} / {record.couponQuantity}
                </TextBase>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            width: 100,
            render: (_, record: ICouponData) => (
                <Flex className="!space-x-2">
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined />} size="small" onClick={() => handleOpenEditDialog(record)} disabled={isLoading} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button type="text" danger icon={<DeleteOutlined />} size="small" onClick={() => handleOpenDeleteDialog(record)} disabled={isLoading} />
                    </Tooltip>
                </Flex>
            ),
        },
    ];

    return (
        <Flex vertical className="bg-transparent flex-grow min-h-full">
            <Box margin={[0, 0, 24, 0]}>
                <TextBase className="!text-gray-900" size="2xl" fontWeight="bold" titleText="Quản lý mã giảm giá" margin={[0, 0, 16, 0]} />
            </Box>

            <Container bgColor="white" className="flex-grow !rounded-lg !shadow-sm" padding={[24, 24, 24, 24]}>
                <Flex align="center" justify="space-between" wrap="wrap" gap="middle" className="!mb-6">
                    <Input.Search
                        placeholder="Tìm kiếm theo tên hoặc mã phiếu"
                        allowClear
                        onSearch={handleSearch}
                        value={searchText}
                        onChange={(e) => setState({ searchText: e.target.value })}
                        className="!w-full max-w-[300px]"
                        size="middle"
                        disabled={isLoading}
                    />

                    <Flex align="center" gap="small">
                        <FilterButton disabled={isLoading} onApplyFilters={handleApplyFilters} currentFilters={activeFilters} availableFilters={couponAdminFilterOptions} />
                        <BaseButton
                            padding={[6, 16, 6, 16]}
                            radius="md"
                            onClick={handleAddClick}
                            className="disabled:!bg-gray-400"
                            disabled={isLoading}
                            displayText={
                                <React.Fragment>
                                    <PlusOutlined />
                                    {"Thêm coupon"}
                                </React.Fragment>
                            }
                        />
                    </Flex>
                </Flex>

                {isLoading ? (
                    <Flex align="center" justify="center" className="min-h-[300px]">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                    </Flex>
                ) : (
                    <React.Fragment>
                        <Table<ICouponData>
                            columns={columns}
                            dataSource={coupons.map((c) => ({ ...c, key: c.id }))}
                            rowKey="id"
                            pagination={false}
                            className="w-full !mb-8"
                            scroll={{ x: coupons.length > 0 ? "max-content" : undefined }}
                            locale={{ emptyText: <Empty description="Không có mã giảm giá nào." /> }}
                        />
                        {coupons.length > 0 && (
                            <Flex justify="end">
                                <Pagination
                                    current={currentPage}
                                    total={totalCounts}
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
            {isOpenAddCouponDialog && (
                <Modal
                    title={
                        <React.Fragment>
                            <TagsOutlined className="!mr-2" />
                            {editingCoupon ? "Chỉnh sửa phiếu giảm giá" : "Thêm phiếu giảm giá mới"}
                        </React.Fragment>
                    }
                    open={isOpenAddCouponDialog}
                    onCancel={handleCancelAddEditDialog}
                    footer={null}
                    width={500}
                    destroyOnHidden={true}
                >
                    <Container margin={[16, 0, 0, 0]} className="!space-y-4">
                        <Box>
                            <TextBase as="label" margin={[0, 0, 8, 0]} fontWeight="medium" className="block" titleText="Mã phiếu giảm giá" />
                            <Input
                                disabled={!!editingCoupon}
                                value={couponCode}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setState({ couponCode: e.target.value.toUpperCase() });
                                }}
                                placeholder="Nhập mã phiếu giảm giá"
                            />
                        </Box>
                        <Box>
                            <TextBase as="label" margin={[0, 0, 8, 0]} fontWeight="medium" className="block" titleText="Giá trị giảm giá" />
                            <Flex gap="small">
                                <Select<CouponValueType> value={discountType} onChange={(value: CouponValueType) => setState({ discountType: value, discountValue: null })} className="!w-2/5">
                                    <Option value={CouponValueType.Percent}>Phần trăm</Option>
                                    <Option value={CouponValueType.FixedAmount}>Số tiền cố định</Option>
                                </Select>
                                <InputNumber
                                    type="number"
                                    value={discountValue}
                                    onChange={(value: number | null) => {
                                        if (value) {
                                            if (discountType === CouponValueType.Percent && value >= 0 && value <= 99) {
                                                setState({ discountValue: value });
                                            } else if (discountType === CouponValueType.FixedAmount && value >= 0) {
                                                setState({ discountValue: value });
                                            }
                                        } else {
                                            setState({ discountValue: null });
                                        }
                                    }}
                                    className="!w-3/5"
                                    suffix={discountType === CouponValueType.Percent ? "%" : "VNĐ"}
                                    max={discountValue === CouponValueType.Percent ? 100 : undefined}
                                    min={0}
                                    placeholder="Nhập giá trị"
                                    parser={(value: any) =>
                                        value
                                            .toString()
                                            .replace(/%|₫/g, "")
                                            .replace(/[^0-9]/g, "")
                                    }
                                />
                            </Flex>
                        </Box>
                        {discountType === CouponValueType.Percent && (
                            <Box>
                                <TextBase as="label" margin={[0, 0, 8, 0]} fontWeight="medium" className="block" titleText="Giảm tối đa" />
                                <InputNumber
                                    type="number"
                                    value={maxValue}
                                    onChange={(value: number | null) => {
                                        if (value && value > 0) {
                                            setState({ maxValue: value });
                                        } else {
                                            setState({ maxValue: null });
                                        }
                                    }}
                                    className="!w-full"
                                    suffix="VNĐ"
                                    min={0}
                                    placeholder="Nhập số tiền tối đa có thể giảm (không yêu cầu)"
                                    parser={(value: any) =>
                                        value
                                            .toString()
                                            .replace(/%|₫/g, "")
                                            .replace(/[^0-9]/g, "")
                                    }
                                />
                            </Box>
                        )}
                        <Box>
                            <TextBase as="label" margin={[0, 0, 8, 0]} fontWeight="medium" className="block" titleText="Khoảng thời gian hiệu lực" />
                            <RangePicker
                                value={[startDate, endDate]}
                                onChange={(dates: [Dayjs | null, Dayjs | null] | null) => {
                                    setState({ startDate: dates?.[0], endDate: dates?.[1] });
                                }}
                                className="!w-full"
                                format="DD-MM-YYYY"
                            />
                        </Box>

                        <Box>
                            <TextBase as="label" margin={[0, 0, 8, 0]} fontWeight="medium" className="block" titleText="Số lượng mã giảm giá" />
                            <InputNumber
                                type="number"
                                value={couponQuantity}
                                onChange={(value: number | null) => {
                                    if (value && value >= 1) {
                                        setState({ couponQuantity: value });
                                    } else {
                                        setState({ couponQuantity: null });
                                    }
                                }}
                                className="!w-full"
                                min={1}
                                placeholder="Nhập số lượt sử dụng tối đa"
                            />
                        </Box>
                        <Flex justify="flex-end" className="!space-x-2">
                            <Button onClick={handleCancelAddEditDialog} disabled={isAddingCoupon} className="!px-4 !py-2">
                                Hủy
                            </Button>
                            <Button type="primary" loading={isAddingCoupon} onClick={handleAddUpdateCoupon} className="!bg-[#002d3a] hover:!bg-[#a2ff00] hover:!text-[#333] !px-4 !py-2">
                                {editingCoupon ? "Cập nhật" : "Thêm"}
                            </Button>
                        </Flex>
                    </Container>
                </Modal>
            )}

            {isOpenDeleteDialog && (
                <Modal title="Xóa mã giảm giá" open={isOpenDeleteDialog} onCancel={handleCancelDeleteDialog} footer={null} centered>
                    <Container margin={[16, 0, 0, 0]}>
                        <Box padding={[16, 0, 16, 0]}>
                            <TextBase size="base">
                                Bạn có chắc chắn muốn xóa phiếu giảm giá "
                                <TextBase as="span" fontWeight="bold">
                                    {deletingCoupon!.couponCode}
                                </TextBase>
                                "?
                            </TextBase>
                            <TextBase size="sm" className="text-gray-500" titleText="Hành động này không thể hoàn tác." />
                        </Box>

                        <Flex justify="flex-end" className="!space-x-2">
                            <Button onClick={handleCancelDeleteDialog} disabled={isDeletingCoupon} className="!px-4 !py-2">
                                Hủy
                            </Button>
                            <Button type="primary" loading={isDeletingCoupon} onClick={handleDeleteCoupon} className="!bg-red-600 !border-red-600 hover:!bg-red-700 !px-4 !py-2">
                                Xóa
                            </Button>
                        </Flex>
                    </Container>
                </Modal>
            )}
        </Flex>
    );
};

export { CouponManagement };
