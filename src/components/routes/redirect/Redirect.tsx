/** @format */

import { Text } from "@/components/elements";
import { Flex, Spin } from "antd";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface IRedirectPageProps {
    to: string;
    message: string;
}

const Redirect: React.FunctionComponent<IRedirectPageProps> = (props) => {
    const { to, message } = props;
    const [count, setCount] = React.useState(5);
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCount((preValue) => preValue - 1);
        }, 1000);
        if (count === 0) {
            navigate(`${to}`, {
                state: location.pathname,
            });
        }
        return () => clearInterval(interval);
    }, [count, navigate, location, props.to]);

    return (
        <Flex vertical align="center" justify="center" gap={16} className="h-screen w-screen text-gray-700 dark:text-white">
            <Spin size="large" />
            <Text size="base" textAlign="center" titleText={message}/>
        </Flex>
    );
};

export { Redirect };
