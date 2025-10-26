/** @format */

import React from "react";
import { classNames } from "@/utils";
import { twMerge } from "tailwind-merge";
import { useControllableState } from "@/hooks";

interface IBaseElementProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}

interface IContainerProps extends IBaseElementProps {
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
    padding?: [number, number, number, number];
    margin?: [number, number, number, number];
    bgColor?: string;
}

export const Container = React.forwardRef<HTMLDivElement, IContainerProps>((props, ref) => {
    const { className = "", maxWidth = "full", padding = [0, 0, 0, 0], margin = [0, 0, 0, 0], bgColor = "white", style, ...rest } = props;
    const containerClassName = classNames(`!mx-auto w-full max-w-${maxWidth}`, className).trim();
    const containerStyles: React.CSSProperties = {
        ...style,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        backgroundColor: bgColor,
    };
    return <section ref={ref} className={containerClassName} style={containerStyles} {...rest} />;
});

Container.displayName = "Container";

interface IGridProps extends IBaseElementProps {
    columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
    gap?: number;
}

export const Grid = React.forwardRef<HTMLDivElement, IGridProps>((props, ref) => {
    const { className = "", columns, gap, ...rest } = props;
    let gridClasses = ["grid"];
    if (columns) {
        if (typeof columns === "number") {
            gridClasses.push(`grid-cols-${columns}`);
        } else {
            Object.entries(columns).forEach(([breakpoint, cols]) => {
                gridClasses.push(`${breakpoint}:grid-cols-${cols}`);
            });
        }
    }
    if (gap) {
        gridClasses.push(`gap-${gap}`);
    }

    gridClasses.push(className);
    const finalGridClasses = gridClasses.filter(Boolean).join(" ");

    return <section ref={ref} className={finalGridClasses} {...rest} />;
});

Grid.displayName = "Grid";

interface IBoxProps extends IBaseElementProps {
    padding?: [number, number, number, number];
    margin?: [number, number, number, number];
    bgColor?: string;
}
export const Box = React.forwardRef<HTMLDivElement, IBoxProps>((props, ref) => {
    const { padding = [0, 0, 0, 0], margin = [0, 0, 0, 0], bgColor, style, ...rest } = props;
    const boxStyles: React.CSSProperties = {
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        backgroundColor: bgColor,
        ...style,
    };
    return (
        <div ref={ref} style={boxStyles} {...rest}>
            {props.children}
        </div>
    );
});
Box.displayName = "Box";

interface ITitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children?: React.ReactNode;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl";
    fontWeight?: "thin" | "extralight" | "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold" | "black";
    color?: string;
    padding?: [number, number, number, number];
    margin?: [number, number, number, number];
    titleText?: string | React.JSX.Element;
    textAlign?: "start" | "center" | "end";
    textTransform?: "uppercase" | "lowercase" | "capitalize";
    requireIcon?: boolean;
}

export const Title = React.forwardRef<HTMLHeadingElement, ITitleProps>((props, ref) => {
    const { children, level, size, fontWeight, color, style, titleText, textTransform, className = "", textAlign = "left", padding = [0, 0, 0, 0], margin = [0, 0, 0, 0], ...rest } = props;
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

    const dynamicClasses = twMerge(size && `!text-${size}`, fontWeight && `!font-${fontWeight}`, `text-${textAlign}`, textTransform && `${textTransform}`, className);
    const titleStyles: React.CSSProperties = {
        ...style,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        color: color,
    };

    return (
        <Tag ref={ref} className={dynamicClasses} style={titleStyles} {...rest}>
            {titleText || children}
        </Tag>
    );
});
Title.displayName = "Title";

