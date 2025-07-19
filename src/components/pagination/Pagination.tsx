/** @format */

import { Pagination, PaginationProps } from "antd";
import React from "react";
import "./Pagination.scss";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

export interface IPaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage?: number;
    onChangePage: (page) => void;
}

const PaginationView: React.FunctionComponent<IPaginationProps> = (props) => {
    const { currentPage, totalItems, itemsPerPage = 12, onChangePage } = props;

    const onChange: PaginationProps["onChange"] = (page) => onChangePage(page);

    return <Pagination
        current={currentPage} 
        onChange={onChange} 
        showSizeChanger={false} 
        total={totalItems} 
        pageSize={itemsPerPage} 
        hideOnSinglePage
        showPrevNextJumpers={false}
        prevIcon={<MdKeyboardDoubleArrowLeft />}
        nextIcon={<MdKeyboardDoubleArrowRight />}
    />;
};

export { PaginationView as Pagination };
