/** @format */

import { classNames } from "@/utils";
import React from "react";
import { GoClock } from "react-icons/go";
import { IoIosCloseCircleOutline, IoIosTrendingUp } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";

interface ISearchBoxProps {
    device: "computer" | "tablet";
}

const SearchBox: React.FC<ISearchBoxProps> = (props) => {
    const { device } = props;
    const [isFocusedInput, setIsFocusedInput] = React.useState(false);
    const [isFocusedContent, setIsFocusedContent] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState<string>("");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    const handleFocusInput = (): void => {
        setIsFocusedInput(true);
        setIsFocusedContent(true);
    };

    const handleBlurInput = (): void => {
        setIsFocusedInput(false);
    };

    React.useEffect(() => {
        const handleClickOutsideContent = (event: MouseEvent) => {
            if (!isFocusedInput && contentRef.current && !contentRef.current.contains(event.target as Node)) {
                setIsFocusedContent(false);
            }
        };

        document.addEventListener("click", handleClickOutsideContent);
        return () => {
            document.removeEventListener("click", handleClickOutsideContent);
        };
    }, [isFocusedInput, isFocusedContent]);
    return (
        <div className={classNames("relative group flex-1 h-10 overflow-visible", { "max-[950px]:hidden flex": device === "computer" }, { "max-[950px]:flex hidden": device === "tablet" })}>
            <input
                ref={inputRef}
                onFocus={handleFocusInput}
                onBlur={handleBlurInput}
                type="text"
                value={searchValue}
                onChange={(event) => {
                    setSearchValue(event.target.value);
                }}
                placeholder="Tìm sản phẩm..."
                className="flex-1 !px-3 text-sm !text-[#333] outline-none border-none !bg-white"
            />
            <div className="relative group/search-button w-10 overflow-hidden">
                <div
                    className="absolute inset-0 bg-gray-200 group-hover/search-button:bg-[#77e322] transition-all duration-300 
                        before:absolute before:top-0 before:left-0 before:h-full before:w-full 
                        before:bg-[#77e322] before:transform before:scale-x-0 group-hover/search-button:before:scale-x-100 
                        before:origin-left before:transition-transform before:duration-300"
                />
                <div className="relative z-10 h-full flex items-center justify-center text-xl cursor-pointer">
                    <IoMdSearch className="text-[#333] group-hover/search-button:text-white" />
                </div>
            </div>

            <div
                ref={contentRef}
                className={classNames("absolute top-full left-0 w-full min-h-[50px] !px-3 !pb-3 bg-white shadow-primary z-50 hidden group-focus-within:!block", {
                    "!block": isFocusedInput || isFocusedContent,
                })}
            >
                <div className="w-full !py-2 !text-[#333] flex items-center justify-start gap-1 !border-b !border-gray-200">
                    <GoClock className="text-xl" />
                    <span className="text-sm uppercase font-semibold">Tìm kiếm gần đây</span>
                </div>
                <div className="w-full !pt-4 !pb-2 !pr-10 flex items-center justify-start flex-wrap gap-2">
                    <div className="!pr-1 !pl-2 !py-0.5 bg-gray-200 hover:!bg-[#1c2635] text-[#333] group/search-item flex items-center justify-between gap-1 cursor-pointer">
                        <span className="text-sm text-[#333] group-hover/search-item:!text-white">Giày chạy</span>
                        <IoIosCloseCircleOutline className="text-lg text-[#333] group-hover/search-item:!text-white hover:!text-red-500 cursor-pointer" />
                    </div>
                    <div className="!pr-1 !pl-2 !py-0.5 bg-gray-200 hover:!bg-[#1c2635] text-[#333] group/search-item flex items-center justify-between gap-1 cursor-pointer">
                        <span className="text-sm text-[#333] group-hover/search-item:!text-white">Áo chống nắng</span>
                        <IoIosCloseCircleOutline className="text-lg text-[#333] group-hover/search-item:!text-white hover:!text-red-500 cursor-pointer" />
                    </div>
                    <div className="!pr-1 !pl-2 !py-0.5 bg-gray-200 hover:!bg-[#1c2635] text-[#333] group/search-item flex items-center justify-between gap-1 cursor-pointer">
                        <span className="text-sm text-[#333] group-hover/search-item:!text-white">Quần áo bóng đá câu lạc bộ Barcelona</span>
                        <IoIosCloseCircleOutline className="text-lg text-[#333] group-hover/search-item:!text-white hover:!text-red-500 cursor-pointer" />
                    </div>
                    <div className="!pr-1 !pl-2 !py-0.5 bg-gray-200 hover:!bg-[#1c2635] text-[#333] group/search-item flex items-center justify-between gap-1 cursor-pointer">
                        <span className="text-sm text-[#333] group-hover/search-item:!text-white">Quần áo bóng đá câu lạc bộ Barcelona</span>
                        <IoIosCloseCircleOutline className="text-lg text-[#333] group-hover/search-item:!text-white hover:!text-red-500 cursor-pointer" />
                    </div>
                </div>
                <div className="w-full !py-2 !text-[#333] flex items-center justify-start gap-1 !border-b !border-gray-200">
                    <IoIosTrendingUp className="text-xl" />
                    <span className="text-sm uppercase font-semibold">Đề xuất phổ biến</span>
                </div>
                <div className="w-full !pt-4 !pb-2 !pr-10 flex items-center justify-start flex-wrap gap-2">
                    <div className="!px-2 !py-0.5 text-sm bg-gray-200 hover:!bg-[#1c2635] text-[#333] hover:!text-white text-center cursor-pointer">Áo chạy bộ</div>
                    <div className="!px-2 !py-0.5 text-sm bg-gray-200 hover:!bg-[#1c2635] text-[#333] hover:!text-white text-center cursor-pointer">Áo chống nắng</div>
                    <div className="!px-2 !py-0.5 text-sm bg-gray-200 hover:!bg-[#1c2635] text-[#333] hover:!text-white text-center cursor-pointer">Tất/vớ</div>
                    <div className="!px-2 !py-0.5 text-sm bg-gray-200 hover:!bg-[#1c2635] text-[#333] hover:!text-white text-center cursor-pointer">Nón leo núi</div>
                    <div className="!px-2 !py-0.5 text-sm bg-gray-200 hover:!bg-[#1c2635] text-[#333] hover:!text-white text-center cursor-pointer">Bóng rổ</div>
                    <div className="!px-2 !py-0.5 text-sm bg-gray-200 hover:!bg-[#1c2635] text-[#333] hover:!text-white text-center cursor-pointer">Giày bóng đá</div>
                </div>
            </div>
        </div>
    );
};

export { SearchBox };
