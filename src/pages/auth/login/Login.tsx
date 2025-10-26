/** @format */
import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Flex } from "antd";
import { BaseInput, BaseButton, Container, Text, Title, Image } from "@/components";
import { useImmerState } from "@/hooks";
import { useNotification } from "@/context";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validateSignIn } from "./utils/validation";
import { AuthService, ProductService } from "@/services";
import { IResponseStatus } from "@/types";
import { delayTime } from "@/utils";
import { login, replaceFavoriteProducts, useAppDispatch } from "@/redux-store";
import { useGoogleLogin } from "@react-oauth/google";

interface ILoginFormState {
    email: string;
    emailReceiveOTP: string;
    password: string;
    emailError?: string;
    emailReceiveOTPError?: string;
    passwordError?: string;
    isShowPassword: boolean;
    isSubmitting: boolean;
    isOpenForgotPassword: boolean;
    isRequestSendOTP: boolean;
}

const initialState: ILoginFormState = {
    email: "",
    emailReceiveOTP: "",
    password: "",
    isShowPassword: false,
    isSubmitting: false,
    isOpenForgotPassword: false,
    isRequestSendOTP: false,
};

const Login: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<ILoginFormState>(initialState);
    const notify = useNotification();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { email, emailReceiveOTP, password, emailError, emailReceiveOTPError, passwordError, isShowPassword, isSubmitting, isOpenForgotPassword, isRequestSendOTP } = state;

    const handleLoginCustomer = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setState({ emailError: "", passwordError: "", isSubmitting: true, isOpenForgotPassword: false });
        const { errorField, errorMessage } = validateSignIn(email, password);
        if (errorField) {
            setState((draft) => {
                draft[errorField + "Error"] = errorMessage;
                draft.isSubmitting = false;
            });
        } else {
            const data = await AuthService.loginCustomer({ email, password });
            setState({ isSubmitting: false });
            if (data.status === IResponseStatus.Error) {
                setState({ [`${data?.fieldError}Error`]: data.message! });
            } else {
                localStorage.setItem("accessToken", data.data!.accessToken);
                dispatch(login(data.data));
                notify.success(
                    <Text as="p" color="#333">
                        {"Thỏa sức đam mê với shop thể thao Lamine Sport. "}
                        <Text as="span" fontWeight="semibold" size="lg" color="#83b335" textTransform="uppercase">
                            Mua sắm thả ga - Bao la lựa chọn
                        </Text>
                    </Text>
                );
                await ProductService.getFavoriteProducts().then((data) => dispatch(replaceFavoriteProducts(data.data)));
                if (data.data?.role === "user") {
                    await delayTime(1500).then(() => navigate("/"));
                } else {
                    delayTime(1500).then(() => navigate("/admin"));
                }
            }
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setState({ isSubmitting: true });

            const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            }).then((res) => res.json());

            const result = await AuthService.loginWithGoogle({
                email: userInfo.email,
                firstName: userInfo.given_name.split(" ")[0],
                lastName: userInfo.family_name,
                avatar: userInfo.picture,
            });
            setState({ isSubmitting: false });

            if (result.status === IResponseStatus.Error) {
                notify.error(result.message || "Đăng nhập Google thất bại");
            } else {
                localStorage.setItem("accessToken", result.data!.accessToken);
                dispatch(login(result.data));
                notify.success(
                    <Text as="p" color="#333">
                        {"Thỏa sức đam mê với shop thể thao Lamine Sport. "}
                        <Text as="span" fontWeight="semibold" size="lg" color="#83b335" textTransform="uppercase">
                            Mua sắm thả ga - Bao la lựa chọn
                        </Text>
                    </Text>
                );
                await ProductService.getFavoriteProducts().then((data) => dispatch(replaceFavoriteProducts(data.data)));
                await delayTime(1500).then(() => navigate("/"));
            }
        },
        onError: () => {
            notify.error("Đăng nhập Google thất bại. Vui lòng thử lại!");
        },
    });

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !isSubmitting) {
            handleLoginCustomer(event as any);
        }
    };

    const handleForgotPasswordKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !isSubmitting) {
            handleRequestSendOTP(event as any);
        }
    };

    const handleRequestSendOTP = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setState({ isRequestSendOTP: true, emailReceiveOTPError: "" });
        const emailRegex =
            /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)$/;
        if (!emailReceiveOTP) {
            setState({
                emailReceiveOTPError: "Vui lòng nhập email để tiếp tục xử lý",
                isRequestSendOTP: false,
            });
        } else if (!emailReceiveOTP.match(emailRegex)) {
            setState({
                emailReceiveOTPError: "Định dang email không hợp lệ. Vui lòng đảm email đã đúng định dạng (VD. name@example.com)",
                isRequestSendOTP: false,
            });
        } else {
            const data = await AuthService.forgotPasswordCustomer(emailReceiveOTP);
            if (data) {
                if (data.status === IResponseStatus.Error) {
                    setState({ emailReceiveOTPError: data.message!, isRequestSendOTP: false });
                } else {
                    setState({ isRequestSendOTP: false });
                    notify.success(
                        <Text as="p" color="#333">
                            {"Chúng tôi đã gửi email để khôi phục mật khẩu, vui lòng kiểm tra hòm thư "}
                            <Text as="span" fontWeight="semibold" size="sm" color="#83b335">
                                {emailReceiveOTP}
                            </Text>
                            {" để tiến hành khôi phục mật khẩu"}
                        </Text>
                    );
                }
            }
        }
    };

    const showPasswordIcon = React.useMemo(() => {
        const Icon = isShowPassword ? FaEyeSlash : FaEye;

        const iconStyles: React.CSSProperties = {
            height: 20,
            width: 20,
            color: "#333",
            cursor: "pointer",
        };
        return <Icon style={iconStyles} onClick={() => setState({ isShowPassword: !isShowPassword })} />;
    }, [isShowPassword]);

    const onChangeInput = (value: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = event.target;
        setState((draft) => {
            draft[name] = value;
            draft[name + "Error"] = "";
        });
    };
    return (
        <Flex align="center" justify="center">
            <Container className="shadow-primary" maxWidth="md" padding={[16, 20, 16, 20]} margin={[40, 0, 40, 0]}>
                <Title size="xl" textAlign="center" textTransform="uppercase" className="text-primary" fontWeight="medium" titleText="Đăng nhập" level={1} margin={[0, 0, 16, 0]} />
                <Flex vertical align="flex-start" justify="center" className="!mb-2" gap={4}>
                    <BaseInput
                        id="email"
                        name="email"
                        placeholder="Email"
                        type="text"
                        isError={!!emailError}
                        value={email}
                        disabled={isSubmitting}
                        onChange={onChangeInput}
                        onKeyDown={handleKeyDown}
                    />
                    {emailError && <Text as="p" color="#fb2c36" titleText={emailError} />}
                </Flex>
                <Flex vertical align="flex-start" justify="center" className="!mb-2" gap={4}>
                    <BaseInput
                        id="password"
                        name="password"
                        placeholder="Mật khẩu"
                        type={isShowPassword ? "text" : "password"}
                        isError={!!passwordError}
                        value={password}
                        disabled={isSubmitting}
                        rightIcon={showPasswordIcon}
                        onChange={onChangeInput}
                        onKeyDown={handleKeyDown}
                    />
                    {passwordError && <Text as="p" color="#fb2c36" titleText={passwordError} />}
                </Flex>
                <BaseButton
                    children="Đăng nhập"
                    width="full"
                    margin={[0, 0, 16, 0]}
                    isLoading={isSubmitting}
                    textProps={{
                        fontWeight: 400,
                        size: 16,
                        textTransform: "uppercase",
                    }}
                    onClick={handleLoginCustomer}
                />
                <Flex align="center" justify="space-between" className="!mb-4">
                    <BaseButton
                        displayText="Quên mật khẩu?"
                        width="fit"
                        padding={[0, 0, 0, 0]}
                        textProps={{
                            fontWeight: 400,
                            size: "base",
                            textTransform: "normal-case",
                        }}
                        colors={{ normal: { textColor: "#333", bgColor: "transparent" }, hover: { textColor: "#77e322", bgColor: "transparent" } }}
                        disabled={isSubmitting}
                        onClick={() => setState({ isOpenForgotPassword: true })}
                    />
                    <BaseButton
                        displayText="Đăng ký tại đây"
                        width="fit"
                        padding={[0, 0, 0, 0]}
                        textProps={{
                            fontWeight: 400,
                            size: "base",
                            textTransform: "normal-case",
                        }}
                        colors={{ normal: { textColor: "#333", bgColor: "transparent" }, hover: { textColor: "#77e322", bgColor: "transparent" } }}
                        disabled={isSubmitting}
                        onClick={() => navigate("/sign-up")}
                    />
                </Flex>
                <AnimatePresence initial={false}>
                    {isOpenForgotPassword && (
                        <motion.div
                            key="forgot"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <Flex vertical align="center" className="!mb-6">
                                <Flex vertical align="flex-start" justify="center" className="!mb-4 w-full" gap={4}>
                                    <BaseInput
                                        id="emailReceiveOTP"
                                        name="emailReceiveOTP"
                                        placeholder="Email của bạn"
                                        type="text"
                                        isError={!!emailReceiveOTPError}
                                        value={emailReceiveOTP}
                                        disabled={isRequestSendOTP}
                                        onChange={onChangeInput}
                                        onKeyDown={handleForgotPasswordKeyDown}
                                    />
                                    {emailReceiveOTPError && <Text as="p" color="#fb2c36" titleText={emailReceiveOTPError} />}
                                </Flex>
                                <BaseButton
                                    displayText="Lấy lại mật khẩu"
                                    shape="parallelogram"
                                    width="min"
                                    skewPercent={10}
                                    isLoading={isRequestSendOTP}
                                    textProps={{
                                        fontWeight: 500,
                                        size: "base",
                                        textTransform: "normal-case",
                                    }}
                                    onClick={handleRequestSendOTP}
                                />
                            </Flex>
                        </motion.div>
                    )}
                </AnimatePresence>
                <Text color="#333" textAlign="center" titleText="Hoặc đăng nhập bằng" margin={[0, 0, 16, 0]} />
                <Flex justify="center" align="center" className="!mb-4" gap={4}>
                    {/* <BaseButton
                        width={120}
                        disabled={isSubmitting}
                        padding={[0, 0, 0, 0]}
                        children={<Image clickable height="28" width="120" src="https://bizweb.dktcdn.net/assets/admin/images/login/fb-btn.svg" alt="facebook-login" />}
                    /> */}
                    <BaseButton
                        width={120}
                        disabled={isSubmitting}
                        onClick={() => handleGoogleLogin()}
                        padding={[0, 0, 0, 0]}
                        children={<Image clickable height="28" width="120" src="https://bizweb.dktcdn.net/assets/admin/images/login/gp-btn.svg" alt="facebook-login" />}
                    />
                </Flex>
            </Container>
        </Flex>
    );
};

export { Login };
