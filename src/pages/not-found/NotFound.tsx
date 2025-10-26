/** @format */

import { BaseButton, Box, Container, Text } from "@/components";
import { Flex } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface INotFoundPageProps {
    errorMessage?: string;
    backTo?: string
}

const NotFound: React.FunctionComponent<INotFoundPageProps> = ({ errorMessage = "Trang bạn đang tìm kiếm không tồn tại.", backTo = "/" }) => {
    const errorCode = "404";
    const errorTitle = "Oops! Không tìm thấy trang";
    const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setBallPosition({
                x: Math.sin(Date.now() / 1000) * 20,
                y: Math.cos(Date.now() / 1500) * 10,
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    const errorSubMessage = React.useMemo(() => {
        const errorSubMessageList = ["Bàn thắng không được ghi nhận!", "Trọng tài đã thổi còi dừng trận!", "Thẻ đỏ! Bạn không được phép vào sân!"];
        return errorSubMessageList[Math.floor(Math.random() * errorSubMessageList.length)];
    }, []);

    return (
        <Flex align="center" justify="center" className="min-h-screen bg-white relative overflow-hidden">
            <Container className="absolute !inset-0 pointer-events-none hidden lg:block">
                <Box className="absolute top-20 left-16 text-6xl text-gray-100 animate-bounce" style={{ animationDelay: "0s", animationDuration: "4s" }}>
                    ⚽
                </Box>
                <Box className="absolute top-32 right-20 text-4xl text-gray-100 animate-bounce" style={{ animationDelay: "1s", animationDuration: "5s" }}>
                    🥅
                </Box>
                <Box className="absolute bottom-32 left-12 text-5xl text-gray-100 animate-bounce" style={{ animationDelay: "2s", animationDuration: "4.5s" }}>
                    ⚽
                </Box>
                <Box className="absolute bottom-20 right-16 text-4xl text-gray-100 animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "6s" }}>
                    🏆
                </Box>
                <Box className="absolute top-1/2 left-8 text-3xl text-gray-100 animate-bounce" style={{ animationDelay: "1.5s", animationDuration: "5.5s" }}>
                    👕
                </Box>
                <Box className="absolute top-1/3 right-12 text-5xl text-gray-100 animate-bounce" style={{ animationDelay: "3s", animationDuration: "4s" }}>
                    ⚽
                </Box>
            </Container>

            <Container maxWidth="2xl" className="text-center relative z-10 !px-4 sm:!px-8">
                <Box className="!mb-4 relative !bg-transparent">
                    <Box
                        className="inline-block text-8xl transition-transform duration-100"
                        style={{
                            transform: `translate(${ballPosition.x}px, ${ballPosition.y}px) rotate(${ballPosition.x * 2}deg)`,
                        }}
                    >
                        ⚽
                    </Box>
                    <Text size="6xl" color="#d1d5dc" margin={[16, 0, 0, 0]}>
                        🥅
                    </Text>
                </Box>

                <Box className="!mb-6">
                    <Text size="8xl" textTransform="uppercase" fontWeight="semibold" color="#c90000" margin={[0, 0, 8, 0]} className="!tracking-wider" titleText={errorCode} />
                    <Text size="lg" color="#6a7282" className="italic" titleText={errorSubMessage} />
                </Box>

                <Text size="3xl" color="#1e2939" margin={[0, 0, 8, 0]} titleText={errorTitle} />

                <Text size="lg" color="#4a5565" margin={[0, 0, 16, 0]} className="!leading-relaxed" titleText={errorMessage} />

                <Container bgColor="white" padding={[16, 16, 16, 16]} margin={[0, 0, 16, 0]} className="!border-l-4 !border-green-500 !rounded-r-lg">
                    <Flex align="center">
                        <Text as="p" size="2xl" margin={[0, 12, 0, 0]}>
                            ⚽
                        </Text>
                        <Box className="text-left">
                            <Text size="lg" fontWeight="semibold" color="#1e2939" margin={[0, 0, 8, 0]} titleText="Đừng lo lắng, cầu thủ!" />
                            <Text size="base" color="#4a5565" titleText="Mọi đội bóng đều có lúc sút trượt. Hãy về trang chủ và tìm kiếm sản phẩm khác nhé!" />
                        </Box>
                    </Flex>
                </Container>

                <Flex justify="center">
                    <BaseButton
                        radius="lg"
                        padding={[12, 32, 12, 32]}
                        className="!shadow-lg hover:!shadow-xl transform hover:-translate-y-0.5"
                        onClick={() => navigate(backTo)}
                        displayText={
                            <React.Fragment>
                                <Text size="base" as="p" margin={[0, 8, 0, 0]}>
                                    🏠
                                </Text>
                                <Text size="base" titleText="Về trang chủ" />
                            </React.Fragment>
                        }
                    />
                </Flex>

                <Box className="!mt-6">
                    <Flex align="center" justify="center" className="!space-x-4 text-gray-500">
                        <Text size="2xl">⚽</Text>
                        <Text size="base" titleText="Lamine Sport - Nơi ước mơ thể thao thành hiện thực" />
                        <Text size="2xl">⚽</Text>
                    </Flex>
                </Box>
            </Container>
        </Flex>
    );
};

export { NotFound };
