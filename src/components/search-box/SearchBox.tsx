/** @format */

import { classNames, delayTime } from "@/utils";
import React from "react";
import { GoClock } from "react-icons/go";
import { IoIosCloseCircleOutline, IoIosTrendingUp } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import { BaseInput, Box, Container, Text } from "../elements";
import { Flex, Spin } from "antd";
import { useAppSelector, userState } from "@/redux-store";
import { SearchHistoryService } from "@/services";
import { IResponseStatus, ISearchHistoryInfo, ITopSearchInfo } from "@/types";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "@/context";

interface ISearchBoxProps {
    device: "computer" | "tablet";
}

const SearchBox: React.FC<ISearchBoxProps> = (props) => {
    const { device } = props;
    const [isFocusedInput, setIsFocusedInput] = React.useState<boolean>(false);
    const [isFocusedContent, setIsFocusedContent] = React.useState<boolean>(false);
    const [isOpenBox, setIsOpenBox] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [recentSearchList, setRecentSearchList] = React.useState<ISearchHistoryInfo[]>([]);
    const [topSearchList, setTopSearchList] = React.useState<ITopSearchInfo[]>([]);
    const [searchValue, setSearchValue] = React.useState<string>("");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const { user } = useAppSelector(userState);
    const notify = useNotification();
    const navigate = useNavigate();
    const location = useLocation();

    const handleFocusInput = (): void => {
        setIsFocusedInput(true);
        setIsFocusedContent(true);
        setIsOpenBox(true);
    };

    const handleBlurInput = (): void => {
        setIsFocusedInput(false);
    };

    const closeSearchBox = (): void => {
        setIsFocusedInput(false);
        setIsFocusedContent(false);
        setIsOpenBox(false);
        inputRef.current?.blur();
    };

    const handleSearch = (searchText: string) => {
        if (!searchText.trim()) return;

        navigate(`/search?productName=${searchText}`, {
            state: { timestamp: Date.now() },
        });
        closeSearchBox();
    };

    const getRecentlySearchValue = () => {
        return !!user
            ? SearchHistoryService.getRecentlySearch(user._id).then((data) => {
                  if (data.status === IResponseStatus.Error) {
                      setRecentSearchList([]);
                  } else {
                      setRecentSearchList(data.data ?? []);
                  }
              })
            : Promise.resolve();
    };

    const getTopSearchValue = () => {
        return SearchHistoryService.getTopSearch().then((data) => {
            if (data.status === IResponseStatus.Error) {
                setTopSearchList([]);
            } else {
                setTopSearchList(data.data ?? []);
            }
        });
    };

    React.useEffect(() => {
        if (isOpenBox) {
            setIsLoading(true);
            Promise.all([getRecentlySearchValue(), getTopSearchValue(), delayTime(1500)]).then(([_res1, _res2, _res3]) => setIsLoading(false));
        }
    }, [isOpenBox]);

    React.useEffect(() => {
        const handleClickOutsideContent = (event: MouseEvent) => {
            if (!isFocusedInput && contentRef.current && !contentRef.current.contains(event.target as Node)) {
                closeSearchBox();
            }
        };

        document.addEventListener("click", handleClickOutsideContent);
        return () => {
            document.removeEventListener("click", handleClickOutsideContent);
        };
    }, [isFocusedInput, isFocusedContent]);

    React.useEffect(() => {
        if (location.pathname !== "/search") {
            setSearchValue("");
        }
    }, [location.pathname]);

    const removeSearchHistory = async (searchValue: string) => {
        try {
            const result = await SearchHistoryService.removeSearchHistory(searchValue, user?._id!);
            if (result.status === IResponseStatus.Success) {
                const newList = recentSearchList.filter((item) => item.searchValue !== searchValue);
                setRecentSearchList(newList);
            }
        } catch (error) {
            notify.error("Có lỗi khi xóa lịch sử tìm kiếm");
        }
    };

    return (
        <Container className={classNames("relative group flex-1 h-10 overflow-visible", { "max-[950px]:hidden flex": device === "computer" }, { "max-[950px]:flex hidden": device === "tablet" })}>
            <BaseInput
                ref={inputRef}
                onFocus={handleFocusInput}
                onBlur={handleBlurInput}
                type="text"
                value={searchValue}
                onChange={(value, _event) => {
                    setSearchValue(value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch(searchValue);
                    }
                }}
                placeholder="Tìm sản phẩm..."
                className="flex-1 !px-3"
            />
            <Box onClick={() => handleSearch(searchValue)} className="relative group/search-button w-10 overflow-hidden">
                <Box
                    className="absolute inset-0 bg-gray-200 group-hover/search-button:bg-[#77e322] transition-all duration-300 
                        before:absolute before:top-0 before:left-0 before:h-full before:w-full 
                        before:bg-[#77e322] before:transform before:scale-x-0 group-hover/search-button:before:scale-x-100 
                        before:origin-left before:transition-transform before:duration-300"
                />
                <Flex align="center" justify="center" className="relative z-10 h-full text-xl cursor-pointer">
                    <IoMdSearch className="text-[#333] group-hover/search-button:text-white" />
                </Flex>
            </Box>

            <Box
                ref={contentRef}
                className={classNames("absolute top-full left-0 w-full min-h-[50px] !px-3 !pb-3 bg-white shadow-primary z-50 hidden group-focus-within:!block", {
                    "!block": isFocusedInput || isFocusedContent,
                })}
            >
                {isLoading ? (
                    <Flex align="center" justify="center" className="w-full h-[100px]">
                        <Spin size="default" />
                    </Flex>
                ) : recentSearchList.length > 0 || topSearchList.length > 0 ? (
                    <React.Fragment>
                        {recentSearchList.length > 0 && (
                            <React.Fragment>
                                <Flex align="center" justify="flex-start" gap={4} className="w-full !py-2 !text-[#333] gap-1 !border-b !border-gray-200">
                                    <GoClock className="text-xl" />
                                    <Text as="span" size="sm" textTransform="uppercase" fontWeight="semibold" titleText="Tìm kiếm gần đây" />
                                </Flex>
                                <Flex align="center" justify="flex-start" wrap gap={8} className="w-full !pt-4 !pb-2 !pr-10">
                                    {recentSearchList.map((item) => (
                                        <Flex
                                            key={item._id}
                                            align="center"
                                            justify="space-between"
                                            gap={4}
                                            onClick={() => {
                                                setSearchValue(item.searchValue);
                                                handleSearch(item.searchValue);
                                            }}
                                            className="!pr-1 !pl-2 !py-0.5 bg-gray-200 hover:!bg-[#1c2635] text-[#333] group/search-item cursor-pointer"
                                        >
                                            <Text as="span" size="sm" className="text-[#333] group-hover/search-item:!text-white" titleText={item.searchValue} />
                                            <IoIosCloseCircleOutline
                                                className="text-lg text-[#333] group-hover/search-item:!text-white hover:!text-red-500 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeSearchHistory(item.searchValue);
                                                }}
                                            />
                                        </Flex>
                                    ))}
                                </Flex>
                            </React.Fragment>
                        )}
                        {topSearchList.length > 0 && (
                            <React.Fragment>
                                <Flex align="center" justify="flex-start" gap={4} className="w-full !py-2 !text-[#333] gap-1 !border-b !border-gray-200">
                                    <IoIosTrendingUp className="text-xl" />
                                    <Text as="span" size="sm" textTransform="uppercase" fontWeight="semibold" titleText="Đề xuất phổ biến" />
                                </Flex>
                                <Flex align="center" justify="flex-start" wrap gap={8} className="w-full !pt-4 !pb-2 !pr-10">
                                    {topSearchList.map((item, key) => (
                                        <Box
                                            key={key}
                                            padding={[2, 8, 2, 8]}
                                            className="bg-gray-200 hover:!bg-[#1c2635] text-[#333] hover:!text-white text-center cursor-pointer"
                                            onClick={() => {
                                                setSearchValue(item.searchValue);
                                                handleSearch(item.searchValue);
                                            }}
                                        >
                                            {item.searchValue}
                                        </Box>
                                    ))}
                                </Flex>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                ) : (
                    <Text padding={[12, 0, 0, 0]} color="#777" size="base" textAlign="center" titleText="Không tìm thấy tìm kiếm gần đây" />
                )}
            </Box>
        </Container>
    );
};

export { SearchBox };
