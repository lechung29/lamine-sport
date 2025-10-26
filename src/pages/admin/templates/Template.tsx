/** @format */

import React from "react";
import { Button, Input, Table, Pagination, Modal, Flex, Spin, Tooltip, Typography, Empty } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, FileTextOutlined, LoadingOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Editor } from "@tinymce/tinymce-react";
import { BaseButton, Box, Container, Text as TextBase } from "@/components";
import { useImmerState } from "@/hooks";
import { useNotification } from "@/context";
import { TemplateService } from "@/services";
import { IResponseStatus, ITemplateData } from "@/types";
import { classNames } from "@/utils";

const { Text } = Typography;

interface ITemplateManagementState {
    templates: ITemplateData[];
    searchText: string;
    searchValue: string;
    totalCounts: number;
    currentPage: number;

    isOpenAddTemplateDialog: boolean;
    templateName: string;
    templateContent: string;
    isNameError: boolean;
    isAddingTemplate: boolean;
    isDeletingTemplate: boolean;
    isLoading: boolean;

    isOpenDeleteDialog: boolean;
    editingTemplate: ITemplateData | null;
    deletingTemplate: ITemplateData | null;
}

const initialState: ITemplateManagementState = {
    templates: [],
    searchText: "",
    searchValue: "",
    totalCounts: 0,
    currentPage: 1,
    isOpenAddTemplateDialog: false,
    templateName: "",
    templateContent: "",
    isNameError: false,
    isAddingTemplate: false,
    isLoading: false,
    isDeletingTemplate: false,
    isOpenDeleteDialog: false,
    deletingTemplate: null,
    editingTemplate: null,
};

