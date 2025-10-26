/** @format */

import { Box, Container, Text } from "@/components";
import { Flex } from "antd";
import React, { useEffect, useState } from "react";

const Loading: React.FunctionComponent = () => {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <Flex align="center" justify="center" className="min-h-screen bg-white relative overflow-hidden">
            <Container className="absolute !inset-0 pointer-events-none">
                <Box className="absolute top-10 left-10 text-4xl text-gray-200 animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }}>
                    ⚽
                </Box>
                <Box className="absolute top-20 right-16 text-3xl text-gray-200 animate-bounce" style={{ animationDelay: "1s", animationDuration: "4s" }}>
                    🏀
                </Box>
                <Box className="absolute bottom-20 left-20 text-3xl text-gray-200 animate-bounce" style={{ animationDelay: "2s", animationDuration: "3.5s" }}>
                    🏈
                </Box>
                <Box className="absolute bottom-16 right-10 text-4xl text-gray-200 animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}>
                    🎾
                </Box>
                <Box className="absolute top-1/2 left-8 text-3xl text-gray-200 animate-bounce" style={{ animationDelay: "1.5s", animationDuration: "3s" }}>
                    🏐
                </Box>
                <Box className="absolute top-1/3 right-8 text-3xl text-gray-200 animate-bounce" style={{ animationDelay: "2.5s", animationDuration: "4s" }}>
                    🏓
                </Box>
            </Container>

            <Container className="text-center z-10 !px-8">
                <Box className="!mb-8">
                    <Box className="relative">
                        <Flex align="center" justify="center" className="w-24 h-24 !mx-auto bg-gray-100 !rounded-full !border-2 !border-gray-200 !shadow-lg">
                            <Text size="4xl" className="animate-spin-slow">
                                ⚽
                            </Text>
                        </Flex>
                        <Box className="absolute inset-0 w-24 h-24 !mx-auto !border-4 !border-transparent !border-t-[#002d3a] !rounded-full animate-spin"></Box>
                    </Box>
                </Box>

                <Text titleText="Lamine Sport" size="3xl" textAlign="center" fontWeight="bold" margin={[0, 0, 8, 0]} color="#002d3a" />
                <Text titleText="Chuyên gia đồ thể thao uy tín hàng đầu Việt Nam" size="base" margin={[0, 0, 48, 0]} color="#4a5565" />

                <Box margin={[0, 0, 32, 0]}>
                    <Text size="xl" color="#364153" fontWeight="medium" titleText={`Đang chuyển hướng đến trang đích, vui lòng chờ đợi trong giây lát ${dots}`} />
                </Box>

                <Box className="w-100 !mx-auto bg-gray-200 !rounded-full h-2 overflow-hidden">
                    <Box className="h-full bg-gradient-to-r from-[#a2ff00] to-[#77e322] !rounded-full animate-pulse-width" />
                </Box>

                <Flex align="flex-end" justify="center" className="!space-x-2 !mt-12">
                    <Box className="w-3 h-3 bg-blue-500 !rounded-full animate-bounce-ball" style={{ animationDelay: "0s" }} />
                    <Box className="w-3 h-3 bg-green-500 !rounded-full animate-bounce-ball" style={{ animationDelay: "0.2s" }} />
                    <Box className="w-3 h-3 bg-orange-500 !rounded-full animate-bounce-ball" style={{ animationDelay: "0.4s" }} />
                    <Box className="w-3 h-3 bg-red-500 !rounded-full animate-bounce-ball" style={{ animationDelay: "0.6s" }} />
                </Flex>
            </Container>

            <style>{`
                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes pulse-width {
                    0%,
                    100% {
                        width: 0%;
                    }
                    50% {
                        width: 100%;
                    }
                }

                @keyframes bounce-ball {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-12px);
                    }
                }

                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }

                .animate-pulse-width {
                    animation: pulse-width 2s ease-in-out infinite;
                }

                .animate-bounce-ball {
                    animation: bounce-ball 1s ease-in-out infinite;
                }
            `}</style>
        </Flex>
    );
};

export { Loading };
