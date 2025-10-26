/** @format */

import { SUB_LOGO_URL } from "@/constants";
import { Badge, Input, Collapse, Flex } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { FaCircleUser } from "react-icons/fa6";
import { Radio } from "antd";
import "./Payment.scss";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { MdChevronLeft } from "react-icons/md";
import { BaseButton, Box, Container, Image, Text, TooltipLabel } from "@/components";
import { useNavigate } from "react-router-dom";
import { cartState, clearCart, ICartItem, useAppDispatch, useAppSelector, userState } from "@/redux-store";
import { AccountLockedError, delayTime, formatCurrency, isInputOnlyNumber, UnauthorizedError } from "@/utils";
import { CouponValueType, ICouponData, IResponseStatus } from "@/types";
import { CouponService } from "@/services";
import { useNotification } from "@/context";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { OrderService } from "@/services/order/OrderService";
import { IOrderPayment } from "@/types/orders";

const { Search } = Input;
const { Panel } = Collapse;

interface CartItemProps {
    item: ICartItem;
}

const OrderItem: React.FunctionComponent<CartItemProps> = (props) => {
    const { item } = props;

    const getColorName = () => {
        return item.productColors.find((color) => color.value === item.selectedProductColorValue)?.name!;
    };

    const itemTotalPrice = () => {
        const unitPrice = item.salePrice ?? item.originalPrice;
        return item.selectedProductCount * unitPrice;
    };

    return (
        <Flex align="center" justify="center" className="w-full !py-3.5 overflow-hidden">
            <Badge size="default" color="#2a9dcc" count={item.selectedProductCount}>
                <Box className="w-14 !border !border-[#0000001a] !rounded-md overflow-hidden">
                    <Image src={item.productColors.find((color) => color.value === item.selectedProductColorValue)?.images[0].url!} className="w-full h-auto object-cover" />
                </Box>
            </Badge>
            <Flex vertical className="flex-1 !px-4">
                <TooltipLabel text={props.item.productName} className="text-sm" width="auto" lineDisplayed={2} />
                <Text color="#7f7f7f" size="xs" titleText={`${!!props.item.selectedProductSize ? `${props.item.selectedProductSize} / ` : ""}${getColorName()}`} />
            </Flex>
            <Text as="span" color="#717171" size="base" titleText={formatCurrency(itemTotalPrice())} />
        </Flex>
    );
};

