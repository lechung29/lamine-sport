/** @format */

import React, { useState, useEffect } from "react";
import { Typography, Flex, Spin, Card, Row, Col, Statistic, Tag, Tooltip } from "antd";
import { DollarOutlined, ShoppingCartOutlined, UserAddOutlined, ClockCircleOutlined, RiseOutlined, FallOutlined, LoadingOutlined } from "@ant-design/icons";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Box, Text as TextBase } from "@/components";
import { OrderService } from "@/services/order/OrderService";
import { IDashboardStats, IResponseStatus } from "@/types";
import { formatCurrency } from "@/utils";
import { isNil } from "lodash";

const { Title, Text, Paragraph } = Typography;

interface StatCardData {
    title: string;
    value: string;
    change?: string;
    changeType?: "increase" | "decrease";
    icon: React.ReactNode;
    color: string;
}

const PIE_COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#8884d8"];
const LINE_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#a78bfa"];

const Dashboard: React.FunctionComponent = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [info, setInfo] = useState<IDashboardStats | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const result = await OrderService.getDashboardStats();
                if (result.status === IResponseStatus.Error) {
                    setInfo(null);
                } else {
                    setInfo(result.data || null);
                }
            } catch (error) {
                setInfo(null);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const lineChartData = React.useMemo(() => {
        if (!info?.productTypeRevenueByYear || info.productTypeRevenueByYear.length === 0) {
            return [];
        }

        // const years = info.productTypeRevenueByYear.map((item) => item.year);

        const allProductTypes = new Set<string>();
        info.productTypeRevenueByYear.forEach((yearData) => {
            yearData.data.forEach((item) => {
                allProductTypes.add(item.productType);
            });
        });

        return Array.from(allProductTypes).map((productType) => {
            const dataPoint: any = { name: productType };

            info.productTypeRevenueByYear.forEach((yearData) => {
                const revenue = yearData.data.find((d) => d.productType === productType)?.revenue || 0;
                dataPoint[yearData.year.toString()] = revenue;
            });

            return dataPoint;
        });
    }, [info]);

    const availableYears = React.useMemo(() => {
        if (!info?.productTypeRevenueByYear) return [];
        return info.productTypeRevenueByYear.map((item) => item.year.toString());
    }, [info]);

    const pieChartData = React.useMemo(() => {
        if (!info?.topSellingProducts || info.topSellingProducts.length === 0) {
            return [];
        }

        return info.topSellingProducts.map((product) => ({
            name: product.productName,
            value: product.totalQuantitySold,
            percentage: product.percentage,
            revenue: product.totalRevenue,
        }));
    }, [info]);

    const statCards: StatCardData[] = React.useMemo(() => {
        let cardList: StatCardData[] = [];
        if (!isNil(info?.monthlyOrders) && !isNil(info?.salesPerformance)) {
            cardList.push({
                title: "Đơn hàng đã nhận trong tháng này và tổng quan về hiệu suất bán hàng",
                value: String(info.monthlyOrders.total),
                change: String(info.salesPerformance.percentageChange) + "%",
                changeType: info.salesPerformance.percentageChange >= 0 ? "increase" : "decrease",
                icon: <ShoppingCartOutlined />,
                color: "#6ddf8d",
            });
        }

        if (!isNil(info?.todayRevenue)) {
            cardList.push({
                title: "Doanh số ngày hôm nay",
                value: formatCurrency(info.todayRevenue),
                icon: <DollarOutlined />,
                color: "#a78bfa",
            });
        }
        if (!isNil(info?.monthlyNewUsers)) {
            cardList.push({
                title: "Khách hàng mới đăng ký tài khoản trong tháng này",
                value: String(info.monthlyNewUsers.total),
                change: String(info.monthlyNewUsers.percentageChange) + "%",
                changeType: info.monthlyNewUsers.percentageChange >= 0 ? "increase" : "decrease",
                icon: <UserAddOutlined />,
                color: "#74b9ff",
            });
        }
        if (!isNil(info?.pendingOrders)) {
            cardList.push({
                title: "Số lượng đơn hàng đang chờ xử lý và giao hàng",
                value: String(info.pendingOrders.total),
                icon: <ClockCircleOutlined />,
                color: "#ffc107",
            });
        }
        return cardList;
    }, [info]);

    const CustomPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <Box className="bg-white !p-3 border !border-gray-200 !rounded !shadow-lg">
                    <p className="font-semibold mb-1">{data.name}</p>
                    <p className="text-sm text-gray-600">Số lượng: {data.value}</p>
                    <p className="text-sm text-gray-600">Doanh thu: {formatCurrency(data.revenue)}</p>
                    <p className="text-sm text-green-600 font-medium">{data.percentage}%</p>
                </Box>
            );
        }
        return null;
    };

    return (
        <Flex vertical className="bg-transparent flex-grow min-h-full">
            <Box margin={[0, 0, 24, 0]}>
                <TextBase className="!text-gray-900" size="2xl" fontWeight="bold" titleText="Dashboard" margin={[0, 0, 16, 0]} />
            </Box>
            {loading ? (
                <Flex align="center" justify="center" className="min-h-[300px]">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                </Flex>
            ) : info ? (
                <>
                    <Row gutter={[24, 24]} className="!mb-6" align="stretch">
                        {statCards.map((card, index) => (
                            <Col key={index} xs={24} sm={12} lg={6}>
                                <Card className="!rounded-lg !shadow-sm h-full" style={{ borderLeft: `5px solid ${card.color}` }}>
                                    <Flex justify="space-between" align="flex-start" className="!h-full">
                                        <Flex vertical className="flex-grow !pr-2">
                                            <Tooltip title={card.title} placement="topLeft">
                                                <Paragraph
                                                    className="text-sm text-gray-500 font-normal !mb-1 h-[44px] overflow-hidden"
                                                    ellipsis={{ rows: 2, expandable: false, symbol: "..." }}
                                                    style={{ lineHeight: "22px" }}
                                                >
                                                    {card.title}
                                                </Paragraph>
                                            </Tooltip>
                                            <Statistic value={card.value} className="!mb-1" />
                                            {card.change && (
                                                <Tag
                                                    color={card.changeType === "increase" ? "green" : "red"}
                                                    icon={card.changeType === "increase" ? <RiseOutlined /> : <FallOutlined />}
                                                    className="!min-w-[60px] text-center"
                                                >
                                                    {card.change}
                                                </Tag>
                                            )}
                                        </Flex>
                                        <Box padding={[12, 12, 12, 12]} className="!rounded-full text-white !flex-shrink-0 self-center" style={{ backgroundColor: card.color, fontSize: "24px" }}>
                                            {card.icon}
                                        </Box>
                                    </Flex>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={16}>
                            <Card
                                title={
                                    <Title level={4} className="!mb-0">
                                        Doanh số theo loại sản phẩm qua các năm
                                    </Title>
                                }
                                className="!rounded-lg !shadow-sm h-full"
                            >
                                {lineChartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                                            <RechartsTooltip formatter={(value: any) => formatCurrency(value)} labelStyle={{ color: "#000" }} />
                                            <Legend />
                                            {availableYears.map((year, index) => (
                                                <Line
                                                    key={year}
                                                    type="monotone"
                                                    dataKey={year}
                                                    stroke={LINE_COLORS[index % LINE_COLORS.length]}
                                                    activeDot={{ r: 8 }}
                                                    strokeWidth={2}
                                                    name={`Năm ${year}`}
                                                />
                                            ))}
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Flex align="center" justify="center" className="h-[300px] text-gray-400">
                                        <Text>Chưa có dữ liệu doanh số</Text>
                                    </Flex>
                                )}
                            </Card>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Card
                                title={
                                    <Title level={4} className="!mb-0">
                                        Top 5 sản phẩm bán nhiều nhất
                                    </Title>
                                }
                                className="!rounded-lg !shadow-sm h-full"
                            >
                                {pieChartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percentage }) => `${name}: ${percentage}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {pieChartData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip content={<CustomPieTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Flex align="center" justify="center" className="h-[300px] text-gray-400">
                                        <Text>Chưa có dữ liệu sản phẩm</Text>
                                    </Flex>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </>
            ) : (
                !loading && (
                    <Flex align="center" justify="center" className="min-h-[300px] text-gray-500">
                        <Text>Không có dữ liệu để hiển thị.</Text>
                    </Flex>
                )
            )}
        </Flex>
    );
};

export { Dashboard };