type ITextBaseProps = Omit<ITitleProps, "level">;
type ITextProps<T extends React.ElementType> = ITextBaseProps & {
    as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof ITextBaseProps>;

export const Text: React.FC<ITextBaseProps & { as?: React.ElementType }> = React.forwardRef<any, ITextProps<any>>((props, ref) => {
    const { children, as, size = "sm", fontWeight, color, textTransform, textAlign, padding = [0, 0, 0, 0], margin = [0, 0, 0, 0], titleText, className = "", style, requireIcon, ...rest } = props;
    const isLabel = !!requireIcon && (typeof titleText === "string" || typeof children === "string")
    const Tag = isLabel ? "span" : as || "p";

    const dynamicClasses = twMerge(size && `text-${size}`, fontWeight && `font-${fontWeight}`, textTransform, textAlign && `text-${textAlign}`, className);

    const textStyles: React.CSSProperties = {
        ...style,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        color: color,
    };

    return (
        <React.Fragment>
            <Tag ref={ref} className={dynamicClasses} style={textStyles} {...rest}>
                {titleText || children}
            </Tag>
            {isLabel && <span className="text-red-500 !ml-1">*</span>}
        </React.Fragment>
    );
});

Text.displayName = "Text";

interface IBaseInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    value?: string;
    isError?: boolean;
    onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    withoutBorder?: boolean;
}

export const BaseInput = React.forwardRef<HTMLInputElement, IBaseInputProps>((props, ref) => {
    const { className = "", isError, value, leftIcon, rightIcon, withoutBorder = false, onChange, ...rest } = props;
    const [internalInputValue, setInternalInputValue] = useControllableState<string>({
        value: value,
        defaultValue: value,
        onChange: (value, event) => {
            onChange?.(value, event);
        },
    });
    const defaultStyles = `
        block w-full h-10 !px-5 !bg-white !text-sm !text-[#333] placeholder:!text-[#333] placeholder:!text-sm
        !outline-none focus:!outline-none disabled:!bg-gray-100 disabled:cursor-not-allowed 
        ${
            isError
                ? "!border-2 !border-red-500 focus:!border-red-500 "
                : withoutBorder
                ? "!border !border-gray-300"
                : "!border !border-gray-300 focus:!border-[#002d3a] focus:!ring-1 focus:!ring-[#002d3a]"
        }
    `;
    const combinedClassName = twMerge(defaultStyles, className);
    return leftIcon || rightIcon ? (
        <Container className="relative">
            {leftIcon && (
                <Box className="absolute left-0 top-1/2 -translate-y-1/2" padding={[8, 8, 8, 8]}>
                    {leftIcon}
                </Box>
            )}
            <input {...rest} ref={ref} value={internalInputValue} className={combinedClassName} onChange={(event) => setInternalInputValue(event.target.value, event)} />
            {rightIcon && (
                <Box className="absolute right-0 top-1/2 -translate-y-1/2 z-10" padding={[8, 8, 8, 8]}>
                    {rightIcon}
                </Box>
            )}
        </Container>
    ) : (
        <input {...rest} ref={ref} value={internalInputValue} className={combinedClassName} onChange={(event) => setInternalInputValue(event.target.value, event)} />
    );
});

BaseInput.displayName = "BaseInput";

interface IBaseTextAreaProps extends Omit<React.InputHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
    value?: string;
    isError?: boolean;
    onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    withoutBorder?: boolean;
    rows?: number;
}

export const BaseTextArea = React.forwardRef<HTMLTextAreaElement, IBaseTextAreaProps>((props, ref) => {
    const { className = "", isError, value, rows = 4, leftIcon, rightIcon, withoutBorder = false, onChange, ...rest } = props;
    const [internalInputValue, setInternalInputValue] = useControllableState<string>({
        value: value,
        defaultValue: value,
        onChange: (value, event) => {
            onChange?.(value, event);
        },
    });
    const defaultStyles = `
        block w-full !px-5 !py-2 !bg-white !text-sm !text-[#333] placeholder:!text-[#333] placeholder:!text-sm
        !outline-none focus:!outline-none disabled:!bg-gray-100 disabled:cursor-not-allowed 
        ${
            isError
                ? "!border-2 !border-red-500 focus:!border-red-500 "
                : withoutBorder
                ? "!border !border-gray-300"
                : "!border !border-gray-300 focus:!border-[#002d3a] focus:!ring-1 focus:!ring-[#002d3a]"
        }
    `;
    const combinedClassName = twMerge(defaultStyles, className);
    return leftIcon || rightIcon ? (
        <Container className="relative">
            {leftIcon && (
                <Box className="absolute left-0 top-1/2 -translate-y-1/2" padding={[8, 8, 8, 8]}>
                    {leftIcon}
                </Box>
            )}
            <textarea {...rest} rows={rows} ref={ref} value={internalInputValue} className={combinedClassName} onChange={(event) => setInternalInputValue(event.target.value, event)} />
            {rightIcon && (
                <Box className="absolute right-0 top-1/2 -translate-y-1/2 z-10" padding={[8, 8, 8, 8]}>
                    {rightIcon}
                </Box>
            )}
        </Container>
    ) : (
        <textarea {...rest} rows={rows} ref={ref} value={internalInputValue} className={combinedClassName} onChange={(event) => setInternalInputValue(event.target.value, event)} />
    );
});

