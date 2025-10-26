/** @format */

import { FOOTER_SHOP_DES, SUB_LOGO_URL } from "@/constants";
import { Flex } from "antd";
import React from "react";
import { BsFillHouseFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { Box, Image, Text } from "../elements";

const Footer: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const socialButtonItem = React.useMemo(
        () => [
            {
                name: "Facebook",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/facebook_2.svg?1745145147644",
            },
            {
                name: "Instagram",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/instagram_1.svg?1745145147644",
            },
            {
                name: "Shopee",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/shopee.svg?1745145147644",
            },
            {
                name: "Lazada",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/lazada.svg?1745145147644",
            },
            {
                name: "Tiktok",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/tiktok.svg?1745145147644",
            },
        ],
        []
    );

    const payMethodButtonItem = React.useMemo(
        () => [
            {
                name: "Momo",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_1.png?1745145147644",
            },
            {
                name: "ZaloPay",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_2.png?1745145147644",
            },
            {
                name: "VNPay",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_3.png?1745145147644",
            },
            {
                name: "Moca",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_4.png?1745145147644",
            },
            {
                name: "Visa",
                imgSrc: "http://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_5.png?1745145147644",
            },
            {
                name: "ATM",
                imgSrc: "https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/payment_6.png?1745145147644",
            },
        ],
        []
    );
    return (
        <Flex gap={16} className="flex-wrap">
            <Flex vertical align="flex-start" justify="flex-start" className="flex-1 min-w-[230px] !p-2 order-1">
                <Image src={SUB_LOGO_URL} alt="app-logo" objectFit="cover" clickable height={64} onClick={() => navigate("/")} />
                <Text margin={[0, 0, 16, 0]} size="base" color="#333" titleText={FOOTER_SHOP_DES} />
                <Flex align="center" justify="flex-start" gap={8}>
                    {socialButtonItem.map((item) => (
                        <Image clickable key={item.name} src={item.imgSrc} alt={item.name} height={36} width={36} className="filter hover:!brightness-125 transition duration-300" />
                    ))}
                </Flex>
            </Flex>
            <Flex vertical align="flex-start" justify="flex-start" className="flex-1 min-w-[150px] !p-2 order-2">
                <Text padding={[16, 0, 16, 0]} fontWeight="semibold" textTransform="uppercase" size="xl" color="#333" titleText="Chính sách" />
                <Link to={"/policy/purchasing"} className="text-[#333] text-base hover:!text-[#77e322] !mb-2.5">
                    Chính sách mua hàng
                </Link>
                <Link to={"/policy/payment"} className="text-[#333] text-base hover:!text-[#77e322] !mb-2.5">
                    Chính sách thanh toán
                </Link>
                <Link to={"/policy/shipping"} className="text-[#333] text-base hover:!text-[#77e322] !mb-2.5">
                    Chính sách vận chuyển
                </Link>
                <Link to={"/policy/privacy"} className="text-[#333] text-base hover:!text-[#77e322] !mb-2.5">
                    Chính sách bảo mật
                </Link>
                <Link to={"/policy/membership"} className="text-[#333] text-base hover:!text-[#77e322] !mb-2.5">
                    Chính sách thành viên
                </Link>
                <Link to={"/policy/commitment"} className="text-[#333] text-base hover:!text-[#77e322] !mb-2.5">
                    Cam kết cửa hàng
                </Link>
            </Flex>
            <Flex vertical align="flex-start" justify="flex-start" className="flex-1 min-w-[150px] !p-2 order-3">
                <Text padding={[16, 0, 16, 0]} fontWeight="semibold" textTransform="uppercase" size="xl" color="#333" titleText="Hướng dẫn" />
                <Link to={"/instruction/purchasing"} className="text-[#333] text-base hover:!text-[#77e322] !mb-2.5">
                    Hướng dẫn mua hàng
                </Link>
                <Link to={"/instruction/return"} className="text-[#333] text-base hover:!text-[#77e322] !mb-2.5">
                    Hướng dẫn đổi trả
                </Link>
                <Link to={"/instruction/transfer"} className="text-[#333] text-base hover:!text-[#77e322] !mb-2.5">
                    Hướng dẫn chuyển khoản
                </Link>
                <Link to={"/instruction/installment"} className="text-[#333] text-base hover:!text-[#77e322] !mb-2.5">
                    Hướng dẫn trả góp
                </Link>
                <Link to={"/instruction/refund"} className="text-[#333] text-base hover:!text-[#77e322] !mb-2.5">
                    Hướng dẫn hoàn hàng
                </Link>
            </Flex>

            <Flex vertical align="flex-start" justify="flex-start" className="flex-1 min-w-[200px] !p-2 order-4 sm:!order-5">
                <Text padding={[16, 0, 16, 0]} fontWeight="semibold" textTransform="uppercase" size="xl" color="#333" titleText="Hỗ trợ thanh toán" />
                <Flex align="center" justify="flex-start" wrap gap={8} className="w-full">
                    {payMethodButtonItem.map((item) => (
                        <Image key={item.name} src={item.imgSrc} alt={item.name} height={28} className="filter hover:!brightness-125 transition duration-300" />
                    ))}
                </Flex>
            </Flex>
            <Flex vertical align="flex-start" justify="flex-start" className="flex-1 min-w-[300px] !p-2 order-last sm:order-4">
                <Text padding={[16, 0, 16, 0]} fontWeight="semibold" textTransform="uppercase" size="xl" color="#333" titleText="Liên hệ" />
                <Box className="text-[#333] !mb-1">
                    <Text size="base" as="span" fontWeight="semibold" titleText="Địa chỉ: " />
                    <Text as="span" size="base" className="hover:!text-[#77e322]" titleText="18/33 Đường Nguyễn Văn Thoại, Phường Mỹ An, Quận Ngũ Hành Sơn, TP Đà Nẵng" />
                </Box>
                <Box className="text-[#333] !mb-1">
                    <Text size="base" as="span" fontWeight="semibold" titleText="Điện thoại: " />
                    <Text as="span" size="base" className="hover:!text-[#77e322]" titleText="1900 9518" />
                </Box>
                <Box className="text-[#333] !mb-1">
                    <Text size="base" as="span" fontWeight="semibold" titleText="Zalo: " />
                    <Text as="span" size="base" className="hover:!text-[#77e322]" titleText="0123456789" />
                </Box>
                <Box className="text-[#333] !mb-1">
                    <Text size="base" as="span" fontWeight="semibold" titleText="Email: " />
                    <Text as="span" size="base" className="hover:!text-[#77e322]" titleText="lamine.sportvn@gmail.com" />
                </Box>
                <Box
                    className="w-full !mt-4 flex items-center justify-center gap-1 !text-white !bg-[#002932] !px-2 !py-2 transition-colors duration-300 hover:!bg-[#77e322] hover:!text-[black] [clip-path:polygon(3%_0%,100%_0%,97%_100%,0%_100%)] cursor-pointer"
                    onClick={() => navigate("/all-our-store")}
                >
                    <BsFillHouseFill className="text-xl" />
                    <Text as="span" fontWeight="semibold" size="base" titleText="Chuỗi cửa hàng Lamine Sport" />
                </Box>
            </Flex>
        </Flex>
    );
};

export { Footer };
