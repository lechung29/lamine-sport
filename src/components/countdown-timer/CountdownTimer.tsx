/** @format */

import { Flex } from "antd";
import React, { useEffect, useState } from "react";
import { Text } from "../elements";

interface CountdownTimerProps {
    targetDate: Date;
}

type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

const getTimeLeft = (targetDate: Date): TimeLeft => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    return {
        days: days > 0 ? days : 0,
        hours: hours > 0 ? hours : 0,
        minutes: minutes > 0 ? minutes : 0,
        seconds: seconds > 0 ? seconds : 0,
    };
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(targetDate));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft(targetDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const timeBox = (value: number, label: string) => (
        <Flex vertical align="center" className="min-w-12.5 max-w-14 flex-1 !mr-2 bg-[#002c3e] !shadow">
            <Text color="white" size="2xl" fontWeight="bold" padding={[8, 0, 8, 0]} titleText={value.toString()} />
            <Text color="#002d3a" size="sm" fontWeight="semibold" padding={[4, 0, 4, 0]} textAlign="center" titleText={label} className="w-full bg-lime-400"/>
        </Flex>
    );

    return (
        <Flex justify="center" gap={4}>
            {timeBox(timeLeft.days, "Ngày")}
            {timeBox(timeLeft.hours, "Giờ")}
            {timeBox(timeLeft.minutes, "Phút")}
            {timeBox(timeLeft.seconds, "Giây")}
        </Flex>
    );
};

export {
    CountdownTimer
};
