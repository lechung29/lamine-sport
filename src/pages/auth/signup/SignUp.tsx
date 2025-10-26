/** @format */

import React from "react";
import { Container, Title, Text, BaseInput, Image, BaseButton } from "@/components";
import { useImmerState } from "@/hooks";
import { AuthService, ProductService } from "@/services";
import { Flex } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { delayTime, isInputOnlyNumber } from "@/utils";
import { validateSignUp } from "./utils/validation";
import { useNotification } from "@/context";
import { IResponseStatus } from "@/types";
import { useGoogleLogin } from "@react-oauth/google";
import { login, replaceFavoriteProducts, useAppDispatch } from "@/redux-store";

interface IRegisterFormState {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    firstNameError?: string;
    lastNameError?: string;
    emailError?: string;
    phoneNumberError?: string;
    passwordError?: string;
    isShowPassword: boolean;
    isSubmitting: boolean;
}

const initialState: IRegisterFormState = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    isShowPassword: false,
    isSubmitting: false,
};

const SignUp: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<IRegisterFormState>(initialState);
    const notify = useNotification();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { email, firstName, lastName, phoneNumber, password, emailError, firstNameError, lastNameError, phoneNumberError, passwordError, isShowPassword, isSubmitting } = state;

    const handleRegisterNewCustomer = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setState({ isSubmitting: true });
        const { errorField, errorMessage } = validateSignUp(firstName, lastName, email, password, phoneNumber);
        if (errorField) {
            setState((draft) => {
                draft[errorField + "Error"] = errorMessage;
                draft.isSubmitting = false;
            });
        } else {
            const data = await AuthService.registerCustomer({
                email,
                firstName,
                lastName,
                password,
                phoneNumber,
            });
            setState({ isSubmitting: false });
            if (data.status === IResponseStatus.Error) {
                setState({ [`${data?.fieldError}Error`]: data.message! });
            } else {
                notify.success(
                    <Text as="p" color="#333">
                        {"Chào mừng bạn đến với shop thể thao Lamine Sport. "}
                        <Text as="span" fontWeight="semibold" size="lg" color="#83b335" textTransform="uppercase">
                            Mua sắm thả ga - Bao la lựa chọn
                        </Text>
                    </Text>
                );
                await delayTime(1500).then(() => navigate("/login"));
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
            handleRegisterNewCustomer(event as any);
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

    return (
        <Flex align="center" justify="center">
            <Container className="shadow-primary" maxWidth="md" padding={[16, 20, 16, 20]} margin={[40, 0, 40, 0]}>
                <Title size="xl" textAlign="center" textTransform="uppercase" className="text-primary" fontWeight="medium" titleText="Đăng ký" level={1} margin={[0, 0, 16, 0]} />
                <Text
                    textAlign="center"
                    className="text-primary"
                    size="base"
                    margin={[0, 0, 16, 0]}
                    titleText={
                        <React.Fragment>
                            <Text as="span" titleText="Đã có tài khoản, đăng nhập " />
                            <Link to="/login" className="hover:!text-[#77e322]">
                                tại đây
                            </Link>
                        </React.Fragment>
                    }
                />
                <Flex vertical align="flex-start" justify="center" className="!mb-2" gap={4}>
                    <BaseInput
                        id="firstName"
                        name="firstName"
                        placeholder="Họ"
                        type="text"
                        isError={!!firstNameError}
                        value={firstName}
                        disabled={isSubmitting}
                        onChange={onChangeInput}
                        onKeyDown={handleKeyDown}
                    />
                    {firstNameError && <Text as="p" color="#fb2c36" titleText={firstNameError} />}
                </Flex>
                <Flex vertical align="flex-start" justify="center" className="!mb-2" gap={4}>
                    <BaseInput
                        id="lastName"
                        name="lastName"
                        placeholder="Tên"
                        type="text"
                        isError={!!lastNameError}
                        value={lastName}
                        disabled={isSubmitting}
                        onChange={onChangeInput}
                        onKeyDown={handleKeyDown}
                    />
                    {lastNameError && <Text as="p" color="#fb2c36" titleText={lastNameError} />}
                </Flex>
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
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Số điện thoại"
                        type="text"
                        isError={!!phoneNumberError}
                        value={phoneNumber}
                        disabled={isSubmitting}
                        onChange={onChangeInput}
                        onKeyDown={handleKeyDown}
                    />
                    {phoneNumberError && <Text as="p" color="#fb2c36" titleText={phoneNumberError} />}
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
                    children="Đăng ký"
                    width="full"
                    margin={[0, 0, 16, 0]}
                    isLoading={isSubmitting}
                    textProps={{
                        fontWeight: 400,
                        size: 16,
                        textTransform: "uppercase",
                    }}
                    onClick={handleRegisterNewCustomer}
                />
                <Text color="#333" textAlign="center" titleText="Hoặc đăng nhập bằng" margin={[0, 0, 16, 0]} />
                <Flex justify="center" align="center" gap={4}>
                    {/* <BaseButton
                        width={120}
                        padding={[0, 0, 0, 0]}
                        disabled={isSubmitting}
                        children={<Image clickable height="28" width="120" src="https://bizweb.dktcdn.net/assets/admin/images/login/fb-btn.svg" alt="facebook-login" />}
                    /> */}
                    <BaseButton
                        width={120}
                        padding={[0, 0, 0, 0]}
                        disabled={isSubmitting}
                        onClick={() => handleGoogleLogin()}
                        children={<Image clickable height="28" width="120" src="https://bizweb.dktcdn.net/assets/admin/images/login/gp-btn.svg" alt="facebook-login" />}
                    />
                </Flex>
            </Container>
        </Flex>
    );
};

export { SignUp };
