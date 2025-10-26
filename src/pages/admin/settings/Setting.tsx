/** @format */

import React from "react";
import { Button, Input, Typography, Flex, Spin } from "antd";
import { SaveOutlined, LoadingOutlined, KeyOutlined } from "@ant-design/icons";
import { Box, Container, Text } from "@/components";
import { useImmerState } from "@/hooks";
import { updateUserInfo, useAppDispatch, useAppSelector, userState } from "@/redux-store";
import { delayTime } from "@/utils";
import { UserService } from "@/services";
import { useNotification } from "@/context";
import { IResponseStatus } from "@/types";
import { cloneDeep } from "lodash";

const { Title } = Typography;

interface ISettingState {
    isLoading: boolean;
    adminDisplayName: string;
    adminEmail: string;
    isSubmittingInfo: boolean;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    isSubmittingPassword: boolean;
    adminDisplayNameError: string;
    adminEmailError: string;
    currentPasswordError: string;
    newPasswordError: string;
    confirmNewPasswordError: string;
}

const initialState: ISettingState = {
    adminDisplayName: "",
    adminEmail: "",
    confirmNewPassword: "",
    currentPassword: "",
    newPassword: "",
    isLoading: false,
    isSubmittingInfo: false,
    isSubmittingPassword: false,
    adminDisplayNameError: "",
    adminEmailError: "",
    confirmNewPasswordError: "",
    currentPasswordError: "",
    newPasswordError: "",
};