const Payment: React.FunctionComponent = () => {
    const { user } = useAppSelector(userState);
    const { cartList } = useAppSelector(cartState);
    const [email, setEmail] = React.useState<string>(user?.email ?? "");
    const [displayName, setDisplayName] = React.useState<string>(user?.displayName ?? "");
    const [phoneNumber, setPhoneNumber] = React.useState<string>(user?.phoneNumber ?? "");
    const [address, setAddress] = React.useState<string>("");
    const [note, setNote] = React.useState<string>("");
    const [couponErrorMessage, setCouponErrorMessage] = React.useState<string>("");
    const [couponCode, setCouponCode] = React.useState<string>("");
    const [isValidatingCoupon, setIsValidatingCoupon] = React.useState<boolean>(false);
    const [appliedCoupon, setAppliedCoupon] = React.useState<ICouponData | null>(null);
    const [paymentMethod, setPaymentMethod] = React.useState<number>(IOrderPayment.COD);
    const [collapseActiveKey, setCollapseActiveKey] = React.useState<string | string[]>(["1"]);
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const notify = useNotification();
    const dispatch = useAppDispatch();
    const handleCollapseChange = (key: string | string[]) => {
        setCollapseActiveKey(key);
    };

    const getTotalPrice = React.useCallback(() => {
        let total: number = 0;
        cartList.forEach((item) => {
            const unitPrice: number = item.salePrice ?? item.originalPrice;
            total += unitPrice * item.selectedProductCount;
        });
        return total;
    }, [cartList]);

    const isFreeShipping = React.useMemo(() => {
        const totalPrice = getTotalPrice();
        const targetPrice = 450000;
        return totalPrice >= targetPrice;
    }, [cartList]);

    const discountPrice = React.useMemo(() => {
        let tempTotalPrice = getTotalPrice();
        if (appliedCoupon?.valueType === CouponValueType.FixedAmount) {
            return appliedCoupon.value;
        } else if (appliedCoupon?.valueType === CouponValueType.Percent) {
            const salePriceByPercent = (tempTotalPrice * appliedCoupon.value) / 100;
            const applyCouponMaxSalePrice = appliedCoupon?.maxValue;
            const finalSalePriceByPercent = applyCouponMaxSalePrice ? (salePriceByPercent > applyCouponMaxSalePrice ? applyCouponMaxSalePrice : salePriceByPercent) : salePriceByPercent;
            return finalSalePriceByPercent;
        }
        return 0;
    }, [appliedCoupon, getTotalPrice]);

    const finalTotalPrice = React.useMemo(() => {
        let tempTotalPrice = getTotalPrice() - discountPrice;

        if (!isFreeShipping) {
            tempTotalPrice = tempTotalPrice + 40000;
        }
        return tempTotalPrice;
    }, [appliedCoupon, cartList]);

    const validateInput = (displayName: string, email: string, phoneNumber: string, address: string) => {
        if (!email) {
            return {
                isValid: false,
                errorMessage: "Vui lòng nhập email nhận hàng",
            };
        }
        if (!displayName) {
            return {
                isValid: false,
                errorMessage: "Vui lòng nhập họ tên người nhận hàng",
            };
        }

        if (!phoneNumber) {
            return {
                isValid: false,
                errorMessage: "Vui lòng nhập số điện thoại nhận hàng",
            };
        }

        if (!address) {
            return {
                isValid: false,
                errorMessage: "Vui lòng nhập địa chỉ nhận hàng",
            };
        }

        if (!!email) {
            const emailRegex =
                /^(?:[a-zA-Z0-9!#$%&"*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&"*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)$/;
            if (!email.match(emailRegex)) {
                return {
                    isValid: false,
                    errorMessage: "Địa chỉ email đã nhập không hợp lệ. Vui lòng đảm bảo rằng nó đúng theo định dạng email (ví dụ: name@example.com)",
                };
            }
        }

        if (!!displayName) {
            const nameRegex = /^(?:\p{Lu}\p{Ll}*)(?:\s\p{Lu}\p{Ll}*)*$/u;
            if (!displayName.match(nameRegex)) {
                return {
                    isValid: false,
                    errorMessage: "Tên người nhận hàng chỉ chứa chữ cái, bắt đầu bằng chữ in hoa và không được bao gồm số hoặc ký tự đặc biệt",
                };
            }
        }

        if (!!phoneNumber && phoneNumber[0] !== "0") {
            return {
                isValid: false,
                errorMessage: "Số điện thoại phải bằng đầu bằng 0",
            };
        }

        return {
            isValid: true,
            errorMessage: "",
        };
    };

    const validateCoupon = async () => {
        try {
            setIsValidatingCoupon(true);
            if (!couponCode) {
                setCouponErrorMessage("Vui lòng nhập mã giảm giá để kiểm tra");
                setIsValidatingCoupon(false);
                return Promise.resolve();
            }
            const data = await CouponService.validateCoupon(couponCode, user?._id);
            setIsValidatingCoupon(false);
            if (data.status === IResponseStatus.Error) {
                setCouponErrorMessage(data.message!);
            } else {
                notify.success(data.message);
                setAppliedCoupon(data.data!);
            }
        } catch (error) {
            setIsValidatingCoupon(false);
        }
    };

    const handleCreateOrder = async () => {
        try {
            setIsSubmitting(true);
            const { isValid, errorMessage } = validateInput(displayName.trim(), email.trim(), phoneNumber.trim(), address.trim());
            if (!user) {
                notify.error("Bạn chưa đăng nhập, vui lòng đăng nhập để đặt hàng");
                setIsSubmitting(false);
                return Promise.resolve();
            } else if (!isValid) {
                notify.error(errorMessage);
                setIsSubmitting(false);
                return Promise.resolve();
            }
            const data = await OrderService.createOrder({
                paymentMethod: paymentMethod,
                productsFees: getTotalPrice(),
                shippingFees: isFreeShipping ? 0 : 40000,
                discountValue: discountPrice,
                couponCode: appliedCoupon?.couponCode,
                totalPrice: finalTotalPrice,
                shippingInfo: {
                    emailReceived: email,
                    receiver: displayName,
                    phoneNumberReceived: phoneNumber,
                    address,
                    note,
                },
                orderItems: cartList.map((item: ICartItem) => ({
                    product: (() => {
                        const { selectedProductColorValue: selectedProductColorId, selectedProductCount, selectedProductSize, ...rest } = item;
                        return rest;
                    })(),
                    quantity: item.selectedProductCount,
                    selectedColor: item.selectedProductColorValue,
                    selectedSize: item.selectedProductSize,
                    unitPrice: item.salePrice ?? item.originalPrice,
                })),
            });
            setIsSubmitting(false);
            if (data.status === IResponseStatus.Error) {
                notify.error(data.message);
            } else {
                notify.success(data.message);
                dispatch(clearCart());
                await delayTime(1500).then(() => navigate("/user-management/my-orders"));
            }
        } catch (error) {
            if (error instanceof UnauthorizedError || error instanceof AccountLockedError) {
                return;
            }
            notify.error("Có lỗi xảy ra khi đặt đơn hàng");
        }
    };

    return (
        <Container bgColor="white" className="min-h-screen flex flex-col items-center justify-center">
            <Box className="w-full items-start justify-center hidden md:flex">
                <Box padding={[40, 28, 40, 28]} className="min-h-screen w-full lg:w-2/3">
                    <Flex justify="center" className="!pb-5">
                        <Image clickable src={SUB_LOGO_URL} objectFit="cover" alt="app-logo" className="!h-16 w-auto" onClick={() => navigate("/")} />
                    </Flex>
                    <Flex align="flex-start" justify="center" gap={20} className="flex-col lg:flex-row">
                        <Box padding={[0, 14, 0, 14]} className="w-full lg:w-1/2">
                            <Flex align="center" justify="space-between">
                                <Text fontWeight="bold" color="#333" size="lg" titleText="Thông tin nhận hàng" />
                                {!user && (
                                    <Flex align="center" justify="center" gap={4} className="w-auto cursor-pointer text-[#2a9dcc] hover:text-[#2a6395]" onClick={() => navigate("/login")}>
                                        <FaCircleUser className="text-xl" />
                                        <Text as="span" titleText="Đăng nhập" />
                                    </Flex>
                                )}
                            </Flex>
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="!mt-3" allowClear size="large" placeholder="Email nhận đơn" />
                            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="!mt-3" allowClear size="large" placeholder="Họ và tên người nhận hàng" />
                            <Input
                                value={phoneNumber}
                                onChange={(e) => {
                                    if (isInputOnlyNumber(e.target.value) && e.target.value.length < 11) {
                                        setPhoneNumber(e.target.value);
                                    }
                                }}
                                className="!mt-3"
                                allowClear
                                size="large"
                                placeholder="Số điện thoại nhận hàng"
                            />
                            <Input value={address} onChange={(e) => setAddress(e.target.value)} className="!mt-3" allowClear size="large" placeholder="Địa chỉ nhận hàng" />
                            <TextArea value={note} onChange={(e) => setNote(e.target.value)} className="!mt-3" rows={4} placeholder="Ghi chú (Tùy chọn)" maxLength={1000} />
                        </Box>
                        <Box padding={[0, 14, 0, 14]} className="w-full lg:w-1/2">
                            <Box>
                                <Text fontWeight="bold" color="#333" size="lg" titleText="Vận chuyển" />
                                <Flex align="center" justify="space-between" className="!mt-3 !border !border-[#cecdcd] !p-3.5 !rounded-md">
                                    <Radio.Group name="radiogroup" defaultValue={1} className="gap-2" options={[{ value: 1, label: "Giao hàng tận nơi" }]} />
                                    {!isFreeShipping && <Text color="#333" titleText={formatCurrency(40000)} />}
                                </Flex>
                            </Box>
                            <Box margin={[20, 0, 0, 0]}>
                                <Text fontWeight="bold" color="#333" size="lg" titleText="Thanh toán" />
                                <Box margin={[12, 0, 0, 0]} className="!border !border-[#cecdcd] !rounded-md">
                                    <Flex align="center" justify="space-between" className="!p-3.5 cursor-not-allowed">
                                        <Radio.Group
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            name="radiogroup"
                                            value={paymentMethod}
                                            className="gap-2"
                                            disabled
                                            options={[{ value: IOrderPayment.Transfer, label: "Chuyển khoản" }]}
                                        />
                                        <FaRegMoneyBillAlt className="cursor-pointer text-2xl text-[#337ab7]" />
                                    </Flex>
                                    <hr className="w-full !border-[#cecdcd]" />
                                    <Flex align="center" justify="space-between" className="!p-3.5 cursor-pointer" onClick={() => setPaymentMethod(IOrderPayment.COD)}>
                                        <Radio.Group
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            name="radiogroup"
                                            value={paymentMethod}
                                            className="gap-2"
                                            options={[{ value: IOrderPayment.COD, label: "Thu hộ (COD)" }]}
                                        />
                                        <FaRegMoneyBillAlt className="text-2xl text-[#337ab7]" />
                                    </Flex>
                                </Box>
                            </Box>
                        </Box>
                    </Flex>
                </Box>
                <Box padding={[20, 28, 20, 28]} bgColor="white" className="d-payment-order-info-collapse min-h-screen w-full lg:w-1/3 !border-l !border-[#cecdcd] overflow-hidden">
                    <Collapse defaultActiveKey={["1"]} bordered={false} onChange={handleCollapseChange}>
                        <Panel
                            header={
                                <Flex align="center" justify="space-between">
                                    <Text color="#333" fontWeight="bold" size="xl" titleText={`Đơn hàng (${cartList.length} sản phẩm)`} />
                                </Flex>
                            }
                            key="1"
                            className="!pb-0 !px-0 !border-b !border-[#cecdcd] collapse-desktop-panel"
                        >
                            <Box className="">
                                {cartList.map((cartItem) => (
                                    <OrderItem key={cartItem._id} item={cartItem} />
                                ))}
                            </Box>
                        </Panel>
                    </Collapse>
                    <Box padding={[16, 0, 16, 0]} className="!border-b !border-[#cecdcd]">
                        <Flex align="center" justify="center" gap={8}>
                            {appliedCoupon && <IoIosCheckmarkCircle size={24} color="#77e322" />}
                            <Search
                                className="!mb-1"
                                status={couponErrorMessage ? "error" : undefined}
                                value={couponCode}
                                onChange={(e) => {
                                    setCouponCode(e.target.value.toLocaleUpperCase());
                                    setAppliedCoupon(null);
                                    setCouponErrorMessage("");
                                }}
                                placeholder="Nhập mã giảm giá"
                                onSearch={validateCoupon}
                                disabled={isValidatingCoupon}
                                loading={isValidatingCoupon}
                                enterButton="Áp dụng"
                                size="large"
                            />
                        </Flex>
                        {couponErrorMessage && <Text size="sm" color="#c10000" titleText={couponErrorMessage} />}
                    </Box>
                    <Box padding={[24, 0, 16, 0]} className="!border-b !border-[#cecdcd] text-[#717171]">
                        <Flex align="center" justify="space-between" className="!mb-3">
                            <Text as="span" titleText="Tạm tính" />
                            <Text as="span" color="#2a9dcc" titleText={formatCurrency(getTotalPrice())} />
                        </Flex>
                        <Flex align="center" justify="space-between" className="!mb-3">
                            <Text as="span" titleText="Phí vận chuyển" />
                            <Text as="span" color="#2a9dcc" titleText={isFreeShipping ? "Miễn phí" : formatCurrency(40000)} />
                        </Flex>
                        {appliedCoupon && (
                            <Flex align="center" justify="space-between">
                                <Text as="span" titleText="Giảm giá" />
                                <Text as="span" color="#c10000" titleText={`- ${discountPrice} VNĐ`} />
                            </Flex>
                        )}
                    </Box>
                    <Box padding={[16, 0, 16, 0]} className="text-[#717171]">
                        <Flex align="center" justify="space-between" className="!mb-3">
                            <Text as="span" size="xl" titleText="Tổng cộng" />
                            <Text as="span" size="2xl" color="#2a9dcc" titleText={formatCurrency(finalTotalPrice)} />
                        </Flex>
                        <Flex align="center" justify="space-between" className="!mb-3">
                            <Box className="inline-flex items-center justify-center gap-0.5 cursor-pointer text-[#2a9dcc] hover:text-[#2a6395]">
                                <MdChevronLeft className="text-sm" />
                                <Text as="span" size="sm" titleText="Quay về giỏ hàng" onClick={() => navigate("/cart")} />
                            </Box>
                            <BaseButton
                                className="w-30 !py-2.5 !rounded-md uppercase text-center !bg-[#357ebd] hover:!bg-[#2a6395] !text-white"
                                displayText="Đặt hàng"
                                onClick={handleCreateOrder}
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                            />
                        </Flex>
                    </Box>
                </Box>
            </Box>

            <Flex vertical className="w-full md:!hidden items-start justify-center lg:gap-14">
                <Flex justify="center" className="w-full !pb-5 !mt-8">
                    <Image clickable objectFit="cover" src={SUB_LOGO_URL} alt="app-logo" className="!h-16 w-auto" />
                </Flex>
                <Box margin={[0, 0, 16, 0]} padding={[0, 42, 0, 42]} className="w-full m-payment-order-info-collapse">
                    <Collapse className="mobile-order-collapse" bordered={false} onChange={handleCollapseChange} activeKey={collapseActiveKey} expandIcon={undefined}>
                        <Panel
                            header={
                                <Flex align="center" justify="space-between">
                                    <Flex align="center" justify="center" gap={4} className="cursor-pointer text-[#333]">
                                        <Text as="span" size="xl" fontWeight="bold" titleText={`Đơn hàng (${cartList.length} sản phẩm)`} />
                                    </Flex>
                                    <Text as="span" color="#357ebd" size="xl" fontWeight="bold" titleText={formatCurrency(getTotalPrice())} />
                                </Flex>
                            }
                            key="1"
                        >
                            <Box className="!border-b !border-[#cecdcd]">
                                {cartList.map((cartItem) => (
                                    <OrderItem key={cartItem._id} item={cartItem} />
                                ))}
                            </Box>
                        </Panel>
                    </Collapse>
                    <Box className="!pb-4 !pt-2 !border-b !border-[#cecdcd]">
                        <Search
                            className="!mb-1"
                            status={couponErrorMessage ? "error" : undefined}
                            value={couponCode}
                            onChange={(e) => {
                                setCouponCode(e.target.value.toLocaleUpperCase());
                                setAppliedCoupon(null);
                                setCouponErrorMessage("");
                            }}
                            placeholder="Nhập mã giảm giá"
                            onSearch={validateCoupon}
                            disabled={isValidatingCoupon}
                            loading={isValidatingCoupon}
                            enterButton="Áp dụng"
                            size="large"
                        />
                        {couponErrorMessage && <Text size="sm" color="#c10000" titleText={couponErrorMessage} />}
                    </Box>
                </Box>
                <Flex vertical gap={20} className="w-full !px-7 !bg-white">
                    <Box padding={[0, 10, 0, 10]}>
                        <Flex align="center" justify="space-between">
                            <Text fontWeight="bold" color="#333" size="lg" titleText="Thông tin nhận hàng" />
                            {!user && (
                                <Flex align="center" justify="center" gap={4} className="w-auto cursor-pointer text-[#2a9dcc] hover:text-[#2a6395]">
                                    <FaCircleUser className="text-xl" />
                                    <Text as="span" titleText="Đăng nhập" />
                                </Flex>
                            )}
                        </Flex>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} className="!mt-3" allowClear size="large" placeholder="Email" />
                        <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="!mt-3" allowClear size="large" placeholder="Họ và tên" />
                        <Input
                            value={phoneNumber}
                            onChange={(e) => {
                                if (isInputOnlyNumber(e.target.value) && e.target.value.length < 11) {
                                    setPhoneNumber(e.target.value);
                                }
                            }}
                            className="!mt-3"
                            allowClear
                            size="large"
                            placeholder="Số điện thoại"
                        />
                        <Input value={address} onChange={(e) => setAddress(e.target.value)} className="!mt-3" allowClear size="large" placeholder="Địa chỉ" />
                        <TextArea value={note} onChange={(e) => setNote(e.target.value)} className="!mt-3" rows={4} placeholder="Ghi chú (Tùy chọn)" maxLength={1000} />
                    </Box>
                    <Box padding={[0, 10, 0, 10]}>
                        <Box>
                            <Text fontWeight="bold" color="#333" size="lg" titleText="Vận chuyển" />
                            <Flex align="center" justify="space-between" className="!mt-3 !border !border-[#cecdcd] !p-3.5 !rounded-md">
                                <Radio.Group name="radiogroup" defaultValue={1} className="gap-2" options={[{ value: 1, label: "Giao hàng tận nơi" }]} />
                                {!isFreeShipping && <Text color="#333" titleText={formatCurrency(40000)} />}
                            </Flex>
                        </Box>
                        <Box margin={[20, 0, 0, 0]}>
                            <Text fontWeight="bold" color="#333" size="lg" titleText="Thanh toán" />
                            <Box margin={[12, 0, 0, 0]} className="!border !border-[#cecdcd] !rounded-md">
                                <Flex align="center" justify="space-between" className="!p-3.5 cursor-not-allowed">
                                    <Radio.Group
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        name="radiogroup"
                                        value={paymentMethod}
                                        className="gap-2"
                                        disabled
                                        options={[{ value: IOrderPayment.Transfer, label: "Chuyển khoản" }]}
                                    />
                                    <FaRegMoneyBillAlt className="cursor-pointer text-2xl text-[#337ab7]" />
                                </Flex>
                                <hr className="w-full !border-[#cecdcd]" />
                                <Flex align="center" justify="space-between" className="!p-3.5 cursor-pointer" onClick={() => setPaymentMethod(IOrderPayment.COD)}>
                                    <Radio.Group
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        name="radiogroup"
                                        value={paymentMethod}
                                        className="gap-2"
                                        options={[{ value: IOrderPayment.COD, label: "Thu hộ (COD)" }]}
                                    />
                                    <FaRegMoneyBillAlt className="text-2xl text-[#337ab7]" />
                                </Flex>
                            </Box>
                        </Box>
                    </Box>
                </Flex>
                <Box padding={[24, 28, 0, 28]} className="w-full text-[#717171]">
                    <Box padding={[16, 14, 16, 14]} className="!border-b !border-[#cecdcd] text-[#717171]">
                        <Flex align="center" justify="space-between" className="!mb-3">
                            <Text as="span" titleText="Tạm tính" />
                            <Text as="span" color="#2a9dcc" titleText={formatCurrency(getTotalPrice())} />
                        </Flex>
                        <Flex align="center" justify="space-between" className="!mb-3">
                            <Text as="span" titleText="Phí vận chuyển" />
                            <Text as="span" color="#2a9dcc" titleText={isFreeShipping ? "Miễn phí" : formatCurrency(40000)} />
                        </Flex>
                        {appliedCoupon && (
                            <Flex align="center" justify="space-between">
                                <Text as="span" titleText="Giảm giá" />
                                <Text as="span" color="#c10000" titleText={`- ${discountPrice} VNĐ`} />
                            </Flex>
                        )}
                    </Box>
                    <Box padding={[16, 14, 16, 14]} className="text-[#717171]">
                        <Flex align="center" justify="space-between" className="!mb-3">
                            <Text as="span" size="xl" titleText="Tổng cộng" />
                            <Text as="span" size="2xl" color="#2a9dcc" titleText={formatCurrency(finalTotalPrice)} />
                        </Flex>
                        <Flex align="center" justify="space-between" className="!mb-3">
                            <Box className="inline-flex items-center justify-center gap-0.5 cursor-pointer text-[#2a9dcc] hover:text-[#2a6395]">
                                <MdChevronLeft className="text-sm" />
                                <Text as="span" size="sm" titleText="Quay về giỏ hàng" onClick={() => navigate("/cart")} />
                            </Box>
                            <BaseButton
                                className="w-30 !py-2.5 !rounded-md uppercase text-center !bg-[#357ebd] hover:!bg-[#2a6395] !text-white"
                                displayText="Đặt hàng"
                                onClick={handleCreateOrder}
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                            />
                        </Flex>
                    </Box>
                </Box>
            </Flex>
        </Container>
    );
};

export { Payment };
