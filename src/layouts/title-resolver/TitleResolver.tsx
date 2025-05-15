/** @format */

import React, { PropsWithChildren, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export const TitleResolver = (props: PropsWithChildren) => {
    const { children } = props;

    const location = useLocation();

    const prefix = "Lamine Sport";

    useEffect(() => {
        let title = "";
        switch (location.pathname) {
            case "/":
                title = "Home";
                break;
            case "/messages":
                title = "Your messages";
                break;
            case "/login":
                title = "Login";
                break;
            case "/sign-up":
                title = "Sign up";
                break;
            case "reels":
                title = "Reels";
                break;
            case "/friends":
                title = "Your friends";
                break;
            default:
                title = "Page Not Found";
        }

        document.title = title ? `${prefix} | ${title}` : prefix;
    }, [location.pathname]);

    return <React.Fragment>{children ? children : <Outlet />}</React.Fragment>;
};
