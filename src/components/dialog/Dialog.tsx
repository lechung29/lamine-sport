/** @format */

import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Dialog.scss";
import { IoMdClose } from "react-icons/io";
import { classNames } from "@/utils";
import { TooltipLabel } from "../tooltip-label";
import { FaSpinner } from "react-icons/fa";
import { Flex } from "antd";
import { Box, Text } from "../elements";

interface ICommonDialogProps {
    title?: string;
    isOpen: boolean;
    isCloseByOutside?: boolean;
    disabledCloseAction?: boolean;
    className?: string;
    children?: React.ReactNode;
    withoutFooter?: boolean;
    noCancelButton?: boolean;
    confirmText?: string | React.JSX.Element;
    confirmButtonStyle?: "primary" | "danger";
    onClose?: () => void;
    onRenderFooter?: () => React.JSX.Element;
    onConfirm?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
}

const Dialog: React.FC<ICommonDialogProps> = (props) => {
    const {
        title,
        isOpen,
        isCloseByOutside = true,
        className,
        noCancelButton = false,
        disabledCloseAction: disableCloseAction = false,
        withoutFooter = false,
        confirmText = "Xác nhận",
        confirmButtonStyle = "primary",
        onClose,
        onRenderFooter,
        onConfirm,
    } = props;

    const [isLoading, setIsLoading] = useState(false);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (isCloseByOutside && e.target === e.currentTarget) onClose?.();
    };

    const handleConfirm = async (event: React.MouseEvent<HTMLElement>) => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        try {
            await onConfirm?.(event);
        } catch (error) {
            console.error("onConfirm failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getConfirmButtonClassName = () => {
        const baseStyle = "w-auto flex items-center justify-center gap-1 !px-4 !py-2 transition-colors duration-300 font-medium cursor-pointer";
        if (isLoading) {
            return `${baseStyle} !bg-gray-400 !text-white !cursor-not-allowed`;
        }
        if (confirmButtonStyle === "danger") {
            return `${baseStyle} !bg-red-500 hover:!bg-red-600 !text-white hover:!text-white`;
        }
        return `${baseStyle} !bg-[#002932] hover:!bg-[#a2ff00] !text-white hover:!text-[#333]`;
    };

    const onRenderDialogFooter = (): React.JSX.Element => {
        return !withoutFooter ? (
            onRenderFooter ? (
                onRenderFooter()
            ) : (
                <Flex align="center" justify="flex-end" gap={8} className="w-full !mt-2">
                    {(!disableCloseAction && !noCancelButton) && (
                        <Flex
                            align="center"
                            justify="center"
                            gap={4}
                            className="w-auto !bg-white !px-4 !py-2 transition-colors duration-300 text-[#333] cursor-pointer hover:!bg-black/10"
                            onClick={onClose}
                        >
                            Hủy bỏ
                        </Flex>
                    )}
                    <Box className={getConfirmButtonClassName()} onClick={handleConfirm}>
                        {isLoading ? (
                            <>
                                <FaSpinner className="animate-spin" /> <Text as="span" titleText="Đang xử lý" />
                            </>
                        ) : (
                            confirmText
                        )}
                    </Box>
                </Flex>
            )
        ) : (
            <></>
        );
    };

    return (
        isOpen &&
        ReactDOM.createPortal(
            <Box className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
                <Box className={classNames("bg-white shadow-lg w-11/12 max-w-[640px] relative !py-6 !pl-4 !pr-7.5 dialog-slide-up", className)}>
                    {!disableCloseAction && (
                        <Box className="absolute top-0 right-0 w-7.5 h-7.5 bg-[#002d3a] flex items-center justify-center cursor-pointer group" onClick={onClose}>
                            <IoMdClose className="text-white transition-transform duration-400 group-hover:rotate-90" />
                        </Box>
                    )}
                    {title && <TooltipLabel text={title} className="text-lg font-semibold !mb-2" />}
                    {props?.children}
                    {onRenderDialogFooter()}
                </Box>
            </Box>,
            document.getElementById("dialog-root")!
        )
    );
};

export { Dialog };
