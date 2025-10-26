/** @format */

import React from "react";
import { Flex, Input, message, Pagination, Skeleton } from "antd";
import { FaCopy, FaSearch } from "react-icons/fa";
import { PiCheckCircleFill, PiWarningCircleFill } from "react-icons/pi";
import { BaseButton, Box, Container, Text } from "@/components";
import { CouponStatus, CouponValueType, ICouponData, IResponseStatus } from "@/types";
import { useImmerState } from "@/hooks";
import { CouponService } from "@/services";
import { formatCurrency } from "@/utils";
import dayjs from "dayjs";

type CouponTab = CouponStatus.Active | CouponStatus.Expired;

interface IUserCouponState {
    currentTab: CouponTab;
    currentPage: number;
    couponList: ICouponData[];
    couponCount: number;
    isLoading: boolean;
    searchText: string;
    searchValue: string;
}

const initialState: IUserCouponState = {
    couponList: [],
    couponCount: 0,
    currentPage: 1,
    currentTab: CouponStatus.Active,
    isLoading: false,
    searchText: "",
    searchValue: "",
};

const UserCoupon: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<IUserCouponState>(initialState);
    const { couponList, currentPage, currentTab, isLoading, searchText, couponCount, searchValue } = state;
    const [messageApi, contextHolder] = message.useMessage();
    const pageSize = 6;

    const getCouponList = async (searchValue: string) => {
        try {
            setState({ isLoading: true });
            const result = await CouponService.getAllCoupon({
                filters: { couponStatus: [currentTab] },
                limit: 6,
                page: 1,
                search: searchValue,
            });
            if (result.status === IResponseStatus.Error) {
                setState({
                    couponList: [],
                    couponCount: 0,
                });
            } else {
                setState({
                    couponList: result.data?.coupons,
                    couponCount: result.data?.totalCounts,
                });
            }
        } catch (error) {
            setState({
                couponList: [],
                couponCount: 0,
            });
        } finally {
            setState({ isLoading: false });
        }
    };

    React.useEffect(() => {
        getCouponList(searchValue);
    }, [currentTab, currentPage]);

    const copyCode = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            messageApi.success("Đã sao chép mã giảm giá!");
        } catch (err) {
            messageApi.error("Lỗi: Không thể sao chép mã. Vui lòng thử lại.");
        }
    };

    const handleTabChange = (newTab) => {
        if (!isLoading) {
            setState({
                currentTab: newTab,
                currentPage: 1,
            });
        }
    };

    const handlePageChange = (page) => {
        setState({
            currentPage: page,
        });
    };

    const handleSearch: React.KeyboardEventHandler<HTMLInputElement> = async (e) => {
        if (e.key === "Enter") {
            setState({ searchValue: searchText });
            await getCouponList(searchText);
        }
    };

    return (
        <Container className="h-full relative text-[#333]">
            {contextHolder}
            <Text padding={[16, 0, 16, 0]} fontWeight="semibold" size="3xl" textAlign="center" titleText="Mã giảm giá" />

            <Box margin={[0, 12, 24, 12]} padding={[16, 16, 16, 16]} bgColor="#f0f0f0" className="!rounded-xl">
                <Text padding={[0, 0, 8, 0]} size="sm" fontWeight="semibold" titleText="Nhập mã giảm giá" />
                <Flex align="center" gap={8} className="flex-col sm:flex-row">
                    <Input
                        className="w-full sm:flex-1"
                        disabled={isLoading}
                        allowClear
                        size="large"
                        placeholder="Nhập mã giảm giá của bạn"
                        onKeyDown={handleSearch}
                        value={searchText}
                        onChange={(e) => setState({ searchText: e.target.value, searchValue: "" })}
                    />
                    <BaseButton
                        padding={[10, 24, 10, 24]}
                        className="!w-full sm:!w-auto !rounded-lg flex-shrink-0 disabled:!bg-gray-500 disabled:!text-gray-200"
                        disabled={isLoading}
                        onClick={async () => {
                            setState({ searchValue: searchText });
                            await getCouponList(searchText);
                        }}
                    >
                        <FaSearch />
                        Tìm kiếm
                    </BaseButton>
                </Flex>
            </Box>

            <Flex align="center" gap={16} className="!mb-6 !mx-3 justify-center sm:justify-start">
                <Box
                    role="button"
                    className={`!py-2 !px-4 cursor-pointer font-medium !border-b-2 transition-colors duration-200 ${isLoading && "!cursor-not-allowed"} ${
                        currentTab === CouponStatus.Active ? "!border-[#01112f] text-[#01112f]" : "!border-transparent text-gray-500 hover:text-[#01112f]"
                    }`}
                    onClick={() => handleTabChange(CouponStatus.Active)}
                >
                    Mã có thể dùng
                </Box>
                <Box
                    role="button"
                    className={`!py-2 !px-4 cursor-pointer font-medium !border-b-2 transition-colors duration-200 ${isLoading && "!cursor-not-allowed"} ${
                        currentTab === CouponStatus.Expired ? "!border-[#01112f] text-[#01112f]" : "!border-transparent text-gray-500 hover:text-[#01112f]"
                    }`}
                    onClick={() => handleTabChange(CouponStatus.Expired)}
                >
                    Mã đã hết hạn
                </Box>
            </Flex>

            {isLoading ? (
                <Box margin={[0, 12, 0, 12]} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: pageSize }).map((_, index) => (
                        <Skeleton key={index} active paragraph={{ rows: 3 }} className="!p-4 !bg-[#fff] !rounded-xl border border-gray-200 shadow-sm" />
                    ))}
                </Box>
            ) : (
                <>
                    <Box margin={[0, 12, 24, 12]} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {couponList.length > 0 ? (
                            couponList.map((coupon) => (
                                <Box key={coupon.id} padding={[16, 16, 16, 16]} bgColor="white" className="!rounded-xl !border !border-gray-200 !shadow-sm">
                                    <Flex align="center" justify="space-between" className="!mb-2">
                                        <Text
                                            fontWeight="bold"
                                            size="xl"
                                            titleText={coupon.valueType === CouponValueType.FixedAmount ? `Giảm ${formatCurrency(coupon.value)}` : `Giảm ${coupon.value}%`}
                                        />
                                        {coupon.couponStatus === CouponStatus.Active ? (
                                            <PiCheckCircleFill className="text-green-500 text-2xl" />
                                        ) : (
                                            <PiWarningCircleFill className="text-red-500 text-2xl" />
                                        )}
                                    </Flex>
                                    <Text size="sm" margin={[0, 0, 16, 0]} className="text-gray-500" titleText={`Hết hạn: ${dayjs(coupon.endDate).format("DD/MM/YYYY")}`} />
                                    <Flex about="center" justify="space-between" className="!p-3 !bg-gray-100 !rounded-lg !mb-3">
                                        <Text as="span" fontWeight="medium" className="font-mono" titleText={coupon.couponCode} />
                                        <Box className="text-gray-500 hover:text-[#01112f] transition-colors cursor-pointer" onClick={() => copyCode(coupon.couponCode)}>
                                            <FaCopy />
                                        </Box>
                                    </Flex>
                                    {!!coupon.maxValue && <Text size="sm" margin={[0, 0, 16, 4]} className="text-gray-500" titleText={`Giảm giá tối đa ${formatCurrency(coupon.maxValue)}`} />}
                                </Box>
                            ))
                        ) : (
                            <Box margin={[32, 0, 0, 0]} className="col-span-full text-center text-gray-500">
                                Không có mã giảm giá nào ở đây.
                            </Box>
                        )}
                    </Box>

                    {couponList.length > 0 && (
                        <Flex justify="center" className="!mx-3 !mb-4">
                            <Pagination
                                current={currentPage}
                                total={couponCount}
                                pageSize={6}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showQuickJumper={false}
                                className="text-center"
                                disabled={isLoading}
                            />
                        </Flex>
                    )}
                </>
            )}
        </Container>
    );
};

export { UserCoupon };
