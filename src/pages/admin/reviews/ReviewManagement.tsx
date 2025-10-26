/** @format */

import React from "react";
import { Button, Input, Table, Rate, Pagination, Modal, Tooltip, Flex, Spin, Typography, Empty } from "antd";
import { DeleteOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import { Box, Container, FilterButton, Image, Text as TextBase } from "@/components";
import { ReviewService } from "@/services";
import { useImmerState } from "@/hooks";
import { IFilterOptionType, IFilterValueItem, IResponseStatus, IReview } from "@/types";
import { useNotification } from "@/context";
import dayjs from "dayjs";
import { TiPin } from "react-icons/ti";
import { RiUnpinFill } from "react-icons/ri";
import TextArea from "antd/es/input/TextArea";
import { DEFAULT_AVATAR } from "@/constants";

const { Text } = Typography;

const reviewAdminFilterOptions: IFilterOptionType[] = [
    {
        id: "rating",
        name: "Đánh giá",
        type: "checkbox" as const,
        options: [
            { label: <span className="!text-yellow-500 text-xl">★★★★★</span>, value: 5 },
            { label: <span className="!text-yellow-500 text-xl">★★★★</span>, value: 4 },
            { label: <span className="!text-yellow-500 text-xl">★★★</span>, value: 3 },
            { label: <span className="!text-yellow-500 text-xl">★★</span>, value: 2 },
            { label: <span className="!text-yellow-500 text-xl">★</span>, value: 1 },
        ],
    },
];

interface IReviewFilterValues {
    rating?: number[];
}

interface IReviewManagementState {
    reviews: IReview[];
    searchValue: string;
    searchText: string;
    currentPage: number;
    reviewCounts: number;
    isLoading: boolean;
    activeFilters: IReviewFilterValues;
    isOpenDeleteModal: boolean;
    reviewToDelete: IReview | null;
    isDeleting: boolean;
    isOpenPinUnpinModal: boolean;
    reviewToPinUnpin: IReview | null;
    isPinningUnpinning: boolean;
    isOpenSendEmailDialog: boolean;
    reviewToSendEmail: IReview | null;
    emailMessage: string;
    emailMessageError: string;
    isSendingEmail: boolean;
}

const initialState: IReviewManagementState = {
    reviews: [],
    searchValue: "",
    searchText: "",
    currentPage: 1,
    reviewCounts: 0,
    isLoading: false,
    activeFilters: {},
    isOpenDeleteModal: false,
    reviewToDelete: null,
    isDeleting: false,
    isOpenPinUnpinModal: false,
    reviewToPinUnpin: null,
    isPinningUnpinning: false,
    isOpenSendEmailDialog: false,
    reviewToSendEmail: null,
    emailMessage: "",
    emailMessageError: "",
    isSendingEmail: false,
};

const ReviewManagement: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<IReviewManagementState>(initialState);
    const {
        activeFilters,
        currentPage,
        isLoading,
        reviewCounts,
        reviews,
        searchText,
        searchValue,
        isOpenDeleteModal,
        reviewToDelete,
        isDeleting,
        isOpenPinUnpinModal,
        isPinningUnpinning,
        reviewToPinUnpin,
        isOpenSendEmailDialog,
        reviewToSendEmail,
        emailMessage,
        emailMessageError,
        isSendingEmail,
    } = state;

    const notify = useNotification();
    const ITEMS_PER_PAGE = 10;

    const getReviewList = async () => {
        try {
            setState({ isLoading: true });
            const data = await ReviewService.getAllReviews({
                search: searchValue,
                filters: activeFilters,
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            });
            if (data.status === IResponseStatus.Error) {
                setState({
                    reviews: [],
                    reviewCounts: 0,
                });
            } else {
                setState({
                    reviews: data.data?.reviews,
                    reviewCounts: data.data?.totalCounts,
                });
            }
        } catch (error) {
            setState({
                reviews: [],
                reviewCounts: 0,
            });
        } finally {
            setState({ isLoading: false });
        }
    };

    React.useEffect(() => {
        getReviewList();
    }, [searchValue, activeFilters]);

    const handleSearch = (value) => {
        setState({ searchValue: value });
    };

    const handleApplyFilters = React.useCallback((filters: IFilterValueItem) => {
        setState({ activeFilters: filters, currentPage: 1 });
    }, []);

    const handleOpenDeleteDialog = (review: IReview): void => {
        setState({ isOpenDeleteModal: true, reviewToDelete: review });
    };

    const handleConfirmDelete = async () => {
        try {
            setState({ isDeleting: true });
            if (reviewToDelete) {
                const res = await ReviewService.deleteReview(reviewToDelete._id);
                if (res.status === IResponseStatus.Error) {
                    notify.error(res.message);
                } else {
                    notify.success(res.message);
                }
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi khi xóa đánh giá");
        } finally {
            setState({ isOpenDeleteModal: false, reviewToDelete: null, isDeleting: false });
            await getReviewList();
        }
    };

    const handleCancelDeleteDialog = (): void => {
        setState({ isOpenDeleteModal: false, reviewToDelete: null });
    };

    const handleOpenPinUnpinDialog = (review: IReview): void => {
        setState({ isOpenPinUnpinModal: true, reviewToPinUnpin: review });
    };

    const handlePinUnpinReview = async () => {
        try {
            setState({ isPinningUnpinning: true });
            if (reviewToPinUnpin) {
                const result = await ReviewService.pinReview(reviewToPinUnpin._id, !reviewToPinUnpin.isPin);
                if (result.status === IResponseStatus.Error) {
                    notify.error(result.message);
                } else {
                    notify.success(result.message);
                }
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi khi ghim/bỏ ghim đánh giá");
        } finally {
            setState({ isOpenPinUnpinModal: false, reviewToPinUnpin: null, isPinningUnpinning: false });
            await getReviewList();
        }
    };

    const handleCancelPinUnpinDialog = (): void => {
        setState({ isOpenPinUnpinModal: false, reviewToPinUnpin: null });
    };

    const handleOpenSendEmailDialog = (review: IReview): void => {
        setState({ isOpenSendEmailDialog: true, reviewToSendEmail: review });
    };

    const handleSendEmail = async () => {
        try {
            setState({ isSendingEmail: true });
            if (!emailMessage.trim()) {
                setState({ emailMessageError: "Vui lòng nhập tin nhắn phản hồi" });
                return Promise.resolve();
            } else {
                const result = await ReviewService.sendEmailToCustomer(reviewToSendEmail!._id, emailMessage);
                if (result.status === IResponseStatus.Error) {
                    notify.error(result.message);
                } else {
                    notify.success(result.message);
                }
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi khi gửi phản hồi cho khách hàng");
        } finally {
            setState({ isOpenSendEmailDialog: false, reviewToSendEmail: null, isSendingEmail: false, emailMessage: "", emailMessageError: "" });
        }
    };

    const handleCancelSendEmailDialog = (): void => {
        setState({ isOpenSendEmailDialog: false, reviewToSendEmail: null, emailMessage: "", emailMessageError: "" });
    };

    const columns: ColumnsType<IReview> = [
        {
            title: "Khách hàng",
            key: "customerName",
            render: (info: IReview) => {
                return (
                    <Flex align="center" className="!space-x-3">
                        <Image
                            src={info.userId ? info.userInfo?.avatar : DEFAULT_AVATAR}
                            alt={info.userId ? info.userInfo?.displayName : info.guestInfo?.displayName}
                            objectFit="cover"
                            height={32}
                            width={32}
                            className="!rounded-full"
                        />
                        <Tooltip title={info.userId ? info.userInfo?.displayName : info.guestInfo?.displayName} placement="topLeft">
                            <Text ellipsis={true} className="font-semibold text-gray-900" style={{ maxWidth: 120 }}>
                                {info.userId ? info.userInfo?.displayName : info.guestInfo?.displayName}
                            </Text>
                        </Tooltip>
                    </Flex>
                );
            },
        },
        {
            title: "Đánh giá",
            key: "review",
            width: 300,
            render: (info: IReview) => {
                return (
                    <Box className="w-full">
                        <Tooltip title={info.comment} placement="topLeft">
                            <Box
                                className="text-gray-600 text-sm leading-5 overflow-hidden break-words"
                                style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    maxHeight: "80px",
                                }}
                            >
                                {info.comment}
                            </Box>
                        </Tooltip>
                    </Box>
                );
            },
        },
        {
            title: "Điểm",
            key: "rating",
            render: (info: IReview) => <Rate disabled value={info.rating} className="text-yellow-400" />,
        },
        {
            title: "Ngày đánh giá",
            key: "date",
            render: (info: IReview) => <TextBase as="span" className="text-gray-600" titleText={dayjs(info.createdAt).format("DD-MM-YYYY")} />,
        },
        {
            title: "Hành động",
            key: "action",
            render: (info: IReview) => (
                <Flex className="flex !space-x-2">
                    <Tooltip title={info.isPin ? "Bỏ ghim đánh giá" : "Ghim đánh giá"}>
                        <Button
                            type="primary"
                            onClick={() => handleOpenPinUnpinDialog(info)}
                            icon={info.isPin ? <RiUnpinFill /> : <TiPin />}
                            size="small"
                            className={
                                info.isPin ? "!bg-gray-500 !border-gray-500 hover:!bg-gray-600 hover:!border-gray-600" : "!bg-blue-500 !border-blue-500 hover:!bg-blue-600 hover:!border-blue-600"
                            }
                            disabled={isLoading}
                        />
                    </Tooltip>
                    <Tooltip title="Gửi email cho khách hàng">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            className="!bg-green-500 !border-green-500 hover:!bg-green-600 hover:!border-green-600"
                            onClick={() => handleOpenSendEmailDialog(info)}
                            disabled={isLoading}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa đánh giá">
                        <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleOpenDeleteDialog(info)} disabled={isLoading} />
                    </Tooltip>
                </Flex>
            ),
        },
    ];

    return (
        <Flex vertical className="bg-transparent flex-grow min-h-full">
            <Box margin={[0, 0, 24, 0]}>
                <TextBase className="!text-gray-900" size="2xl" fontWeight="bold" titleText="Quản lý đánh giá" margin={[0, 0, 16, 0]} />
            </Box>
            <Container bgColor="white" className="flex-grow !rounded-lg !shadow-sm" padding={[24, 24, 24, 24]}>
                <Flex align="center" justify="space-between" wrap="wrap" gap="middle" className="!mb-6">
                    <Input.Search
                        placeholder="Tìm kiếm theo tên hoặc đánh giá"
                        allowClear
                        onSearch={handleSearch}
                        value={searchText}
                        onChange={(e) => setState({ searchText: e.target.value })}
                        className="!w-full max-w-[300px]"
                        size="middle"
                        disabled={isLoading}
                    />
                    <FilterButton disabled={isLoading} onApplyFilters={handleApplyFilters} currentFilters={activeFilters} availableFilters={reviewAdminFilterOptions} />
                </Flex>

                {isLoading ? (
                    <Flex align="center" justify="center" className="min-h-[300px]">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                    </Flex>
                ) : (
                    <React.Fragment>
                        <Table<IReview>
                            columns={columns}
                            dataSource={reviews.map((c) => ({ ...c, key: c._id }))}
                            rowKey="_id"
                            pagination={false}
                            className="w-full !mb-8"
                            scroll={{ x: reviews.length > 0 ? "max-content" : undefined }}
                            locale={{ emptyText: <Empty description="Không có đánh giá nào." /> }}
                        />
                        {reviews.length > 0 && (
                            <Flex justify="end">
                                <Pagination
                                    current={currentPage}
                                    total={reviewCounts}
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

            {isOpenDeleteModal && (
                <Modal title="Xóa đánh giá" open={isOpenDeleteModal} onCancel={handleCancelDeleteDialog} footer={null} centered>
                    <Container margin={[16, 0, 0, 0]}>
                        <Box padding={[16, 0, 16, 0]}>
                            <TextBase size="base">
                                Bạn có chắc chắn muốn xóa đánh giá từ{" "}
                                <TextBase as="span" fontWeight="bold">
                                    {reviewToDelete?.userId ? reviewToDelete.userInfo?.displayName : reviewToDelete?.guestInfo?.displayName}
                                </TextBase>
                                ?
                            </TextBase>
                            <TextBase size="sm" className="text-gray-500" titleText="Hành động này không thể hoàn tác." />
                        </Box>

                        <Flex justify="flex-end" className="!space-x-2">
                            <Button onClick={handleCancelDeleteDialog} disabled={isDeleting} className="!px-4 !py-2">
                                Hủy
                            </Button>
                            <Button type="primary" loading={isDeleting} onClick={handleConfirmDelete} className="!bg-red-600 !border-red-600 hover:!bg-red-700 !px-4 !py-2">
                                Xóa
                            </Button>
                        </Flex>
                    </Container>
                </Modal>
            )}
            {isOpenPinUnpinModal && (
                <Modal title="Ghim đánh giá tại trang chủ" open={isOpenPinUnpinModal} onCancel={handleCancelPinUnpinDialog} footer={null} centered>
                    <Container margin={[16, 0, 0, 0]}>
                        <Box padding={[16, 0, 16, 0]}>
                            <TextBase as="span">{`Bạn có chắc chắn muốn ${reviewToPinUnpin?.isPin ? "ẩn" : "hiển thị"} đánh giá từ `}</TextBase>
                            <TextBase as="span" fontWeight="bold">
                                {reviewToPinUnpin?.userId ? reviewToPinUnpin.userInfo?.displayName : reviewToPinUnpin?.guestInfo?.displayName}
                            </TextBase>
                            ?
                        </Box>

                        <Flex justify="flex-end" className="!space-x-2">
                            <Button onClick={handleCancelPinUnpinDialog} disabled={isPinningUnpinning} className="!px-4 !py-2">
                                Hủy
                            </Button>
                            <Button type="primary" loading={isPinningUnpinning} onClick={handlePinUnpinReview} className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700 !px-4 !py-2">
                                {reviewToPinUnpin?.isPin ? "Bỏ ghim" : "Ghim"}
                            </Button>
                        </Flex>
                    </Container>
                </Modal>
            )}
            {isOpenSendEmailDialog && (
                <Modal title="Gửi phản hồi cho khách hàng" open={isOpenSendEmailDialog} onCancel={handleCancelSendEmailDialog} footer={null} centered>
                    <Container margin={[16, 0, 0, 0]}>
                        <Box padding={[16, 0, 16, 0]}>
                            <Box margin={[0, 0, 12, 0]}>
                                <TextBase titleText="Email người nhận" requireIcon />
                                <Input size="middle" className="!mt-1" value={reviewToSendEmail!.userId ? reviewToSendEmail!.userInfo?.email : reviewToSendEmail!.guestInfo?.email} disabled />
                            </Box>
                            <Box margin={[0, 0, 12, 0]}>
                                <TextBase titleText="Email người nhận" requireIcon />
                                <TextArea
                                    className="!mt-1"
                                    value={emailMessage}
                                    onChange={(e) => setState({ emailMessage: e.target.value, emailMessageError: "" })}
                                    rows={6}
                                    placeholder="Tin nhắn"
                                    maxLength={1000}
                                    disabled={isSendingEmail}
                                />
                                {!!emailMessageError && <TextBase as="span" margin={[4, 0, 0, 0]} color="#cf1322" titleText={emailMessageError} />}
                            </Box>
                        </Box>

                        <Flex justify="flex-end" className="!space-x-2">
                            <Button onClick={handleCancelPinUnpinDialog} disabled={isSendingEmail} className="!px-4 !py-2">
                                Hủy
                            </Button>
                            <Button type="primary" loading={isSendingEmail} onClick={handleSendEmail} className="!bg-green-600 !border-green-600 hover:!bg-green-700 !px-4 !py-2">
                                Gửi phản hồi
                            </Button>
                        </Flex>
                    </Container>
                </Modal>
            )}
        </Flex>
    );
};

export { ReviewManagement };
