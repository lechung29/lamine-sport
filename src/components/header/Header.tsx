/** @format */

import React from "react";
import { MenuIcon } from "../menu-icon";
import { LOGO_URL } from "@/constants";
import { LuPhoneCall, LuStore } from "react-icons/lu";
import { RiUser3Line } from "react-icons/ri";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Flex, Popover } from "antd";
import { AccountMenu } from "../account-menu";
import { CartMenu } from "../cart-menu";
import { SearchBox } from "../search-box";
import { MenuPanel } from "../menu-panel";
import { Box, Container, Image, Text } from "../elements";
import { cartState, useAppSelector } from "@/redux-store";

const Header: React.FC = () => {
    const [isOpenMenu, setIsOpenMenu] = React.useState<boolean>(false);
    const [isOpenCart, setIsOpenCart] = React.useState<boolean>(false);
    const [isOpenAccount, setIsOpenAccount] = React.useState<boolean>(false);
    const { cartList } = useAppSelector(cartState);
    const navigate = useNavigate();

    return (
        <Container bgColor="transparent" padding={[0, 16, 0, 16]} className="w-full h-full sm:!px-8 lg:!px-[45px] flex flex-col justify-center">
            <Flex align="center" justify="space-between" gap={16} className="w-full md:gap-6">
                <Flex vertical={false} align="center" gap={16} className="h-full md:gap-6">
                    <Box>
                        <MenuIcon onClick={() => setIsOpenMenu(true)} />
                    </Box>
                    <Link to="/">
                        <Image clickable objectFit="cover" src={LOGO_URL} alt="app-logo" className="!h-12 sm:!h-14 lg:!h-16" />
                    </Link>
                </Flex>

                <Box className="hidden lg:block flex-grow max-w-xl">
                    <SearchBox device="computer" />
                </Box>

                <Flex align="center" gap={12} className="sm:gap-5 md:gap-6 lg:gap-6">
                    <Link className="hidden xl:flex items-center justify-center gap-1.5" to="tel:19001900">
                        <LuPhoneCall className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl text-white" />
                        <Flex vertical align="flex-start" className=" text-white">
                            <Text as="span" className="text-[10px] sm:text-[12px]" titleText="Hotline hỗ trợ" />
                            <Text as="span" color="#77e322" fontWeight="medium" className="text-sm sm:text-base leading-4" titleText="1900 9518" />
                        </Flex>
                    </Link>

                    <Link className="hidden md:flex items-center justify-center gap-1.5" to="/all-our-store">
                        <LuStore className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl text-white" />
                        <Flex vertical align="flex-start" className="text-white">
                            <Text as="span" className="text-[10px] sm:text-[12px]" titleText="Hệ thống cửa hàng" />
                            <Text as="span" fontWeight="medium" className="text-sm leading-4" titleText="10 cửa hàng" />
                        </Flex>
                    </Link>
                    <Popover
                        placement="bottomRight"
                        content={<AccountMenu onOpenChange={setIsOpenAccount} />}
                        open={isOpenAccount}
                        onOpenChange={setIsOpenAccount}
                        getPopupContainer={() => document.body}
                        styles={{ body: { zIndex: 9999 } }}
                        trigger="hover"
                    >
                        <Flex align="center" justify="center" gap={6} className="cursor-pointer">
                            <RiUser3Line className="text-3xl text-white" />
                            <Box className="hidden sm:flex flex-col items-start text-white">
                                <Text as="span" className="text-[10px] sm:text-[12px]" titleText="Thông tin" />
                                <Text
                                    as="span"
                                    fontWeight="medium"
                                    className="text-sm leading-4"
                                    titleText={
                                        <Flex>
                                            <Text as="span" titleText="Tài khoản" />
                                            <IoMdArrowDropdown className="text-white" />
                                        </Flex>
                                    }
                                />
                            </Box>
                        </Flex>
                    </Popover>
                    <Popover
                        placement="bottomRight"
                        open={isOpenCart}
                        onOpenChange={setIsOpenCart}
                        content={<CartMenu onOpenChange={setIsOpenCart} />}
                        getPopupContainer={() => document.body}
                        styles={{ body: { zIndex: 9999 } }}
                        trigger="hover"
                    >
                        <Flex align="center" justify="center" gap={6} className="cursor-pointer" onClick={() => navigate("/cart")}>
                            <Badge count={cartList.length} color="#77e322" style={{ color: "black", boxShadow: "none" }}>
                                <MdOutlineShoppingCart className="text-3xl text-white" />
                            </Badge>
                            <Text as="span" className="hidden sm:block text-[10px] sm:text-[12px]" titleText="Giỏ hàng" />
                        </Flex>
                    </Popover>
                </Flex>
            </Flex>

            <Container margin={[8, 0, 0, 0]} className="w-full lg:hidden">
                <SearchBox device="tablet" />
            </Container>

            {isOpenMenu && <MenuPanel isOpen={isOpenMenu} onClose={() => setIsOpenMenu(false)} />}
        </Container>
    );
};

export { Header };