const TemplateManagement: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<ITemplateManagementState>(initialState);
    const {
        templateName,
        templateContent,
        templates,
        currentPage,
        totalCounts,
        searchText,
        searchValue,
        isOpenAddTemplateDialog,
        isAddingTemplate,
        isDeletingTemplate,
        isLoading,
        isOpenDeleteDialog,
        deletingTemplate,
        editingTemplate,
        isNameError,
    } = state;
    const notify = useNotification();
    const ITEMS_PER_PAGE = 10;

    const getTemplateList = async () => {
        try {
            setState({ isLoading: true });
            const data = await TemplateService.getAllTemplates({
                search: searchValue,
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            });
            if (data.status === IResponseStatus.Error) {
                setState({
                    templates: [],
                    totalCounts: 0,
                });
            } else {
                setState({
                    templates: data.data?.templates,
                    totalCounts: data.data?.totalCounts,
                });
            }
        } catch (error) {
            setState({
                templates: [],
                totalCounts: 0,
            });
        } finally {
            setState({ isLoading: false });
        }
    };

    React.useEffect(() => {
        getTemplateList();
    }, [searchValue]);

    const resetForm = (): void => {
        setState({ templateName: "", templateContent: "", isNameError: false });
    };

    const handleDeleteTemplate = async () => {
        try {
            setState({ isDeletingTemplate: true });
            const result = await TemplateService.deleteTemplate(deletingTemplate?._id!);
            if (result.status === IResponseStatus.Error) {
                notify.error(result.message);
            } else {
                notify.success(result.message);
                setState({ deletingTemplate: null, isOpenDeleteDialog: false });
                await getTemplateList();
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi xảy ra khi xóa template");
        } finally {
            setState({ isDeletingTemplate: false });
        }
    };

    const handleAddUpdateTemplate = async (): Promise<void> => {
        if (!templateName.trim() || !templateContent.trim()) {
            notify.error("Vui lòng điền các trường bắt buộc để tạo template");
        } else {
            try {
                setState({ isAddingTemplate: true });
                const result = editingTemplate
                    ? await TemplateService.updateTemplate(editingTemplate._id, templateName.trim(), templateContent)
                    : await TemplateService.createTemplate(templateName.trim(), templateContent);
                if (result.status === IResponseStatus.Error) {
                    notify.error(result.message);
                    if (result.fieldError === "name") {
                        setState({ isNameError: true });
                    }
                } else {
                    notify.success(result.message);
                    handleCancelAddEditDialog();
                    await getTemplateList();
                }
            } catch (error) {
                console.log(error);
                notify.error("Có lỗi xảy ra khi thực hiện");
            } finally {
                setState({ isAddingTemplate: false });
            }
        }
    };

    const handleAddClick = (): void => {
        setState({ isOpenAddTemplateDialog: true });
    };

    const handleOpenEditDialog = (template: ITemplateData): void => {
        setState({
            editingTemplate: template,
            isOpenAddTemplateDialog: true,
            templateName: template.templateName,
            templateContent: template.templateContent,
        });
    };

    const handleCancelAddEditDialog = () => {
        setState({ isOpenAddTemplateDialog: false, editingTemplate: null });
        resetForm();
    };

    const handleOpenDeleteDialog = (template: ITemplateData): void => {
        setState({
            deletingTemplate: template,
            isOpenDeleteDialog: true,
        });
    };

    const handleCancelDeleteDialog = (): void => {
        setState({
            deletingTemplate: null,
            isOpenDeleteDialog: false,
        });
    };

    const handleSearch = (value: string) => {
        setState((prev) => ({ ...prev, searchValue: value }));
    };

    const columns: ColumnsType<ITemplateData> = [
        {
            title: "Tên template",
            dataIndex: "templateName",
            key: "templateName",
            width: 160,
            sorter: (a, b) => a.templateName.localeCompare(b.templateName),
            showSorterTooltip: false,
            render: (text: string) => (
                <Tooltip title={text} placement="topLeft">
                    <Text ellipsis={true} className="font-semibold text-gray-900" style={{ maxWidth: 140 }}>
                        {text}
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: "Nội dung mô tả",
            dataIndex: "templateContent",
            key: "templateContent",
            render: (html: string) => {
                const temp = document.createElement("div");
                temp.innerHTML = html;
                const strippedText = temp.textContent || temp.innerText || "";
                return (
                    <Tooltip title={strippedText} placement="topLeft">
                        <Text ellipsis={true} className="text-gray-600" style={{ maxWidth: 360 }}>
                            {strippedText}
                        </Text>
                    </Tooltip>
                );
            },
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 100,
            render: (date: Date) => <Text className="text-gray-600">{dayjs(date).format("DD-MM-YYYY")}</Text>,
        },
        {
            title: "Cập nhật",
            dataIndex: "updatedAt",
            key: "updatedAt",
            width: 100,
            render: (date: Date) => <Text className="text-gray-600">{dayjs(date).format("DD-MM-YYYY")}</Text>,
        },
        {
            title: "Hành động",
            key: "action",
            width: 100,
            render: (_, record: ITemplateData) => (
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
                <TextBase className="!text-gray-900" size="2xl" fontWeight="bold" titleText="Quản lý template" margin={[0, 0, 16, 0]} />
            </Box>

            <Container bgColor="white" className="flex-grow !rounded-lg !shadow-sm" padding={[24, 24, 24, 24]}>
                <Flex align="center" justify="space-between" wrap="wrap" gap="middle" className="!mb-6">
                    <Input.Search
                        placeholder="Tìm kiếm theo tên template"
                        allowClear
                        onSearch={handleSearch}
                        value={searchText}
                        onChange={(e) => setState((prev) => ({ ...prev, searchText: e.target.value }))}
                        className="w-full max-w-[300px]"
                        size="middle"
                        disabled={isLoading}
                    />

                    <BaseButton
                        padding={[6, 16, 6, 16]}
                        radius="md"
                        onClick={handleAddClick}
                        className="disabled:!bg-gray-400"
                        disabled={isLoading}
                        displayText={
                            <React.Fragment>
                                <PlusOutlined />
                                {"Thêm template"}
                            </React.Fragment>
                        }
                    />
                </Flex>

                {isLoading ? (
                    <Flex align="center" justify="center" className="min-h-[300px]">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                    </Flex>
                ) : (
                    <React.Fragment>
                        <Table
                            columns={columns}
                            dataSource={templates.map((t) => ({ ...t, key: t._id }))}
                            rowKey="id"
                            pagination={false}
                            className="w-full !mb-8"
                            scroll={{ x: templates.length > 0 ? "max-content" : undefined }}
                            locale={{ emptyText: <Empty description="Không có mẫu template nào." /> }}
                        />
                        {templates.length > 0 && (
                            <Flex justify="end">
                                <Pagination
                                    current={currentPage}
                                    total={totalCounts}
                                    pageSize={ITEMS_PER_PAGE}
                                    onChange={(page: number) => setState((prev) => ({ ...prev, currentPage: page }))}
                                    showSizeChanger={false}
                                    showQuickJumper={false}
                                    disabled={isLoading}
                                />
                            </Flex>
                        )}
                    </React.Fragment>
                )}
            </Container>

            {isOpenAddTemplateDialog && (
                <Modal
                    title={
                        <React.Fragment>
                            <FileTextOutlined className="!mr-2" />
                            {editingTemplate ? "Chỉnh sửa template" : "Thêm template mới"}
                        </React.Fragment>
                    }
                    open={isOpenAddTemplateDialog}
                    onCancel={handleCancelAddEditDialog}
                    footer={null}
                    width={800}
                    height={500}
                    centered
                    destroyOnClose={true}
                >
                    <Box margin={[16, 0, 0, 0]} className="!space-y-4">
                        <Box>
                            <TextBase requireIcon fontWeight="medium" titleText="Tên template" />
                            <Input
                                className={classNames("!mt-1", {
                                    "!border !border-red-500": isNameError,
                                })}
                                value={templateName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setState({ templateName: e.target.value });
                                }}
                                placeholder="Nhập tên template"
                            />
                        </Box>

                        <Box>
                            <TextBase requireIcon fontWeight="medium" titleText="Nội dung" />
                            <Box margin={[4, 0, 0, 0]}>
                                <Editor
                                    apiKey="hmzm0nlodu2gg1kh1l7jd63rdgm4ufkleiair59pn7xblofl"
                                    init={{
                                        height: 320,
                                        menubar: false,
                                        plugins: [
                                            "advlist",
                                            "autolink",
                                            "lists",
                                            "link",
                                            "image",
                                            "charmap",
                                            "preview",
                                            "anchor",
                                            "searchreplace",
                                            "visualblocks",
                                            "code",
                                            "fullscreen",
                                            "insertdatetime",
                                            "media",
                                            "table",
                                            "wordcount",
                                            "emoticons",
                                            "help",
                                        ],
                                        toolbar:
                                            "undo redo | styleselect | fontsize | " +
                                            "forecolor backcolor | " +
                                            "bold italic underline strikethrough | subscript superscript | " +
                                            "alignleft aligncenter alignright alignjustify | " +
                                            "bullist numlist outdent indent | blockquote | " +
                                            "link image media table | charmap emoticons | preview fullscreen | code help | removeformat",
                                        content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                        toolbar_sticky: true,
                                        fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
                                        color_map: [
                                            "000000",
                                            "Đen",
                                            "FF0000",
                                            "Đỏ",
                                            "00FF00",
                                            "Xanh lá",
                                            "0000FF",
                                            "Xanh dương",
                                            "FFFF00",
                                            "Vàng",
                                            "FF00FF",
                                            "Hồng",
                                            "00FFFF",
                                            "Xanh cyan",
                                            "FFFFFF",
                                            "Trắng",
                                            "808080",
                                            "Xám",
                                            "FFA500",
                                            "Cam",
                                            "800080",
                                            "Tím",
                                            "A52A2A",
                                            "Nâu",
                                        ],
                                    }}
                                    value={templateContent}
                                    onEditorChange={(newValue) => setState({ templateContent: newValue })}
                                    disabled={isAddingTemplate}
                                />
                            </Box>
                        </Box>

                        <Flex justify="flex-end" className="!space-x-2 !pt-4">
                            <Button onClick={handleCancelAddEditDialog} disabled={isAddingTemplate}>
                                Hủy
                            </Button>
                            <Button type="primary" loading={isAddingTemplate} onClick={handleAddUpdateTemplate} className="!bg-[#002d3a] hover:!bg-[#a2ff00] hover:!text-[#333]">
                                {editingTemplate ? "Cập nhật" : "Thêm"}
                            </Button>
                        </Flex>
                    </Box>
                </Modal>
            )}

            {isOpenDeleteDialog && (
                <Modal title="Xóa template" open={isOpenDeleteDialog} onCancel={handleCancelDeleteDialog} footer={null} centered>
                    <Box margin={[16, 0, 0, 0]}>
                        <Box padding={[16, 0, 16, 0]}>
                            <TextBase size="base">
                                Bạn có chắc chắn muốn xóa template "<TextBase as="span" fontWeight="bold" titleText={deletingTemplate?.templateName} />
                                "?
                            </TextBase>
                            <TextBase size="sm" className="text-gray-500" titleText="Hành động này không thể hoàn tác." />
                        </Box>

                        <Flex justify="flex-end" className="!space-x-2">
                            <Button onClick={handleCancelDeleteDialog} disabled={isDeletingTemplate} className="!px-4 !py-2">
                                Hủy
                            </Button>
                            <Button type="primary" loading={isDeletingTemplate} onClick={handleDeleteTemplate} className="!bg-red-600 !border-red-600 hover:!bg-red-700 !px-4 !py-2">
                                Xóa
                            </Button>
                        </Flex>
                    </Box>
                </Modal>
            )}
        </Flex>
    );
};

export { TemplateManagement };
