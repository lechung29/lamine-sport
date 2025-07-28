/** @format */

import { Popover } from "antd";
import React from "react";
import { IBasicDropdownOption, InstructionProductOption } from "../instruction-size-dialog";
import { IoIosArrowDown } from "react-icons/io";

enum TimeRange {
    Morning = "Morning",
    Afternoon = "Afternoon",
    Evening = "Evening",
}

const timeRangeOptions: IBasicDropdownOption[] = [
    {
        key: TimeRange.Morning.toString(),
        text: "08h00 - 11h30",
    },
    {
        key: TimeRange.Afternoon.toString(),
        text: "13h00 - 16h30",
    },
    {
        key: TimeRange.Evening.toString(),
        text: "16h30 - 20h00",
    },
];

const TimeRangeSelect: React.FunctionComponent = () => {
    const [isOpenMenu, setIsOpenMenu] = React.useState<boolean>(false);
    const [timeRange, setTimeRange] = React.useState<IBasicDropdownOption>();
    const [triggerWidth, setTriggerWidth] = React.useState<number>(0);
    const triggerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, [isOpenMenu]);

    return (
        <Popover
            open={isOpenMenu}
            arrow={false}
            align={{ offset: [0, 0] }}
            placement="bottomRight"
            content={
                <InstructionProductOption
                    options={timeRangeOptions}
                    selectedOption={timeRange}
                    menuWidth={triggerWidth}
                    onChange={(newOption) => {
                        setTimeRange(newOption);
                        setIsOpenMenu(false);
                    }}
                />
            }
            getPopupContainer={() => document.body}
            onOpenChange={(isOpen) => setIsOpenMenu(isOpen)}
            trigger="click"
        >
            <div className="flex items-center justify-between bg-white !border !border-[#ddd] !px-4 !py-2 cursor-text" ref={triggerRef}>
                <span>{timeRange?.text ?? "Chọn thời gian"}</span>
                <IoIosArrowDown />
            </div>
        </Popover>
    );
};

export { TimeRangeSelect };
