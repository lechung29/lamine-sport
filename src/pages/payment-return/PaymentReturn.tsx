/** @format */

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Result, Spin } from "antd";
import { Container, BaseButton } from "@/components";

const PaymentReturn: React.FunctionComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [message, setMessage] = React.useState("Đang xác thực thanh toán...");

    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        const responseCode = params.get("vnp_ResponseCode");
        const transactionStatus = params.get("vnp_TransactionStatus");

        const success = responseCode === "00" && transactionStatus === "00";
        setIsSuccess(success);
        setMessage(success ? "Thanh toán QR thành công" : "Thanh toán QR không thành công");
        setLoading(false);
    }, [location.search]);

    if (loading) {
        return (
            <Container className="min-h-screen flex items-center justify-center">
                <Spin size="large" />
            </Container>
        );
    }

    return (
        <Container className="min-h-screen flex items-center justify-center">
            <Result
                status={isSuccess ? "success" : "error"}
                title={message}
                subTitle={isSuccess ? "Đơn hàng đã được backend cập nhật tự động." : "Giao dịch không được ghi nhận thành công."}
                extra={[
                    <BaseButton key="orders" displayText="Xem đơn hàng" onClick={() => navigate("/user-management/my-orders")} />,
                    <BaseButton key="home" displayText="Về trang chủ" onClick={() => navigate("/")} />,
                ]}
            />
        </Container>
    );
};

export { PaymentReturn };
