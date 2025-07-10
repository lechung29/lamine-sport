/** @format */

import { Collapse, CollapseProps, Drawer } from "antd";
import React from "react";
import "./MenuPanel.scss";
import { accessoriesListFake, menListFake, parentCategoryListProps, sportListFake, womenListFake } from "./utils";
import { useImmerState } from "@/hooks";
import { cloneDeep } from "lodash";
import { Link } from "react-router-dom";
import { LuPhoneCall, LuStore } from "react-icons/lu";
import { IoHeartOutline } from "react-icons/io5";
import { useMobile } from "@/utils";

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
    accessoriesCategoryList: accessoriesListFake
};

const MenuPanel: React.FC<MenuPanelProps> = (props) => {
    const { isOpen, onClose } = props;
    const [state, _setState] = useImmerState<IMenuPanelState>(initialState);
    const isMobile = useMobile();

    const panelWidth = isMobile ? 320 : 400;

    const getChildrenCategoryItems = (parentKey: string): CollapseProps["items"] => {
        let typeList: IChildrenCategoryItem[] = []
        switch (parentKey) {
            case "sportsCategoryList":
                typeList = cloneDeep(state.sportsCategoryList);
                break;
            case "menList":
                typeList = cloneDeep(state.menCategoryList);
                break;
            case "womenList":
                typeList = cloneDeep(state.womenCategoryList);
                break;
            case "accessoriesList":
                typeList = cloneDeep(state.accessoriesCategoryList);
                break;
            default:
                break;
        }
        return typeList.map((item) => ({
            key: item.categoryName,
            label: <span className="text-[16px] uppercase hover:text-[#77e322]">{item.categoryName}</span>,
            children: <ul>
                {item.children?.map((child) => (
                    <li key={child} className="text-[16px] !py-1 !pl-4 hover:cursor-pointer hover:text-[#77e322]">
                        {child}
                    </li>
                ))}
            </ul>
        }));
    }

    const parentCategoryItems: CollapseProps["items"] = parentCategoryListProps.map((item) => ({
        key: item.key,
        label: (
            <div className="w-full flex items-center justify-start gap-2">
                <img 
                    width={item.iconProps.width} 
                    height={item.iconProps.height} 
                    src={item.iconProps.src} 
                    alt={item.iconProps.alt} 
                    style={{
                        transform: item.iconProps.rotate ? `rotate(${item.iconProps.rotate}deg)` : "none"
                    }}
                />
                <span className="text-[16px] uppercase font-bold hover:text-[#77e322]">{item.label}</span>
            </div>
        ),
        children: <Collapse 
            className="menu-child-collapse-item" 
            expandIconPosition="end" 
            items={getChildrenCategoryItems(item.key)} 
        />,
    }));

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
                    {parentCategoryItems.map((item) => (
                        <Collapse 
                            className="menu-parent-collapse-item" 
                            expandIconPosition="end" 
                            items={[item]} 
                        />
                    ))}
                </div>
                <div className="w-full min-h-16 flex items-center justify-between absolute bottom-0 left-0 right-0 bg-[#e1e1e1] !px-[10px]">
                    <Link className={`flex items-center justify-center gap-1.5  text-[#333] hover:!text-[#333] ${isMobile && "flex-col !py-[10px]"}`} to="tel:19001900">
                        <LuPhoneCall className="text-xl" />
                        <div className="flex flex-col items-start">
                            <span className="text-[11px]">Hotline hỗ trợ:</span>
                            <span className="text-[16px] leading-5 !font-semibold">1900 1900</span>
                        </div>
                    </Link>
                    <Link className={`flex items-center justify-center gap-1.5  text-[#333] hover:!text-[#333] ${isMobile && "flex-col !py-[10px]"}`} to="/store">
                        <LuStore className="text-xl" />
                        <div className="flex flex-col items-center">
                            <span className="text-[11px]">Hệ thống cửa hàng</span>
                            <span className="text-xs leading-4 !font-semibold">7 cửa hàng</span>
                        </div>
                    </Link>
                    <Link className={`flex items-center justify-center gap-1.5  text-[#333] hover:!text-[#333] ${isMobile && "flex-col !py-[10px]"}`} to="/store">
                        <IoHeartOutline className="text-xl" />
                        <div className="flex flex-col items-start">
                            <span className="text-[11px]">Danh sách yêu thích</span>
                            <span className="text-xs leading-4 !font-semibold">0 sản phẩm</span>
                        </div>
                    </Link>
                </div>
            </div>
        </Drawer>
    );
};

export { MenuPanel };