BaseTextArea.displayName = "BaseTextArea";

interface IImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
    clickable?: boolean;
    objectFit?: "cover" | "contain" | "fill";
}

export const Image = React.forwardRef<HTMLImageElement, IImageProps>((props, ref) => {
    const { className = "", clickable, height, width, objectFit = "cover", rounded = "none", style, ...rest } = props;
    const defaultStyles = `
            block
            ${rounded !== "none" && `!rounded-${rounded}`}
        `;

    const objectFitStyle = `object-${objectFit}`;

    const imgStyles: React.CSSProperties = {
        ...style,
        width,
        height,
    };

    const mouseStyles = clickable ? "cursor-pointer" : "cursor-default";
    const combinedClassName = twMerge(defaultStyles, mouseStyles, objectFitStyle, className);

    return <img ref={ref} className={combinedClassName} style={imgStyles} {...rest} />;
});

Image.displayName = "Image";

const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    displayText?: string | React.JSX.Element;
    isLoading?: boolean;
    setLoading?: (loading: boolean) => void;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<any>;
    shape?: "rectangle" | "parallelogram" | "right-trapezoid" | "left-trapezoid";
    width?: "full" | "fit" | "min" | number;
    skewPercent?: number;
    radius?: "none" | "sm" | "md" | "lg" | "full" | string;
    padding?: [number, number, number, number];
    margin?: [number, number, number, number];
    textProps?: {
        size: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl" | number;
        fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
        textTransform?: "uppercase" | "lowercase" | "capitalize" | "normal-case";
    };
    colors?: {
        normal: {
            bgColor: string;
            textColor: string;
        };
        hover: {
            bgColor: string;
            textColor: string;
        };
    };
}

