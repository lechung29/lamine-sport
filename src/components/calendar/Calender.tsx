/** @format */

import { formatDate } from "@/utils";
import { Popover } from "antd";
import React from "react";
import Calendar from "react-calendar";
import "./Calendar.scss";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarView: React.FunctionComponent = () => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [date, setDate] = React.useState<Value>(null);
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const canGoToPrevMonth = () => {
        const now = new Date();
        now.setDate(1);
        now.setHours(0, 0, 0, 0);
        return currentMonth.getMonth() + 1 > now.getMonth() + 1;
    };

    const handleMonthChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
        if (activeStartDate) {
            setCurrentMonth(activeStartDate);
        }
    };

    const onChangeDate = (date: Value) => {
        setDate(date);
        setIsOpen(false);
    };

    return (
        <Popover
            open={isOpen}
            arrow={false}
            align={{ offset: [0, 0] }}
            placement="bottomRight"
            content={
                <Calendar
                    onActiveStartDateChange={handleMonthChange}
                    prevLabel={canGoToPrevMonth() ? "<<" : null}
                    nextLabel=">>"
                    maxDetail="month"
                    minDetail="month"
                    prev2Label={null}
                    next2Label={null}
                    minDate={new Date()}
                    onChange={onChangeDate}
                    value={date}
                    formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, { weekday: "short" }).slice(0, 2)}
                />
            }
            getPopupContainer={() => document.body}
            onOpenChange={(isOpen) => setIsOpen(isOpen)}
            trigger="click"
            styles={{
                root: {
                    maxWidth: 240,
                },
            }}
        >
            <div className="w-full bg-white !border !border-[#ddd] !px-4 !py-2 cursor-text">{date ? formatDate(date as Date) : "Chọn ngày"}</div>
        </Popover>
    );
};

export { CalendarView as Calendar };
