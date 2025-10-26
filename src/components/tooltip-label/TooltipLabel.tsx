/** @format */

import { classNames } from "@/utils";
import { Tooltip } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import React from "react";
import { Box } from "../elements";

interface ITooltipLabel extends React.HTMLAttributes<HTMLDivElement> {
    text?: string;
    lineDisplayed?: number;
    placement?: TooltipPlacement;
    tooltipDescription?: string;
    alwaysShow?: boolean;
    width?: "full" | "auto";
}

const TooltipLabel: React.FC<ITooltipLabel> = (props) => {
    const { text, lineDisplayed = 1, className, placement = "top", tooltipDescription, alwaysShow, style, width = "full", ...rest } = props;
    const [isOverflowText, setIsOverflowText] = React.useState(false);
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
    const titleRef = React.useRef<HTMLDivElement>(null);


    React.useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    React.useEffect(() => {
        const el = titleRef.current;
        if (el) {
            const timeout = setTimeout(() => {
                const isOverflowing = el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
                setIsOverflowText(isOverflowing);
            }, 0);
            return () => clearTimeout(timeout);
        }
    }, [text, lineDisplayed, windowWidth]);

    const labelStyle: React.CSSProperties = {
        display: "-webkit-box",
        WebkitLineClamp: lineDisplayed,
        WebkitBoxOrient: "vertical",
    };
    const tooltipWidth = React.useMemo(() => {
        if (width === "auto") {
            return "!w-auto";
        } else if (width === "full") {
            return "!w-full";
        }
    }, [width]);

    const content = (
        <Box
            {...rest}
            ref={titleRef}
            className={classNames("overflow-hidden text-[#333]", tooltipWidth, className)}
            style={{
                ...style,
                ...labelStyle,
            }}
        >
            {text || props.children}
        </Box>
    );

    return alwaysShow || isOverflowText ? (
        <Tooltip title={tooltipDescription || text || props.children} placement={placement} color="#002d3a">
            {content}
        </Tooltip>
    ) : (
        content
    );
};

export { TooltipLabel };