export const BaseButton = React.forwardRef<HTMLButtonElement, IButtonProps>((props, ref) => {
    const {
        displayText,
        className,
        children,
        shape = "rectangle",
        width = "fit",
        radius = "none",
        skewPercent = 10,
        textProps,
        padding,
        margin,
        colors,
        disabled,
        isLoading,
        setLoading,
        onClick,
        ...rest
    } = props;

    const [internalLoading, setInternalLoading] = useControllableState<boolean>({
        value: isLoading,
        defaultValue: false,
        onChange: (value, _event) => {
            setLoading?.(value);
        },
    });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        if (onClick) {
            setInternalLoading(true);
            const suspensePromise: void | Promise<any> = onClick(event);

            if (suspensePromise instanceof Promise) {
                suspensePromise.finally(() => setInternalLoading(false));
            } else {
                setInternalLoading(false);
            }
        }
    };

    const disableButton = React.useMemo(() => {
        return disabled || internalLoading;
    }, [disabled, internalLoading]);

    const defaultColors: IButtonProps["colors"] = {
        normal: { bgColor: "#002d3a", textColor: "white" },
        hover: { bgColor: "#77e322", textColor: "#333" },
    };
    const currentColors = colors || defaultColors;

    const buttonPadding = padding || [8, 16, 8, 16];

    const buttonMargin = margin || [0, 0, 0, 0];

    const buttonTextProps: IButtonProps["textProps"] = textProps || {
        fontWeight: 400,
        size: "sm",
        textTransform: "normal-case",
    };

    const commonButtonClass = React.useMemo(() => {
        const baseStyles =
            "!inline-flex items-center justify-center gap-2 overflow-hidden transition-colors duration-300 !outline-none focus:!outline-none focus-visible:!ring-2 focus-visible:!ring-offset-2";

        const loadingStyles = internalLoading ? "cursor-not-allowed !opacity-50" : "cursor-pointer";

        const widthStyles =
            typeof width === "string"
                ? (() => {
                      switch (width) {
                          case "full":
                              return "w-full";
                          case "fit":
                              return "w-fil";
                          case "min":
                              return "min-w-fil";
                      }
                  })()
                : "";

        const radiusStyles = radius !== "none" ? `!rounded-${radius}` : "";

        const textTransformClass = `${buttonTextProps.textTransform}`;

        const textSizeClass = typeof buttonTextProps.size === "string" ? `!text-${buttonTextProps.size}` : "";

        return twMerge(baseStyles, loadingStyles, widthStyles, radiusStyles, textTransformClass, textSizeClass);
    }, [internalLoading, shape, width, radius]);

    const shapeClipPath = React.useMemo(() => {
        const constrainedSkew = Math.min(Math.max(0, skewPercent), 50);

        switch (shape) {
            case "parallelogram":
                return { clipPath: `polygon(${constrainedSkew}% 0, 100% 0, ${100 - constrainedSkew}% 100%, 0 100%)` };
            case "right-trapezoid":
                return { clipPath: `polygon(0 0, 100% 0, 100% 100%, ${constrainedSkew}% 100%)` };
            case "left-trapezoid":
                return { clipPath: `polygon(0 0, ${100 - constrainedSkew}% 0, 100% 100%, 0 100%)` };
            case "rectangle":
            default:
                return {};
        }
    }, [shape, skewPercent]);

    const style = React.useMemo(() => {
        const baseStyle = {
            "--button-bg-color": currentColors.normal.bgColor,
            "--button-text-color": currentColors.normal.textColor,
            "--button-bg-hover": currentColors.hover.bgColor,
            "--button-text-hover": currentColors.hover.textColor,
            "--button-bg-disabled": currentColors.normal.bgColor,
            "--button-text-disabled": currentColors.normal.textColor,
            ...shapeClipPath,
            padding: `${buttonPadding[0]}px ${buttonPadding[1]}px ${buttonPadding[2]}px ${buttonPadding[3]}px`,
            margin: `${buttonMargin[0]}px ${buttonMargin[1]}px ${buttonMargin[2]}px ${buttonMargin[3]}px`,
            width: typeof width === "number" ? width : undefined,
        };

        const textStyle: React.CSSProperties = {};
        if (typeof buttonTextProps.size === "number") {
            textStyle.fontSize = `${buttonTextProps.size}px`;
        }
        textStyle.fontWeight = buttonTextProps.fontWeight;

        return { ...baseStyle, ...textStyle };
    }, [currentColors, shapeClipPath, buttonPadding, buttonMargin]);

    const buttonContent = (
        <React.Fragment>
            {internalLoading && <LoadingSpinner/>}
            {!(displayText || children) && internalLoading ? null : displayText || children}
        </React.Fragment>
    );

    return (
        <button {...rest} ref={ref} type="button" className={twMerge(commonButtonClass, "dynamic-button-colors", className)} onClick={handleClick} disabled={disableButton} style={style}>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .dynamic-button-colors {
                    background-color: var(--button-bg-color);
                    color: var(--button-text-color);
                    cursor: pointer;
                }
                .dynamic-button-colors:hover {
                    background-color: var(--button-bg-hover);
                    color: var(--button-text-hover);
                }
                .dynamic-button-colors:disabled {
                    background-color: var(--button-bg-disabled);
                    color: var(--button-text-disabled);
                    cursor: not-allowed;
                }
                `,
                }}
            />
            {buttonContent}
        </button>
    );
});

BaseButton.displayName = "Button";
