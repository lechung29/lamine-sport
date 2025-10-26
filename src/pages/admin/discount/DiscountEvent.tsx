/** @format */

import React from "react";
import { Button, Input, Select, DatePicker, Card, Typography, Flex, Spin, Modal, Tag, Radio } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { Box, Container, Text as TextBase } from "@/components";
import { ApplySetting, DiscountApplyType, DiscountStatus, ICreateProgramPayload, IDiscountProgram, IProductInfo, IResponseStatus } from "@/types";
import { useImmerState } from "@/hooks";
import { DiscountService, ProductService } from "@/services";
import { useNotification } from "@/context";
import { isInputOnlyNumber } from "@/utils";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

interface IDiscountEventState {
    currentProgram: IDiscountProgram | null;
    isLoading: boolean;
    programName: string;
    discountPercentage: number | null;
    activeDateRange: [Dayjs, Dayjs] | null;
    applyType: DiscountApplyType;
    productIds: string[];
    applySetting: ApplySetting;
    productOptions: IProductInfo[];
    isFetchingProduct: boolean;
    isShowForm: boolean;
    isOpenStopProgramDialog: boolean;
    isCancelingProgram: boolean;
    isActionProcessing: boolean;
}

const initialState: IDiscountEventState = {
    currentProgram: null,
    isLoading: false,
    programName: "",
    discountPercentage: null,
    activeDateRange: null,
    applyType: DiscountApplyType.AllProducts,
    productIds: [],
    applySetting: ApplySetting.AlwaysApply,
    productOptions: [],
    isFetchingProduct: false,
    isShowForm: false,
    isOpenStopProgramDialog: false,
    isCancelingProgram: false,
    isActionProcessing: false,
};

