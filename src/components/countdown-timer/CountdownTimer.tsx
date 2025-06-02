/** @format */

import React, { useEffect, useState } from "react";

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
        <div className="flex-1 flex flex-col items-center !mr-2 bg-[#002c3e] !shadow">
            <div className="text-white text-2xl font-bold !py-2">{value}</div>
            <div className="w-full bg-lime-400 text-[#002c3e] text-sm font-semibold !py-1 text-center">{label}</div>
        </div>
    );

    return (
        <div className="flex justify-center">
            {timeBox(timeLeft.days, "Ngày")}
            {timeBox(timeLeft.hours, "Giờ")}
            {timeBox(timeLeft.minutes, "Phút")}
            {timeBox(timeLeft.seconds, "Giây")}
        </div>
    );
};

export {
    CountdownTimer
};