const Setting: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<ISettingState>(initialState);
    const {
        adminDisplayName,
        adminEmail,
        confirmNewPassword,
        currentPassword,
        newPassword,
        isLoading,
        isSubmittingInfo,
        isSubmittingPassword,
        adminDisplayNameError,
        adminEmailError,
        confirmNewPasswordError,
        currentPasswordError,
        newPasswordError,
    } = state;
    const { user } = useAppSelector(userState);
    const dispatch = useAppDispatch();
    const notify = useNotification();

    const getUserInfo = async () => {
        return Promise.resolve(user).then((userInfo) => {
            setState({ adminDisplayName: userInfo?.displayName ?? "", adminEmail: userInfo?.email ?? "" });
        });
    };

    React.useEffect(() => {
        setState({ isLoading: true });
        Promise.all([getUserInfo(), delayTime(1000)]).then(([_res1, _res2]) => setState({ isLoading: false }));
    }, []);

    const isChangedInfo = adminDisplayName !== user?.displayName || adminEmail !== user.email;

    const validationInfo = () => {
        let isValid = true;
        if (!adminDisplayName.trim()) {
            isValid = false;
            setState({ adminDisplayNameError: "Vui lòng nhập tên quản trị viên" });
        }

        if (!adminEmail.trim()) {
            isValid = false;
            setState({ adminEmailError: "Vui lòng nhập email quản trị viên" });
        }

        if (adminEmail.trim()) {
            const emailRegex =
                /^(?:[a-zA-Z0-9!#$%&"*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&"*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)$/;
            if (!adminEmail.match(emailRegex)) {
                isValid = false;
                setState({ adminEmailError: "Email đã nhập không hợp lệ, Vui lòng đảm bảo email phải đúng định dạng (vd: name@example.com)." });
            }
        }

        return isValid;
    };

    const validationPassword = () => {
        let isValid = true;
        if (!currentPassword.trim()) {
            isValid = false;
            setState({ currentPasswordError: "Vui lòng nhập mật khẩu hiện tại" });
        }

        if (!newPassword.trim()) {
            isValid = false;
            setState({ newPasswordError: "Vui lòng nhập mật khẩu mới" });
        }

        if (!confirmNewPassword.trim()) {
            isValid = false;
            setState({ confirmNewPasswordError: "Vui lòng xác nhận mật khẩu mới" });
        }

        if (currentPassword.trim() && currentPassword.trim().length < 8) {
            isValid = false;
            setState({ currentPasswordError: "Mật khẩu quá ngắn. Vui lòng cung cấp mật khẩu gồm ít nhất 8 kí tự" });
        }

        if (newPassword.trim() && newPassword.trim().length < 8) {
            isValid = false;
            setState({ newPasswordError: "Mật khẩu quá ngắn. Vui lòng cung cấp mật khẩu gồm ít nhất 8 kí tự" });
        }

        if (confirmNewPassword.trim() && confirmNewPassword.trim().length < 8) {
            isValid = false;
            setState({ confirmNewPasswordError: "Mật khẩu quá ngắn. Vui lòng cung cấp mật khẩu gồm ít nhất 8 kí tự" });
        }

        if (newPassword.trim() && confirmNewPassword.trim() && newPassword.trim() !== confirmNewPassword.trim()) {
            isValid = false;
            setState({ confirmNewPasswordError: "Xác nhận mật khẩu không trùng khớp với mật khẩu mới" });
        }

        return isValid;
    };

    const submitChangedInfo = async () => {
        try {
            setState({ isSubmittingInfo: true });
            if (!validationInfo()) {
                return Promise.resolve();
            } else {
                const result = await UserService.adminUpdateInfo(adminDisplayName, adminEmail);
                if (result.status === IResponseStatus.Error) {
                    notify.error(result.message);
                } else {
                    notify.success(result.message);
                    const tempUser = cloneDeep(user);
                    dispatch(updateUserInfo({ ...tempUser, displayName: adminDisplayName, email: adminEmail }));
                }
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi xảy ra khi cập nhật thông tin");
        } finally {
            setState({ isSubmittingInfo: false });
        }
    };

    const submitNewPassword = async () => {
        try {
            setState({ isSubmittingPassword: true });
            if (!validationPassword()) {
                return Promise.resolve();
            } else {
                const result = await UserService.adminUpdatePassword(currentPassword, newPassword);
                if (result.status === IResponseStatus.Error) {
                    setState({ currentPasswordError: result.message });
                } else {
                    notify.success(result.message);
                    setState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
                }
            }
        } catch (error) {
            console.log(error);
            notify.error("Có lỗi xảy ra khi cập nhật mật khẩu");
        } finally {
            setState({ isSubmittingPassword: false });
        }
    };

    const onChangeInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const { name } = event.target;
        setState((draft) => {
            draft[name] = event.target.value;
            draft[name + "Error"] = "";
        });
    };

    return (
        <Flex vertical className="bg-transparent flex-grow min-h-full">
            <Box margin={[0, 0, 24, 0]}>
                <Text className="!text-gray-900" size="2xl" fontWeight="bold" titleText="Quản trị viên" margin={[0, 0, 16, 0]} />
            </Box>
            <Container bgColor="white" className="flex-grow !rounded-lg !shadow-sm" padding={[24, 24, 24, 24]}>
                <Flex align="center" justify="space-between" wrap="wrap" gap="middle" className="!mb-6 sm:!flex-col sm:!items-start md:!flex-row md:!items-center">
                    <Title level={4} className="!mb-0 sm:!mb-4 md:!mb-0">
                        Cài đặt hệ thống
                    </Title>
                </Flex>

                {isLoading ? (
                    <Flex align="center" justify="center" className="min-h-[300px]">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                    </Flex>
                ) : (
                    <Box className="max-w-xl !mx-auto md:max-w-2xl">
                        <Title level={5} className="!mb-4 !text-blue-700">
                            Thông tin quản trị viên
                        </Title>
                        <Box margin={[0, 0, 12, 0]}>
                            <Text as="span" titleText="Tên quản trị viên" requireIcon />
                            <Input
                                required
                                disabled={isSubmittingInfo}
                                className="!mt-1"
                                size="large"
                                name="adminDisplayName"
                                placeholder="Nhập tên quản trị viên"
                                value={adminDisplayName}
                                onChange={onChangeInput}
                            />
                            {!!adminDisplayNameError && <Text as="span" margin={[4, 0, 0, 0]} color="#cf1322" titleText={adminDisplayNameError} />}
                        </Box>
                        <Box margin={[0, 0, 12, 0]}>
                            <Text as="span" titleText="Email quản trị viên" requireIcon />
                            <Input
                                required
                                disabled={isSubmittingInfo}
                                className="!mt-1"
                                size="large"
                                name="adminEmail"
                                placeholder="Nhập email quản trị viên"
                                value={adminEmail}
                                onChange={onChangeInput}
                            />
                            {!!adminEmailError && <Text as="span" margin={[4, 0, 0, 0]} color="#cf1322" titleText={adminEmailError} />}
                        </Box>
                        <Button
                            type="primary"
                            size="large"
                            icon={<SaveOutlined />}
                            loading={isSubmittingInfo}
                            disabled={!isChangedInfo}
                            onClick={submitChangedInfo}
                            className="!bg-blue-500 hover:!bg-blue-600 !border-blue-500 hover:!border-blue-600 disabled:!text-white disabled:!opacity-50 !w-full sm:!w-auto"
                        >
                            Lưu thông tin
                        </Button>

                        <Title level={5} className="!mt-8 !mb-4 !text-blue-700">
                            <KeyOutlined className="!mr-2" />
                            Đổi mật khẩu
                        </Title>
                        <Box margin={[0, 0, 12, 0]}>
                            <Text as="span" titleText="Mật khẩu hiện tại" requireIcon />
                            <Input.Password
                                required
                                disabled={isSubmittingPassword}
                                className="!mt-1"
                                size="large"
                                name="currentPassword"
                                placeholder="Nhập mật khẩu hiện tại"
                                value={currentPassword}
                                onChange={onChangeInput}
                            />
                            {!!currentPasswordError && <Text as="span" margin={[4, 0, 0, 0]} color="#cf1322" titleText={currentPasswordError} />}
                        </Box>
                        <Box margin={[0, 0, 12, 0]}>
                            <Text as="span" titleText="Mật khẩu mới" requireIcon />
                            <Input.Password
                                required
                                disabled={isSubmittingPassword}
                                className="!mt-1"
                                size="large"
                                name="newPassword"
                                placeholder="Nhập mật khẩu mới"
                                value={newPassword}
                                onChange={onChangeInput}
                            />
                            {!!newPasswordError && <Text as="span" margin={[4, 0, 0, 0]} color="#cf1322" titleText={newPasswordError} />}
                        </Box>
                        <Box margin={[0, 0, 12, 0]}>
                            <Text as="span" titleText="Xác nhận mật khẩu mới" requireIcon />
                            <Input.Password
                                required
                                disabled={isSubmittingPassword}
                                className="!mt-1"
                                size="large"
                                name="confirmNewPassword"
                                placeholder="Xác nhận mật khẩu mới"
                                value={confirmNewPassword}
                                onChange={onChangeInput}
                            />
                            {!!confirmNewPasswordError && <Text as="span" margin={[4, 0, 0, 0]} color="#cf1322" titleText={confirmNewPasswordError} />}
                        </Box>
                        <Button
                            type="primary"
                            size="large"
                            icon={<SaveOutlined />}
                            loading={isSubmittingPassword}
                            disabled={isSubmittingPassword}
                            onClick={submitNewPassword}
                            className="!bg-blue-500 hover:!bg-blue-600 !border-blue-500 hover:!border-blue-600 disabled:!text-white disabled:!opacity-50 !w-full sm:!w-auto"
                        >
                            Đổi mật khẩu
                        </Button>
                    </Box>
                )}
            </Container>
        </Flex>
    );
};

export { Setting as SettingsPage };