const DiscountEvent: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<IDiscountEventState>(initialState);
    const {
        activeDateRange,
        applySetting,
        applyType,
        currentProgram,
        discountPercentage,
        isFetchingProduct,
        isLoading,
        isShowForm,
        productIds,
        productOptions,
        programName,
        isOpenStopProgramDialog,
        isCancelingProgram,
        isActionProcessing,
    } = state;

    const notify = useNotification();

    const fetchProductSuggestions = React.useRef(
        debounce(async (searchValue: string) => {
            if (!searchValue) {
                setState({ productOptions: [], isFetchingProduct: false });
                return;
            }

            setState({ isFetchingProduct: true });
            try {
                const result = await ProductService.getProductByName(searchValue);
                if (result.status === IResponseStatus.Error) {
                    setState({ productOptions: [] });
                } else {
                    setState({ productOptions: result.data });
                }
            } catch (error) {
                console.error("Có lỗi xảy ra khi tải sản phẩm theo tên", error);
                setState({ productOptions: [] });
            } finally {
                setState({ isFetchingProduct: false });
            }
        }, 500)
    ).current;

    const getActiveProgram = async () => {
        try {
            setState({ isLoading: true });
            const result = await DiscountService.getCurrentProgram();
            if (result.status === IResponseStatus.Error) {
                notify.error(result.message);
                setState({ currentProgram: null });
            } else {
                notify.success(result.message);
                setState({ currentProgram: result.data });
                if (result.data) {
                    await populateForm(result.data);
                    setState({ isShowForm: true });
                } else {
                    resetForm();
                    setState({ isShowForm: false });
                }
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi xảy ra khi tải thông tin chương trình giảm giá");
            setState({ currentProgram: null });
        } finally {
            setState({ isLoading: false });
        }
    };

    React.useEffect(() => {
        getActiveProgram();
    }, []);

    const populateForm = async (discountProgram: IDiscountProgram) => {
        setState({
            programName: discountProgram.programName,
            discountPercentage: discountProgram.discountPercentage,
            activeDateRange: [dayjs(discountProgram.startDate), dayjs(discountProgram.endDate)],
            applyType: discountProgram.applyType,
            applySetting: discountProgram.applySetting
        });

        if (discountProgram.applyType === DiscountApplyType.SpecificProducts && !!discountProgram.productIds?.length) {
            setState({ productIds: discountProgram.productIds });

            const result = await ProductService.getProductListById(discountProgram.productIds);
            if (result.status === IResponseStatus.Error) {
                setState({ productOptions: [] });
            } else {
                setState({ productOptions: result.data });
            }
        } else {
            setState({ productIds: [], productOptions: [] });
        }
    };

    const resetForm = (): void => {
        setState({
            programName: "",
            discountPercentage: null,
            activeDateRange: null,
            applyType: DiscountApplyType.AllProducts,
            productIds: [],
            productOptions: [],
        });
    };

    const getProgramStatus = (program: IDiscountProgram["status"]) => {
        const text: Record<IDiscountProgram["status"], string> = {
            1: "Lên lịch",
            2: "Đang diễn ra",
            3: "Hết hạn",
            4: "Hủy",
        };
        return text[program];
    };

    const getStatusColor = (status: string = ""): string => {
        const colors: Record<string, string> = {
            "Lên lịch": "blue",
            "Đang diễn ra": "green",
            "Hết hạn": "red",
            Hủy: "gray",
        };
        return colors[status] || "default";
    };

    const handleCancelProgram = async () => {
        try {
            setState({ isCancelingProgram: true });
            const result = await DiscountService.cancelProgram({ _id: currentProgram?._id!, status: DiscountStatus.Cancelled });
            if (result.status === IResponseStatus.Error) {
                notify.error("Có lỗi xảy ra khi hủy chương trình ưu đãi");
            } else {
                notify.success("Hủy chương trình ưu đãi thành công");
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi xảy ra khi tải thông tin chương trình giảm giá");
        } finally {
            setState({ isCancelingProgram: false, isOpenStopProgramDialog: false });
            await getActiveProgram();
        }
    };

    const handleSubmitProgram = async () => {
        if (!programName || !discountPercentage || !activeDateRange || discountPercentage > 100 || discountPercentage < 0) {
            notify.error("Vui lòng điền đầy đủ các trường bắt buộc và đảm bảo phần trăm giảm giá hợp lệ (0-100%).");
            return Promise.resolve();
        }
        if (applyType === DiscountApplyType.SpecificProducts && !productIds.length) {
            notify.error("Vui lòng chọn ít nhất một sản phẩm cụ thể cho loại áp dụng này.");
            return Promise.resolve();
        }

        try {
            const payload: ICreateProgramPayload = {
                programName: programName,
                discountPercentage: discountPercentage,
                startDate: activeDateRange[0].toDate(),
                endDate: activeDateRange[1].toDate(),
                applyType: applyType,
                productIds: productIds,
                applySetting: applySetting,
            };
            setState({ isActionProcessing: true });
            const result = currentProgram ? await DiscountService.updateProgram(currentProgram._id, payload) : await DiscountService.createProgram(payload);
            if (result.status === IResponseStatus.Error) {
                notify.error(result.message);
                setState({ isActionProcessing: false });
            } else {
                notify.success(result.message);
                setState({ isActionProcessing: false });
                await getActiveProgram();
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi xảy ra");
            setState({ isActionProcessing: false });
        }
    };

    return (
        <Flex vertical className="bg-transparent flex-grow min-h-full">
            <Box margin={[0, 0, 24, 0]}>
                <TextBase className="!text-gray-900" size="2xl" fontWeight="bold" titleText="Quản lý ưu đãi hiện hành" margin={[0, 0, 16, 0]} />
            </Box>

            <Container bgColor="white" className="flex-grow !rounded-lg !shadow-sm" padding={[24, 24, 24, 24]}>
                <Flex align="center" justify="space-between" wrap="wrap" gap="small" className="!mb-6">
                    <Title level={4} className="!mb-0">
                        {isLoading ? "Đang tải thông tin ưu đãi..." : currentProgram ? "Thông tin chương trình ưu đãi hiện hành" : "Tạo chương trình ưu đãi mới"}
                    </Title>
                    {!isLoading && currentProgram && (
                        <Tag color={getStatusColor(getProgramStatus(currentProgram.status))} className="!px-4 !py-1 !rounded-full !text-base !font-medium">
                            {getProgramStatus(currentProgram.status)}
                        </Tag>
                    )}
                </Flex>

                {isLoading ? (
                    <Flex align="center" justify="center" className="min-h-[300px]">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                    </Flex>
                ) : (
                    <>
                        {(!currentProgram || getProgramStatus(currentProgram.status) === "Expired") && !isShowForm ? (
                            <Card className="!p-6 text-center !border-dashed !border-2 !border-gray-300 min-h-[300px] flex flex-col justify-center items-center">
                                <Text className="!block !text-lg !text-gray-600 !mb-4">Chưa có chương trình ưu đãi nào đang hoạt động hoặc sắp diễn ra.</Text>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<PlusOutlined />}
                                    className="!bg-[#364153] hover:!bg-[#4e596b] !border-[#364153] hover:!border-[#364153] !px-6"
                                    onClick={() => {
                                        resetForm();
                                        setState({
                                            activeDateRange: [dayjs(), dayjs().add(30, "days")],
                                            applyType: DiscountApplyType.AllProducts,
                                            isShowForm: true,
                                        });
                                    }}
                                >
                                    Tạo chương trình ưu đãi mới
                                </Button>
                            </Card>
                        ) : (
                            <Box className="!space-y-6">
                                <Spin spinning={isCancelingProgram} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                                    <Box className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6">
                                        <Box>
                                            <TextBase requireIcon fontWeight="medium" className="text-gray-700" titleText="Tên ưu đãi" />
                                            <Input
                                                className="!mt-2"
                                                value={programName}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState({ programName: e.target.value })}
                                                placeholder="Nhập tên ưu đãi"
                                                size="large"
                                                disabled={isActionProcessing}
                                            />
                                        </Box>

                                        <Box>
                                            <TextBase requireIcon fontWeight="medium" className="text-gray-700" titleText="Giảm giá %" />
                                            <Input
                                                placeholder="Nhập phần trăm giảm giá (0-100%)"
                                                value={discountPercentage ?? ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if ((isInputOnlyNumber(value) && parseInt(value) >= 1 && parseInt(value) <= 99) || value === "") {
                                                        setState({ discountPercentage: value ? Number(value) : null });
                                                    }
                                                }}
                                                suffix="%"
                                                className="!w-full !mt-2"
                                                size="large"
                                                disabled={isActionProcessing}
                                            />
                                        </Box>

                                        <Box className="md:!col-span-2">
                                            <TextBase requireIcon fontWeight="medium" className="text-gray-700" titleText="Thời gian áp dụng" />
                                            <RangePicker
                                                value={activeDateRange}
                                                onChange={(dates: [Dayjs | null, Dayjs | null] | null) => setState({ activeDateRange: dates as [Dayjs, Dayjs] | null })}
                                                className="!w-full !mt-2"
                                                format="YYYY-MM-DD"
                                                size="large"
                                                disabled={isActionProcessing}
                                            />
                                        </Box>

                                        <Box className="md:!col-span-2">
                                            <TextBase as="span" fontWeight="medium" className="text-gray-700" titleText="Sản phẩm áp dụng" />
                                            <Select<DiscountApplyType>
                                                value={applyType}
                                                onChange={(value: DiscountApplyType) => {
                                                    setState({ applyType: value });
                                                    if (value === DiscountApplyType.AllProducts) {
                                                        setState({ productIds: [], productOptions: [] });
                                                    }
                                                }}
                                                className="!w-full !mt-2"
                                                size="large"
                                                disabled={isActionProcessing}
                                            >
                                                <Option value={DiscountApplyType.AllProducts}>Tất cả sản phẩm</Option>
                                                <Option value={DiscountApplyType.SpecificProducts}>Sản phẩm chỉ định</Option>
                                            </Select>
                                        </Box>

                                        {applyType === DiscountApplyType.SpecificProducts && (
                                            <Box className="md:!col-span-2">
                                                <TextBase requireIcon fontWeight="medium" className="!text-gray-700" titleText="Chọn Sản phẩm cần ưu đãi" />
                                                <Select
                                                    mode="multiple"
                                                    placeholder="Tìm kiếm và chọn sản phẩm theo tên"
                                                    value={productIds}
                                                    notFoundContent={isFetchingProduct ? <Spin size="small" /> : "Không tìm thấy sản phẩm"}
                                                    filterOption={false}
                                                    onSearch={fetchProductSuggestions}
                                                    onChange={(value: string[]) => setState({ productIds: value })}
                                                    style={{ width: "100%", marginTop: 8 }}
                                                    size="large"
                                                    onBlur={() => setState({ productOptions: [] })}
                                                    disabled={isActionProcessing}
                                                >
                                                    {productOptions.map((product) => (
                                                        <Option key={product._id} value={product._id}>
                                                            {product.productName}
                                                        </Option>
                                                    ))}
                                                </Select>
                                                <TextBase size="sm" margin={[8, 0, 0, 0]} className="text-gray-500" titleText="Gõ để tìm kiếm sản phẩm theo ID hoặc tên." />
                                            </Box>
                                        )}

                                        <Box className="md:!col-span-2">
                                            <TextBase as="span" fontWeight="medium" className="text-gray-700" titleText="Cài đặt áp dụng" />
                                            <Radio.Group
                                                value={applySetting}
                                                style={{
                                                    marginTop: 8,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 8,
                                                }}
                                                disabled={isActionProcessing}
                                                onChange={(e) => setState({ applySetting: e.target.value })}
                                                options={[
                                                    { value: ApplySetting.AlwaysApply, label: "Luôn áp dụng giảm giá cho sản phẩm theo giá trị của chương trình" },
                                                    { value: ApplySetting.ApplyWithCondition, label: "Giữ nguyên giá giảm của sản phẩm khi giá trị của chương trình nhỏ hơn" },
                                                ]}
                                            />
                                        </Box>
                                    </Box>

                                    <Flex justify="flex-end" gap={16} className="!pt-4 !border-t !border-gray-100">
                                        <Button
                                            type="default"
                                            size="large"
                                            icon={<DeleteOutlined />}
                                            danger
                                            onClick={() => setState({ isOpenStopProgramDialog: true })}
                                            disabled={!currentProgram || isActionProcessing}
                                        >
                                            Dừng chương trình
                                        </Button>
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<EditOutlined />}
                                            className="!bg-blue-500 hover:!bg-blue-600 !border-blue-500 hover:!border-blue-600 disabled:!text-white"
                                            onClick={handleSubmitProgram}
                                            disabled={isActionProcessing}
                                            loading={isActionProcessing}
                                        >
                                            {currentProgram ? "Cập nhật ưu đãi" : "Tạo ưu đãi"}
                                        </Button>
                                    </Flex>
                                </Spin>
                            </Box>
                        )}
                    </>
                )}
                {isOpenStopProgramDialog && (
                    <Modal title="Xác nhận dừng chương trình ưu đãi" open={isOpenStopProgramDialog} onCancel={() => setState({ isOpenStopProgramDialog: false })} footer={null} centered>
                        <Container margin={[16, 0, 0, 0]}>
                            <Box padding={[16, 0, 16, 0]}>
                                <TextBase size="base">
                                    Bạn có chắc chắn muốn dừng chương trình ưu đãi <TextBase as="span" fontWeight="semibold" titleText={currentProgram?.programName.toUpperCase()} />. Hành động này sẽ
                                    loại bỏ ưu đãi ngay lập tức?
                                </TextBase>
                                <TextBase size="sm" className="text-gray-500" titleText="Hành động này không thể hoàn tác." />
                            </Box>

                            <Flex justify="flex-end" className="!space-x-2">
                                <Button onClick={() => setState({ isOpenStopProgramDialog: false })} disabled={isCancelingProgram} className="!px-4 !py-2">
                                    Hủy
                                </Button>
                                <Button type="primary" loading={isCancelingProgram} onClick={handleCancelProgram} className="!bg-red-600 !border-red-600 hover:!bg-red-700 !px-4 !py-2">
                                    Hủy chương trình
                                </Button>
                            </Flex>
                        </Container>
                    </Modal>
                )}
            </Container>
        </Flex>
    );
};

export { DiscountEvent };
