/** @format */

import { Collapse, CollapseProps, Drawer } from "antd";
import React, { Fragment } from "react";
import "./MenuPanel.scss";
import { accessoriesListFake, instructionsAndPolicyList, menListFake, parentCategoryListProps, sportListFake, womenListFake } from "./utils";
import { useImmerState } from "@/hooks";
import { Link } from "react-router-dom";
import { LuPhoneCall, LuStore } from "react-icons/lu";
import { IoHeartOutline } from "react-icons/io5";
import { classNames, useMobile } from "@/utils";

interface MenuPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IChildrenCategoryItem {
    categoryName: string;
    children?: string[];
}

interface IMenuPanelState {
    sportsCategoryList: IChildrenCategoryItem[];
    menCategoryList: IChildrenCategoryItem[];
    womenCategoryList: IChildrenCategoryItem[];
    accessoriesCategoryList: IChildrenCategoryItem[];
}

const initialState: IMenuPanelState = {
    sportsCategoryList: sportListFake,
    menCategoryList: menListFake,
    womenCategoryList: womenListFake,
    accessoriesCategoryList: accessoriesListFake,
};

interface IPanelBottomLinkProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    to: string;
}

const panelBottomLink: IPanelBottomLinkProps[] = [
    {
        icon: <LuPhoneCall className="text-xl" />,
        title: "Hotline hỗ trợ:",
        subtitle: "1900 1900",
        to: "tel:19001900",
    },
    {
        icon: <LuStore className="text-xl" />,
        title: "Hệ thống cửa hàng",
        subtitle: "7 cửa hàng",
        to: "/store",
    },
    {
        icon: <IoHeartOutline className="text-xl" />,
        title: "Danh sách yêu thích",
        subtitle: "0 sản phẩm",
        to: "/store",
    },
];


const MenuPanel: React.FC<MenuPanelProps> = ({ isOpen, onClose }) => {
    const [state] = useImmerState<IMenuPanelState>(initialState);
    const isMobile = useMobile();
    const panelWidth = isMobile ? 320 : 400;

    const renderChildrenCategoryItems = (items: IChildrenCategoryItem[]): CollapseProps["items"] =>
        items.map((item) => ({
            key: item.categoryName,
            label: <span className="text-[16px] uppercase hover:text-[#77e322]">{item.categoryName}</span>,
            children: (
                <ul>
                    {item.children?.map((child) => (
                        <li key={child} className="text-[16px] !py-1 !pl-4 hover:cursor-pointer hover:text-[#77e322]">
                            {child}
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
        <div className="w-full flex items-center justify-start gap-2">
            <img
                width={iconProps?.width}
                height={iconProps?.height}
                src={iconProps?.src}
                alt={iconProps?.alt}
                style={{
                    transform: iconProps?.rotate ? `rotate(${iconProps.rotate}deg)` : "none",
                }}
            />
            <span className="text-[16px] uppercase font-bold hover:text-[#77e322]">{label}</span>
        </div>
    );

    const parentCategoryItems: CollapseProps["items"] = parentCategoryListProps.map((item) => ({
        key: item.key,
        label: renderCollapseLabel(item.label, item.iconProps),
        children: <Collapse 
            className="menu-child-collapse-item" 
            expandIconPosition="end" 
            items={renderChildrenCategoryItems(getChildrenListByKey(item.key))} 
        />,
    }));

    const onRenderInstructionsAndPolicyItemList = () => {
        const collapseList: CollapseProps["items"] = instructionsAndPolicyList.map((item) => ({
            key: item.key,
            label: <span className="text-lg hover:text-[#77e322]">{item.label}</span>,
            children: (
                <ul>
                    {item.children?.map((child) => (
                        <li key={child.key} className="text-[16px] !py-1 !pl-4 hover:cursor-pointer hover:text-[#77e322]">
                            {child.label}
                        </li>
                    ))}
                </ul>
            ),
        }))
        return <Fragment>
            {
                collapseList.map((item) => (
                    <Collapse 
                        key={item.key} 
                        className="instruction-collapse-item" 
                        expandIconPosition="end" 
                        items={[item]} 
                    />
                ))
            }
        </Fragment>
    }

    const renderContactLink = (linkItem: IPanelBottomLinkProps, key?: string) => (
        <Link 
            key={key}
            className={classNames("flex items-center justify-center gap-1.5 text-[#333] hover:!text-[#333]", {
                "flex-col !py-[10px]": isMobile,
            })} 
            to={linkItem.to}
        >
            {linkItem.icon}
            <div className="flex flex-col items-center">
                <span className="text-[11px]">{linkItem.title}</span>
                <span className="text-xs leading-4 !font-semibold">{linkItem.subtitle}</span>
            </div>
        </Link>
    );

    return (
        <Drawer 
            title="Danh mục" 
            placement="left" 
            className="menu-panel-drawer" 
            closable={true} 
            onClose={onClose} 
            open={isOpen} 
            width={panelWidth}
        >
            <div className="w-full h-full flex-col flex items-center justify-between relative">
                <div className="w-full h-auto !mb-16 !p-1 menu-panel-content">
                    <div className="w-full h-auto !mb-3">
                        {parentCategoryItems.map((item) => (
                            <Collapse 
                                key={item.key} 
                                className="menu-parent-collapse-item" 
                                expandIconPosition="end" 
                                items={[item]} 
                            />
                        ))}
                    </div>
                    <div className="w-full h-auto">
                        <Link 
                            className="text-lg leading-10 !py-1 !pl-2 hover:cursor-pointer hover:!text-[#77e322]"
                            to="/about"
                        >
                            Về Lamine Sports
                        </Link>
                        {onRenderInstructionsAndPolicyItemList()}
                        <Link 
                            className="text-lg leading-10 !py-1 !pl-2 hover:cursor-pointer hover:!text-[#77e322]"
                            to="/contact"
                        >
                            Liên hệ với chúng tôi
                        </Link>
                    </div>
                </div>

                <div className="w-full min-h-16 flex items-center justify-between absolute bottom-0 left-0 right-0 bg-[#e1e1e1] !px-[10px]">
                    {panelBottomLink.map((link, index) => (
                        renderContactLink(link, index.toString())
                    ))}
                </div>
            </div>
        </Drawer>
    );
};

export { MenuPanel };
