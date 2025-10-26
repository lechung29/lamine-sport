/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { Box, Container, Image, Text } from "../elements";
import { Skeleton } from "antd";
import { SportType } from "@/types";
import { isNil } from "lodash";

interface ISportTypeItemProps {
    label: string;
    imgSrc: string;
    value: SportType;
    productCount?: number;
}

const SportTypeItem: React.FunctionComponent<ISportTypeItemProps> = (props) => {
    const { label, imgSrc, value, productCount } = props;
    return (
        <Container bgColor="transparent" className="lex-shrink-0 max-w-[140px] group overflow-hidden cursor-pointer">
            <Box bgColor="#ebeced" className="sm:!p-5 clip-custom-shape" margin={[0, 0, 4, 0]} padding={[16, 16, 16, 16]}>
                <Box className="relative">
                    <Image clickable objectFit="cover" width="100%" height="100%" src={imgSrc} alt="product" className="group-hover:scale-110 transition-all duration-200" />
                </Box>
            </Box>
            <Text textAlign="center" color="#333" fontWeight="bold" size="sm" className="sm:text-base lg:text-lg" titleText={label} margin={[0, 0, 4, 0]} />
            <Box className="relative h-6 text-center" margin={[4, 0, 0, 0]}>
                <Link
                    to={{
                        pathname: "/products",
                        search: `?sportType=${value}`,
                    }}
                    className="w-max absolute left-1/2 -translate-x-1/2 text-xs sm:text-sm font-semibold !text-[#77e322] !underline opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                >
                    Xem chi tiết
                </Link>
                {!isNil(productCount) ? (
                    <Box className="!w-max absolute left-1/2 -translate-x-1/2 text-xs sm:text-sm text-gray-600 opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-4 transition-all duration-300">
                        {`${productCount} sản phẩm`}
                    </Box>
                ) : (
                    <Skeleton.Input active size="small" />
                )}
            </Box>
        </Container>
    );
};

export { SportTypeItem };
