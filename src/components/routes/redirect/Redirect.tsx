/** @format */

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
        <section className="flex items-center justify-center flex-col h-screen w-screen text-gray-700 dark:text-white gap-1">
            <p className="text-center">{message}</p>
        </section>
    );
};

export { Redirect };
