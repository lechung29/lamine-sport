/** @format */

import { BaseButton, BaseInput, BaseTextArea, Box, Breadcrumbs, Container, Text } from "@/components";
import { Flex, Rate } from "antd";
import React from "react";
import { MdPlace, MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { useImmerState } from "@/hooks";
import { isInputOnlyNumber } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useAppSelector, userState } from "@/redux-store";
import { ReviewService } from "@/services";
import { IResponseStatus } from "@/types";
import { useNotification } from "@/context";

interface IContactState {
    fullName: string;
    email: string;
    phoneNumber: string;
    message: string;
    ratingStar: number;
    fullNameError: string;
    emailError: string;
    phoneNumberError: string;
    messageError: string;
    ratingStarError: string;
    isSubmitting: boolean;
}

const initialState: IContactState = {
    email: "",
    fullName: "",
    phoneNumber: "",
    message: "",
    fullNameError: "",
    ratingStar: 0,
    emailError: "",
    phoneNumberError: "",
    ratingStarError: "",
    messageError: "",
    isSubmitting: false,
};

const Contact: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<IContactState>(initialState);
    const { email, fullName, phoneNumber, message, emailError, fullNameError, phoneNumberError, messageError, ratingStarError, ratingStar, isSubmitting } = state;
    const { user } = useAppSelector(userState);
    const notify = useNotification();
    const getFullName = () => {
        return !!user ? user.displayName : fullName;
    };
    const getEmail = () => {
        return !!user ? user.email : email;
    };
    const getPhoneNumber = () => {
        return !!user ? user.phoneNumber : phoneNumber;
    };
    const navigate = useNavigate();
    const onChangeInput = (value: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = event.target;
        if (name === "phoneNumber") {
            isInputOnlyNumber(value) &&
                value.length < 11 &&
                setState((draft) => {
                    draft.phoneNumber = value;
                    draft.phoneNumberError = "";
                });
        } else {
            setState((draft) => {
                draft[name] = value;
                draft[name + "Error"] = "";
            });
        }
    };
    const validateInput = (): boolean => {
        let isValid = true;
        if (!getFullName().trim()) {
            setState({ fullNameError: "Vui lòng để lại họ và tên" });
            isValid = false;
        }

        if (!getEmail().trim()) {
            setState({ emailError: "Vui lòng để lại email" });
            isValid = false;
        }

        if (ratingStar === 0) {
            setState({ ratingStarError: "Vui lòng chọn số sao đánh giá" });
            isValid = false;
        }

        if (!message.trim()) {
            setState({ messageError: "Vui lòng để lại đánh giá" });
            isValid = false;
        }
        return isValid;
    };

    const handleSubmitReview = async () => {
        if (!validateInput()) {
            return Promise.resolve();
        } else {
            setState({ isSubmitting: true });
            const res = await ReviewService.submitReview({
                userId: user?._id || "",
                displayName: getFullName(),
                email: getEmail(),
                phoneNumber: getPhoneNumber(),
                comment: message,
                rating: ratingStar,
            });
            if (res.status === IResponseStatus.Error) {
                notify.error(res.message);
            } else {
                notify.success(res.message);
            }
            setState({ isSubmitting: false, fullNameError: "", emailError: "", phoneNumberError: "", messageError: "", ratingStarError: "", message: "", ratingStar: 0 });
        }
    };
    return (
        <Container className="w-full min-h-screen">
            <Breadcrumbs />

            <Container className="!px-8 lg:!px-[45px] !py-6">
                <Text margin={[0, 0, 15, 0]} size="xl" fontWeight="bold" textTransform="uppercase" className="text-gray-900" titleText="Liện hệ với chúng tôi" />
                <Flex gap={32} className="flex-col lg:flex-row">
                    <Box className="w-full lg:w-2/5">
                        <Text color="#333" size="base" margin={[0, 0, 12, 0]} className="leading-7.5">
                            Lamine Sport - Nhà bán lẻ & phân phối thương hiệu các mặt hàng về thể thao như giày chạy bộ, đồ bơi, kính bơi, giày thể thao, đồ tập gym,... với chất lượng hàng đầu tại
                            Việt Nam.
                        </Text>
                        <Text color="#333" size="base" margin={[0, 0, 12, 0]}>
                            <MdPlace className="!inline text-2xl !mr-2" />
                            <Text size="base" as="span" fontWeight="bold" titleText="Địa chỉ: " />
                            Số 70 Lữ Gia, Phường 15, Quận 11, TP. Hồ Chí Minh
                        </Text>
                        <Text color="#333" size="base" margin={[0, 0, 12, 0]}>
                            <FaPhone className="!inline text-2xl !mr-2" />
                            <Text size="base" as="span" fontWeight="bold" titleText="Hotline: " />
                            1900 9518
                        </Text>
                        <Text color="#333" size="base" margin={[0, 0, 24, 0]}>
                            <MdEmail className="!inline text-2xl !mr-2" />
                            <Text size="base" as="span" fontWeight="bold" titleText="Email: " />
                            support@lamine-sport.vn
                        </Text>
                        <BaseButton
                            className="max-w-[320px]"
                            children="Chuỗi cửa hàng Lamine Sport"
                            width="full"
                            skewPercent={5}
                            margin={[0, 0, 16, 0]}
                            isLoading={isSubmitting}
                            shape="parallelogram"
                            textProps={{
                                fontWeight: 600,
                                size: 16,
                                textTransform: "uppercase",
                            }}
                            onClick={() => navigate("/all-our-store")}
                        />
                    </Box>
                    <Box bgColor="#f5f5f5" padding={[16, 16, 16, 16]} className="w-full lg:w-3/5">
                        <Flex gap={16} className="!mb-4">
                            <Box className="flex-1">
                                <BaseInput
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Họ và tên"
                                    type="text"
                                    isError={!!fullNameError}
                                    value={getFullName()}
                                    disabled={!!user || isSubmitting}
                                    onChange={onChangeInput}
                                />
                                {fullNameError && <Text as="p" margin={[4, 0, 0, 0]} color="#fb2c36" titleText={fullNameError} />}
                            </Box>
                            <Box className="flex-1">
                                <BaseInput
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    type="text"
                                    isError={!!emailError}
                                    value={getEmail()}
                                    disabled={!!user || isSubmitting}
                                    onChange={onChangeInput}
                                />
                                {emailError && <Text as="p" margin={[4, 0, 0, 0]} color="#fb2c36" titleText={emailError} />}
                            </Box>
                        </Flex>
                        <Flex vertical align="flex-start" justify="center" className="!mb-4">
                            <BaseInput
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="Số điện thoại"
                                type="text"
                                isError={!!phoneNumberError}
                                value={getPhoneNumber()}
                                disabled={!!user?.phoneNumber || isSubmitting}
                                onChange={onChangeInput}
                            />
                            {phoneNumberError && <Text as="p" margin={[4, 0, 0, 0]} color="#fb2c36" titleText={phoneNumberError} />}
                        </Flex>
                        <Flex vertical align="flex-start" justify="center" className="!mb-4">
                            <Rate value={ratingStar} onChange={(newStart) => setState({ ratingStar: newStart, ratingStarError: "" })} />
                            {ratingStarError && <Text as="p" margin={[4, 0, 0, 0]} color="#fb2c36" titleText={ratingStarError} />}
                        </Flex>
                        <Flex vertical align="flex-start" justify="center" className="!mb-4">
                            <BaseTextArea
                                id="message"
                                name="message"
                                placeholder="Đánh giá của bạn"
                                type="text"
                                isError={!!messageError}
                                rows={5}
                                value={message}
                                disabled={isSubmitting}
                                onChange={onChangeInput}
                            />
                            {messageError && <Text as="p" margin={[4, 0, 0, 0]} color="#fb2c36" titleText={messageError} />}
                        </Flex>
                        <Flex align="center" justify="flex-end">
                            <BaseButton
                                className="max-w-[200px]"
                                children="Gửi đánh giá"
                                width="full"
                                skewPercent={5}
                                margin={[0, 0, 16, 0]}
                                isLoading={isSubmitting}
                                shape="parallelogram"
                                textProps={{
                                    fontWeight: 600,
                                    size: 16,
                                    textTransform: "uppercase",
                                }}
                                onClick={handleSubmitReview}
                            />
                        </Flex>
                    </Box>
                </Flex>
            </Container>
        </Container>
    );
};

export { Contact };
