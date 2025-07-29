/** @format */

import { SUB_LOGO_URL } from "@/constants";
import { Badge, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { FaCircleUser } from "react-icons/fa6";
import { Radio } from "antd";
import "./Payment.scss";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { MdChevronLeft } from "react-icons/md";
import { TooltipLabel } from "@/components";

const { Search } = Input;

const Payment: React.FunctionComponent = () => {
    const [paymentMethod, setPaymentMethod] = React.useState<number>(1);
    return (
        <section className="!min-h-screen w-full flex items-start justify-center bg-white !pl-7">
            <div className="min-h-screen w-full lg:w-2/3 !px-7 !py-10">
                <header className="w-full !pb-5 flex justify-center">
                    <img src={SUB_LOGO_URL} alt="app-logo" className="!h-16 w-auto cursor-pointer object-cover" />
                </header>
                <div className="flex items-start justify-center">
                    <div className="flex-1/2 !px-3.5">
                        <div className="flex items-center justify-between">
                            <div className="font-bold text-[#333] text-lg">Thông tin nhận hàng</div>
                            <div className="w-auto flex items-center justify-center gap-1 cursor-pointer text-[#2a9dcc] hover:text-[#2a6395]">
                                <FaCircleUser className="text-xl" />
                                <span>Đăng nhập</span>
                            </div>
                        </div>
                        <Input className="!mt-3" allowClear size="large" placeholder="Email" />
                        <Input className="!mt-3" allowClear size="large" placeholder="Họ và tên" />
                        <Input className="!mt-3" allowClear size="large" placeholder="Số diện thoại" />
                        <Input className="!mt-3" allowClear size="large" placeholder="Địa chỉ" />
                        <TextArea className="!mt-3" rows={4} placeholder="Ghi chú (Tùy chọn)" maxLength={6} />
                    </div>
                    <div className="flex-1/2 !px-3.5">
                        <div>
                            <div className="font-bold text-[#333] text-lg">Vận chuyển</div>
                            <div className="!mt-3 flex items-center justify-between !border !border-[#cecdcd] !p-3.5 !rounded-md">
                                <Radio.Group name="radiogroup" defaultValue={1} className="gap-2" options={[{ value: 1, label: "Giao hàng tận nơi" }]} />
                                <span className="text-[#333]">40.000đ</span>
                            </div>
                        </div>
                        <div className="!mt-5">
                            <div className="font-bold text-[#333] text-lg">Thanh toán</div>
                            <div className="!mt-3 !border !border-[#cecdcd] !rounded-md">
                                <div className="flex items-center justify-between !p-3.5 cursor-pointer" onClick={() => setPaymentMethod(1)}>
                                    <Radio.Group
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        name="radiogroup"
                                        value={paymentMethod}
                                        className="gap-2"
                                        options={[{ value: 1, label: "Chuyển khoản" }]}
                                    />
                                    <FaRegMoneyBillAlt className="cursor-pointer text-2xl text-[#337ab7]" />
                                </div>
                                <hr className="w-full !border-[#cecdcd]" />
                                <div className="flex items-center justify-between !p-3.5 cursor-pointer" onClick={() => setPaymentMethod(2)}>
                                    <Radio.Group
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        name="radiogroup"
                                        value={paymentMethod}
                                        className="gap-2"
                                        options={[{ value: 2, label: "Thu hộ (COD)" }]}
                                    />
                                    <FaRegMoneyBillAlt className="text-2xl text-[#337ab7]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="min-h-screen w-full lg:w-1/3 !px-7 !py-5 !border-l !border-[#cecdcd] bg-[#fafafa] overflow-hidden">
                <div className="!pb-4 !border-b !border-[#cecdcd] font-bold text-xl">{"Đơn hàng (1 sản phẩm)"}</div>
                <div className="!py-2 !border-b !border-[#cecdcd]">
                    <div className="w-full !py-3.5 flex items-center justify-center overflow-hidden">
                        <Badge size="default" color="#2a9dcc" count={1}>
                            <div className="w-14 !border !border-[#0000001a] !rounded-md overflow-hidden">
                                <img
                                    src="https://bizweb.dktcdn.net/thumb/large/100/490/431/products/p2153206-29707430-823a-4953-a110-d76779a25e57.jpg?v=1693677894677"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </Badge>
                        <div className="flex-1 flex flex-col !px-4">
                            <TooltipLabel text="SẢN PHẨM KALENJI Giày chạy bộ JOGFLOW 500.1 cho nam 2" className="text-sm" width="auto" lineDisplayed={2} />
                            <p className="text-xs text-[#717171]">38 / Xanh dương</p>
                        </div>
                        <div className="w-14 text-sm text-[#717171]">175.000đ</div>
                    </div>
                </div>
                <div className="!py-4 !border-b !border-[#cecdcd]">
                    <Search className="!mb-1" status="error" placeholder="Nhập mã giảm giá" enterButton="Áp dụng" size="large" />
                    <p className="text-[#c10000] text-sm">Vui lòng nhập mã giảm giá</p>
                </div>
                <div className="!pb-4 !pt-6 !border-b !border-[#cecdcd] text-[#717171]">
                    <div className="flex items-center justify-between !mb-3">
                        <span>Tạm tính</span>
                        <span>175.000đ</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Phí vận chuyển</span>
                        <span>40.000đ</span>
                    </div>
                </div>
                <div className="!py-4 text-[#717171]">
                    <div className="flex items-center justify-between !mb-3">
                        <span className="text-xl">Tổng cộng</span>
                        <span className="text-[#2a9dcc] text-2xl">215.000đ</span>
                    </div>
                    <div className="flex items-center justify-between !mb-3">
                        <div className="inline-flex items-center justify-center gap-0.5 cursor-pointer text-[#2a9dcc] hover:text-[#2a6395]">
                            <MdChevronLeft className="text-sm" />
                            <span className="text-sm">Quay về giỏ hàng</span>
                        </div>
                        <div className="w-30 !py-2.5 !rounded-md uppercase text-center bg-[#357ebd] hover:bg-[#2a6395] text-white cursor-pointer">
                            Đặt hàng
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Payment };
