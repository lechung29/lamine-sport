/** @format */

import { Collapse, CollapseProps, Drawer, Flex } from "antd";
import React, { Fragment, useMemo, useEffect } from "react";
import "./MenuPanel.scss";
import { accessoriesListMenu, instructionsAndPolicyList, menListMenu, parentCategoryListProps, sportListMenu, womenListMenu } from "./utils";
import { useImmerState } from "@/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuPhoneCall, LuStore } from "react-icons/lu";
import { IoHeartOutline } from "react-icons/io5";
import { classNames, useMobile } from "@/utils";
import { favoriteProductState, useAppSelector } from "@/redux-store";
import { Box, Image, Text } from "../elements";
import { SportType } from "@/types";

interface MenuPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IChildrenCategoryItem {
    categoryName: string;
    to?: string;
    children?: { label: string; value: number }[];
}

interface IMenuPanelState {
    sportsCategoryList: IChildrenCategoryItem[];
    menCategoryList: IChildrenCategoryItem[];
    womenCategoryList: IChildrenCategoryItem[];
    accessoriesCategoryList: IChildrenCategoryItem[];
}

const initialState: IMenuPanelState = {
    sportsCategoryList: sportListMenu,
    menCategoryList: menListMenu,
    womenCategoryList: womenListMenu,
    accessoriesCategoryList: accessoriesListMenu,
};

interface IPanelBottomLinkProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    to: string;
}

