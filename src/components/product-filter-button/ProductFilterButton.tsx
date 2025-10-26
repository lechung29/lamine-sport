/** @format */

// src/components/FilterButton.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Button, Popover, Collapse, Checkbox, Input, Space, Divider, Typography, DatePicker } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

import "./ProductFilterButton.scss";
import { Box, Container, BaseButton, Text as TextBase, Image } from "@/components/elements";
import { IFilterOptionType, IFilterValueItem } from "@/types";

const { Panel } = Collapse;
const { Text } = Typography;
const { RangePicker } = DatePicker;

interface FilterButtonProps {
    onApplyFilters: (filters: IFilterValueItem) => void;
    currentFilters: IFilterValueItem;
    disabled?: boolean;
    availableFilters: IFilterOptionType[];
    className?: string;
}

const ProductFilterButton: React.FC<FilterButtonProps> = (props) => {
    const { onApplyFilters, currentFilters, availableFilters, disabled, className } = props;
    const [open, setOpen] = useState<boolean>(false);
    const [localFilters, setLocalFilters] = useState<IFilterValueItem>(currentFilters);
    const [activeCollapseKeys, setActiveCollapseKeys] = useState<string[]>([]);

    useEffect(() => {
        const newLocalFilters = { ...currentFilters };
        const keysToOpen: string[] = [];

        availableFilters.forEach((filter) => {
            if (filter.type === "dateRange" && newLocalFilters[filter.id] && newLocalFilters[filter.id].length === 2) {
                newLocalFilters[filter.id] = [dayjs(newLocalFilters[filter.id][0]), dayjs(newLocalFilters[filter.id][1])];
            }

            const filterValue = newLocalFilters[filter.id];
            let isActive = false;
            if (filter.type === "checkbox" && Array.isArray(filterValue) && filterValue.length > 0) {
                isActive = true;
            } else if (filter.type === "text" && typeof filterValue === "string" && filterValue.trim() !== "") {
                isActive = true;
            } else if (filter.type === "dateRange" && Array.isArray(filterValue) && filterValue.length === 2 && filterValue[0] && filterValue[1]) {
                isActive = true;
            }

            if (isActive) {
                keysToOpen.push(filter.id);
            }
        });

        setLocalFilters(newLocalFilters);
        setActiveCollapseKeys(keysToOpen);
    }, [currentFilters, availableFilters]);

    const handleCheckboxChange = (filterId: string, checkedValues: number[]) => {
        setLocalFilters((prev: IFilterValueItem) => ({
            ...prev,
            [filterId]: checkedValues,
        }));
    };

    const handleTextChange = (filterId: string, value: string) => {
        setLocalFilters((prev: IFilterValueItem) => ({
            ...prev,
            [filterId]: value,
        }));
    };

    const handleDateRangeChange = (filterId: string, dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        setLocalFilters((prev: IFilterValueItem) => ({
            ...prev,
            [filterId]: dates ? [dates[0], dates[1]] : null,
        }));
    };

    const handleApply = () => {
        const filtersToApply: IFilterValueItem = {};
        Object.keys(localFilters).forEach((key) => {
            const filterDef = availableFilters.find((f) => f.id === key);
            if (filterDef && filterDef.type === "dateRange") {
                const dateArray = localFilters[key];
                if (dateArray && dayjs.isDayjs(dateArray[0]) && dayjs.isDayjs(dateArray[1])) {
                    filtersToApply[key] = [dateArray[0].format("YYYY-MM-DD"), dateArray[1].format("YYYY-MM-DD")];
                } else {
                    filtersToApply[key] = null;
                }
            } else {
                filtersToApply[key] = localFilters[key];
            }
        });
        onApplyFilters(filtersToApply);
        setOpen(false);
    };

    const handleReset = () => {
        const resetFilters: IFilterValueItem = {};
        availableFilters.forEach((filter) => {
            if (filter.type === "checkbox") {
                resetFilters[filter.id] = [];
            } else if (filter.type === "text") {
                resetFilters[filter.id] = "";
            } else if (filter.type === "dateRange") {
                resetFilters[filter.id] = null;
            }
        });
        setLocalFilters(resetFilters);
        onApplyFilters(resetFilters);
        setOpen(false);
    };

    const renderFilterContent = (filter: (typeof availableFilters)[0]) => {
        switch (filter.type) {
            case "checkbox":
                return (
                    <Checkbox.Group
                        options={filter.options}
                        value={localFilters[filter.id] || []}
                        onChange={(checkedValues) => handleCheckboxChange(filter.id, checkedValues)}
                        className="flex flex-col gap-1 custom-rating-checkbox-group"
                    />
                );
            case "text":
                return (
                    <Input.Search
                        placeholder={filter.placeholder}
                        value={localFilters[filter.id] || ""}
                        onChange={(e) => handleTextChange(filter.id, e.target.value)}
                        onSearch={(value) => handleTextChange(filter.id, value)}
                        allowClear
                    />
                );
            case "dateRange":
                const dateRangeValue = localFilters[filter.id];
                const dayjsDateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null =
                    dateRangeValue && dayjs.isDayjs(dateRangeValue[0]) && dayjs.isDayjs(dateRangeValue[1]) ? [dateRangeValue[0], dateRangeValue[1]] : null;

                return <RangePicker value={dayjsDateRange} onChange={(dates) => handleDateRangeChange(filter.id, dates)} className="!w-full" format="DD-MM-YYYY" />;
            default:
                return <Text type="secondary">Unsupported filter type.</Text>;
        }
    };

    const activeFilterCount = useMemo(() => {
        let count = 0;
        availableFilters.forEach((filter) => {
            const filterValue = currentFilters ? currentFilters : {};
            if (filter.type === "checkbox" && filterValue.hasOwnProperty(filter.id) && Array.isArray(filterValue[`${filter.id}`]) && filterValue[`${filter.id}`].length > 0) {
                count++;
            } else if (
                filter.type === "text" &&
                filterValue.hasOwnProperty(filter.id) &&
                filterValue[`${filter.id}`] &&
                typeof filterValue[`${filter.id}`] === "string" &&
                filterValue[`${filter.id}`].trim() !== ""
            ) {
                count++;
            } else if (
                filter.type === "dateRange" &&
                filterValue.hasOwnProperty(filter.id) &&
                Array.isArray(filterValue[`${filter.id}`]) &&
                filterValue[`${filter.id}`].length === 2 &&
                filterValue[`${filter.id}`][0] &&
                filterValue[`${filter.id}`][1]
            ) {
                count++;
            }
        });
        return count;
    }, [currentFilters, availableFilters]);

    const buttonClasses = `relative !bg-[#f1f1f1] h-8 !px-4 !border-1 !border-[#ccc] ${activeFilterCount ? "filter-button-active" : ""} ${className || ""}`;

    const content = (
        <Container className="!w-64 popover-content-container">
            <Box className="filter-scrollable-content" style={{ maxHeight: "300px", overflowY: "scroll" }}>
                <Collapse
                    bordered={false}
                    expandIcon={({ isActive }) => (isActive ? <UpOutlined /> : <DownOutlined />)}
                    expandIconPosition="end"
                    className="site-collapse-custom-collapse"
                    activeKey={activeCollapseKeys}
                    onChange={(keys) => setActiveCollapseKeys(keys as string[])}
                >
                    {availableFilters.map((filter) => (
                        <Panel header={<Text>{filter.name}</Text>} key={filter.id} className="site-collapse-custom-panel">
                            {renderFilterContent(filter)}
                        </Panel>
                    ))}
                </Collapse>
            </Box>

            <Divider className="!my-0" />
            <Space className="!w-full !py-2 !px-2 !justify-end items-center">
                <Button className="!rounded-none" onClick={handleReset} size="middle">
                    Hoàn tác
                </Button>
                <Button className="!bg-[#002d3a] !outline-none !rounded-none !shadow-none" type="primary" onClick={handleApply} size="middle">
                    Áp dụng
                </Button>
            </Space>
        </Container>
    );

    return (
        <Popover content={content} trigger="click" open={open} onOpenChange={setOpen} placement="bottomRight" styles={{ body: { borderRadius: "8px" } }}>
            <BaseButton disabled={disabled} className={buttonClasses} colors={{ normal: { textColor: "#333", bgColor: "#f1f1f1" }, hover: { textColor: "#333", bgColor: "#f1f1f1" } }}>
                <Image width="24px" height="24px" src="https://img.icons8.com/badges/48/sorting-options.png" alt="filter-icons" />
                <TextBase fontWeight="semibold" titleText="Bộ lọc" />
                {activeFilterCount > 0 && <Box className="filter-badge">{activeFilterCount}</Box>}
            </BaseButton>
        </Popover>
    );
};

export { ProductFilterButton };
