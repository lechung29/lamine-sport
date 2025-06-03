/** @format */

import { classNames } from "@/utils";
import { Tooltip } from "antd";
import React from "react";

interface ITooltipLabel extends React.HTMLAttributes<HTMLDivElement> {
    text?: string;
    lineDisplayed?: number;
}

const TooltipLabel: React.FC<ITooltipLabel> = (props) => {
    const { text, lineDisplayed = 1, className, style, ...rest } = props;
    const [isOverflowText, setIsOverflowText] = React.useState(false);
    const titleRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const el = titleRef.current;
        if (el) {
            const timeout = setTimeout(() => {
                const isOverflowing = el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
                setIsOverflowText(isOverflowing);
            }, 0);
            return () => clearTimeout(timeout);
        }
    }, [text, lineDisplayed]);

    const labelStyle: React.CSSProperties = lineDisplayed > 1 ? {
        display: "-webkit-box",
        WebkitLineClamp: lineDisplayed,
        WebkitBoxOrient: "vertical",
    } : {
        display: "inline-block",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    };

    const content = (
        <div 
            {...rest} 
            ref={titleRef} 
            className={classNames("w-full overflow-hidden text-[#333]", className)} 
            style={{
                ...style,
                ...labelStyle
            }}
        >
            {text || props.children}
        </div>
    );

    return isOverflowText ? (
        <Tooltip title={text || props.children} color="#002d3a">
            {content}
        </Tooltip>
    ) : (
        content
    );
};

export { TooltipLabel };
