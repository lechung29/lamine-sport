/** @format */

import React from "react";
import ReactDOM from "react-dom";
import "./Dialog.scss";
import { IoMdClose } from "react-icons/io";
import { classNames } from "@/utils";
import { TooltipLabel } from "../tooltip-label";

interface ICommonDialogProps {
    title?: string;
    isOpen: boolean;
    isCloseByOutside?: boolean;
    className?: string;
    children?: React.ReactNode;
    withoutFooter?: boolean;
    noCancelButton?: boolean;
    confirmText?: string | React.JSX.Element;
    onClose: () => void;
    onRenderFooter?: () => React.JSX.Element;
    onConfirm?: () => void | Promise<void>;
}

const Dialog: React.FC<ICommonDialogProps> = (props) => {
    const { title, isOpen, isCloseByOutside = true, className, noCancelButton = false, withoutFooter = false, confirmText = "Confirm", onClose, onRenderFooter, onConfirm } = props;

    const handleOverlayClick = (e) => {
        if (isCloseByOutside && e.target === e.currentTarget) onClose?.();
    };

    const onRenderDialogFooter = (): React.JSX.Element => {
        return !withoutFooter ? (
            onRenderFooter ? (
                onRenderFooter?.()
            ) : (
                <div className="w-full !mt-2 flex items-center justify-end gap-2">
                    {!noCancelButton && (
                        <div
                            className="w-auto max-w-20 flex items-center justify-center gap-1 !bg-white !px-4 !py-2 transition-colors duration-300 text-[#333]  cursor-pointer hover:!bg-black/10"
                            onClick={onClose}
                        >
                            Cancel
                        </div>
                    )}
                    <div
                        className="w-auto max-w-20 flex items-center justify-center gap-1 !bg-[#002932] hover:!bg-[#a2ff00] !px-4 !py-2 transition-colors duration-300 !text-white hover:!text-[#333] cursor-pointer"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </div>
                </div>
            )
        ) : (
            <></>
        );
    };

    return (
        isOpen &&
        ReactDOM.createPortal(
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
                <div className={classNames("bg-white shadow-lg w-11/12 max-w-[640px] relative !py-6 !pl-4 !pr-7.5 dialog-slide-up", className)}>
                    <div className="absolute top-0 right-0 w-7.5 h-7.5 bg-[#002d3a] flex items-center justify-center cursor-pointer group" onClick={onClose}>
                        <IoMdClose className="text-white transition-transform duration-400 group-hover:rotate-90" />
                    </div>
                    {title && <TooltipLabel text={title} className="text-lg font-semibold !mb-2" />}
                    {props?.children}
                    {onRenderDialogFooter()}
                </div>
            </div>,
            document.getElementById("dialog-root")!
        )
    );
};

export { Dialog };