const MenuPanel: React.FC<MenuPanelProps> = ({ isOpen, onClose }) => {
    const [state] = useImmerState<IMenuPanelState>(initialState);
    const { favoriteProducts } = useAppSelector(favoriteProductState);
    const isMobile = useMobile();
    const location = useLocation();
    const navigate = useNavigate();
    const isFirstRender = React.useRef(true);

    const panelWidth = isMobile ? 320 : 400;

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (isOpen) {
            onClose();
        }
    }, [location.pathname, location.search]);

    const panelBottomLink: IPanelBottomLinkProps[] = useMemo(() => {
        return [
            {
                icon: <LuPhoneCall className="text-xl" />,
                title: "Hotline hỗ trợ:",
                subtitle: "1900 9518",
                to: "tel:19009518",
            },
            {
                icon: <LuStore className="text-xl" />,
                title: "Hệ thống cửa hàng",
                subtitle: "10 cửa hàng",
                to: "/all-our-store",
            },
            {
                icon: <IoHeartOutline className="text-xl" />,
                title: "Danh sách yêu thích",
                subtitle: `${favoriteProducts.length} sản phẩm`,
                to: "/favorite",
            },
        ];
    }, [favoriteProducts]);

    const navigateWithSportType = (sportType: SportType) => {
        window.location.href = `/products?sportType=${sportType}`;
    };

    const navigateToProduct = (link: string) => {
        window.location.href = link;
    };

    const renderItemWithoutChildren = (items: IChildrenCategoryItem[]) => {
        return (
            <React.Fragment>
                {items.map((item) => (
                    <Text
                        key={item.categoryName}
                        onClick={() => navigateToProduct(item.to!)}
                        size="base"
                        textTransform="uppercase"
                        className="hover:text-[#77e322] cursor-pointer"
                        padding={[4, 0, 4, 16]}
                        titleText={item.categoryName}
                    />
                ))}
            </React.Fragment>
        );
    };

    const renderChildrenCategoryItems = (items: IChildrenCategoryItem[]): CollapseProps["items"] =>
        items.map((item) => ({
            key: item.categoryName,
            label: <Text size="base" textTransform="uppercase" className="hover:text-[#77e322]" titleText={item.categoryName} />,
            children: (
                <ul>
                    {item.children?.map((child) => (
                        <li key={child.value} onClick={() => navigateWithSportType(child.value)} className="text-base !py-1 !pl-4 hover:cursor-pointer hover:text-[#77e322]">
                            {child.label}
                        </li>
                    ))}
                </ul>
            ),
        }));

    const getChildrenListByKey = (key: string) => {
        switch (key) {
            case "sportsCategoryList":
                return state.sportsCategoryList;
            case "menList":
                return state.menCategoryList;
            case "womenList":
                return state.womenCategoryList;
            case "accessoriesList":
                return state.accessoriesCategoryList;
            default:
                return [];
        }
    };

    const renderCollapseLabel = (label: string, iconProps: any) => (
        <Flex align="center" justify="flex-start" gap={8} className="w-full">
            <Image
                width={iconProps?.width}
                height={iconProps?.height}
                src={iconProps?.src}
                alt={iconProps?.alt}
                style={{
                    transform: iconProps?.rotate ? `rotate(${iconProps.rotate}deg)` : "none",
                }}
            />
            <Text as="span" size="base" fontWeight="bold" textTransform="uppercase" className="hover:text-[#77e322]" titleText={label} />
        </Flex>
    );

    const parentCategoryItems: CollapseProps["items"] = parentCategoryListProps.map((item) => ({
        key: item.key,
        label: renderCollapseLabel(item.label, item.iconProps),
        children:
            item.key === "sportsCategoryList" ? (
                <Collapse className="menu-child-collapse-item" expandIconPosition="end" expandIcon={undefined} items={renderChildrenCategoryItems(getChildrenListByKey(item.key))} />
            ) : (
                renderItemWithoutChildren(getChildrenListByKey(item.key))
            ),
    }));

    const onRenderInstructionsAndPolicyItemList = () => {
        const collapseList: CollapseProps["items"] = instructionsAndPolicyList.map((item) => ({
            key: item.key,
            label: <Text size="lg" className="hover:text-[#77e322]" titleText={item.label} />,
            children: (
                <ul>
                    {item.children?.map((child) => (
                        <li key={child.key} onClick={() => navigate(child.to)} className="text-base !py-1 !pl-4 hover:cursor-pointer hover:text-[#77e322]">
                            {child.label}
                        </li>
                    ))}
                </ul>
            ),
        }));
        return (
            <Fragment>
                {collapseList.map((item) => (
                    <Collapse key={item.key} className="instruction-collapse-item" expandIconPosition="end" items={[item]} />
                ))}
            </Fragment>
        );
    };

    const renderContactLink = (linkItem: IPanelBottomLinkProps, key?: string) => (
        <Link
            key={key}
            className={classNames("flex items-center justify-center gap-1.5 text-[#333] hover:!text-[#333]", {
                "flex-col !py-[10px]": isMobile,
            })}
            to={linkItem.to}
        >
            {linkItem.icon}
            <Flex vertical align="center">
                <Text as="span" size="xs" titleText={linkItem.title} />
                <Text as="span" size="xs" fontWeight="semibold" className="leading-4" titleText={linkItem.subtitle} />
            </Flex>
        </Link>
    );

    return (
        <Drawer title="Danh mục" placement="left" className="menu-panel-drawer" closable={true} onClose={onClose} open={isOpen} width={panelWidth}>
            <Flex vertical align="center" justify="space-between" className="w-full h-full relative">
                <Box margin={[0, 0, 64, 0]} padding={[4, 4, 4, 4]} className="w-full h-auto menu-panel-content">
                    <Box margin={[0, 0, 12, 0]} className="w-full h-auto">
                        {parentCategoryItems.map((item) => (
                            <Collapse key={item.key} className="menu-parent-collapse-item" expandIconPosition="end" items={[item]} />
                        ))}
                    </Box>
                    <Box className="w-full h-auto">
                        <Link className="text-lg leading-10 !py-1 !pl-2 hover:cursor-pointer hover:!text-[#77e322]" to="/about">
                            Về Lamine Sports
                        </Link>
                        {onRenderInstructionsAndPolicyItemList()}
                        <Link className="text-lg leading-10 !py-1 !pl-2 hover:cursor-pointer hover:!text-[#77e322]" to="/contact">
                            Liên hệ với chúng tôi
                        </Link>
                    </Box>
                </Box>

                <Flex align="center" justify="space-between" className="w-full min-h-16 absolute bottom-0 left-0 right-0 bg-[#e1e1e1] !px-[10px]">
                    {panelBottomLink.map((link, index) => renderContactLink(link, index.toString()))}
                </Flex>
            </Flex>
        </Drawer>
    );
};

export { MenuPanel };
