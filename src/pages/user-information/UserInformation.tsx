/** @format */

import React from "react";
import { Avatar, Button, Flex, Tooltip, Upload } from "antd";
import { UserOutlined, CameraOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { BaseButton, BaseInput, BaseTextArea, Box, Container, Dialog, Text } from "@/components";
import { useImmerState } from "@/hooks";
import type { UploadProps, UploadFile } from "antd/es/upload/interface";
import { updateUserInfo, useAppDispatch, useAppSelector, userState } from "@/redux-store";
import { uploadToCloudinary } from "@/config/cloudinary";
import { useNotification } from "@/context";
import { AccountLockedError, isInputOnlyNumber, UnauthorizedError } from "@/utils";
import { IResponseStatus } from "@/types";
import { UserService } from "@/services";
import { cloneDeep } from "lodash";
import { IoKeyOutline } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserInformationShimmer = () => {
    const FieldShimmer = () => (
        <Box margin={[0, 0, 16, 0]}>
            <Box margin={[0, 0, 4, 0]}>
                <Box className="h-4 w-32 bg-gray-200 rounded-sm animate-pulse" />
            </Box>
            <Flex gap={16} className="flex-col lg:flex-row items-start lg:items-center justify-start">
                <Box className="w-full sm:w-[400px] h-10 bg-gray-200 !rounded-lg animate-pulse" />
            </Flex>
        </Box>
    );
    const ButtonShimmer = () => (
        <Box margin={[16, 0, 0, 0]} className="w-full inline-flex items-center justify-start">
            <Box className="w-28 h-10 bg-gray-200 !rounded-md animate-pulse" />
        </Box>
    );
    return (
        <Container className="h-full relative text-[#333] flex flex-col">
            <Box className="flex-1">
                <Box className="!mb-4 h-8 w-60 bg-gray-200 !rounded-sm animate-pulse mx-auto" />
                <FieldShimmer />
                <FieldShimmer />
                <FieldShimmer />
                <FieldShimmer />
                <Box className="!mb-4 h-6 w-32 bg-gray-200 !rounded-sm animate-pulse" />
            </Box>
            <ButtonShimmer />
        </Container>
    );
};

interface IUserInfoState {
    isLoading: boolean;
    displayName: string;
    email: string;
    phoneNumber: string;
    address: string;
    avatarFile: UploadFile | null;
    avatarUrl: string | null;
    isUploadingAvatar: boolean;
    displayNameError: string;
    emailError: string;
    phoneNumberError: string;
    isSubmitting: boolean;
    isOpenChangePasswordDialog: boolean;
    password: string;
    newPassword: string;
    passwordError: string;
    newPasswordError: string;
    isChangingPassword: boolean;
    isShowPassword: boolean;
    isShowNewPassword: boolean;
}

const initialState: IUserInfoState = {
    isLoading: false,
    address: "",
    displayName: "",
    email: "",
    phoneNumber: "",
    avatarFile: null,
    avatarUrl: null,
    displayNameError: "",
    emailError: "",
    phoneNumberError: "",
    isUploadingAvatar: false,
    isSubmitting: false,
    isOpenChangePasswordDialog: false,
    password: "",
    newPassword: "",
    passwordError: "",
    newPasswordError: "",
    isChangingPassword: false,
    isShowNewPassword: false,
    isShowPassword: false,
};

const UserInformation: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<IUserInfoState>(initialState);
    const {
        address,
        avatarFile,
        avatarUrl,
        displayName,
        email,
        isLoading,
        isUploadingAvatar,
        phoneNumber,
        displayNameError,
        emailError,
        phoneNumberError,
        isSubmitting,
        isOpenChangePasswordDialog,
        password,
        newPassword,
        passwordError,
        newPasswordError,
        isChangingPassword,
        isShowNewPassword,
        isShowPassword,
    } = state;
    const { user } = useAppSelector(userState);
    const notify = useNotification();
    const dispatch = useAppDispatch();
    const avatarUrlCache = React.useRef(new Map());

    const validateInput = (displayName: string, email: string, phoneNumber: string): boolean => {
        let isValid = true;
        if (!displayName) {
            isValid = false;
            setState({ displayNameError: "Tên hiển thị là bắt buộc. Vui lòng nhập tên để tiếp tục xử lý" });
        }

        if (!email) {
            isValid = false;
            setState({ emailError: "Email cá nhân là bắt buộc. Vui lòng nhập email để tiếp tục xử lý" });
        }

        if (!phoneNumber) {
            isValid = false;
            setState({ phoneNumberError: "Số điện thoại là bắt buộc. Vui lòng số diện thoại để tiếp tục xử lý" });
        }

        if (!!displayName) {
            const nameRegex = /^(?:\p{Lu}\p{Ll}*)(?:\s\p{Lu}\p{Ll}*)*$/u;
            if (!displayName.match(nameRegex)) {
                isValid = false;
                setState({ displayNameError: "Tên hiển thị chỉ chứa chữ cái, bắt đầu bằng chữ in hoa và không được bao gồm số hoặc ký tự đặc biệt" });
            }
        }

        if (!!email) {
            const emailRegex =
                /^(?:[a-zA-Z0-9!#$%&"*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&"*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)$/;
            if (!email.match(emailRegex)) {
                isValid = false;
                setState({ emailError: "Địa chỉ email đã nhập không hợp lệ. Vui lòng đảm bảo rằng nó đúng theo định dạng email (ví dụ: name@example.com)" });
            }
        }

        if (!!phoneNumber && phoneNumber[0] !== "0") {
            isValid = false;
            setState({ phoneNumberError: "Số điện thoại phải bằng đầu bằng 0" });
        }

        return isValid;
    };

    const validatePassword = (password: string, newPassword: string): boolean => {
        let isValid = true;
        if (!password) {
            isValid = false;
            setState({ passwordError: "Mật khẩu cũ là bắt buộc. Vui lòng nhập mật khẩu để tiếp tục xử lý" });
        }

        if (!newPassword) {
            isValid = false;
            setState({ newPasswordError: "Mật khẩu mới là bắt buộc. Vui lòng nhập mật khẩu để tiếp tục xử lý" });
        }

        if (!!password && password.length < 8) {
            isValid = false;
            setState({ passwordError: "Mật khẩu phải có tối thiểu 8 ký tự" });
        }

        if (!!newPassword && newPassword.length < 8) {
            isValid = false;
            setState({ newPasswordError: "Mật khẩu phải có tối thiểu 8 ký tự" });
        }

        const passwordRegex = /^\S+$/;

        if (!!password && !password.match(passwordRegex)) {
            isValid = false;
            setState({ passwordError: "Mật khẩu không thể tồn tại khoảng trắng" });
        }

        if (!!newPassword && !newPassword.match(passwordRegex)) {
            isValid = false;
            setState({ newPasswordError: "Mật khẩu không thể tồn tại khoảng trắng" });
        }

        return isValid;
    };

    React.useEffect(() => {
        setState({ isLoading: true });
        const timer = setTimeout(() => {
            setState({
                address: user?.address,
                displayName: user?.displayName,
                email: user?.email,
                phoneNumber: user?.phoneNumber,
                avatarUrl: user?.avatar,
                isLoading: false,
            });
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    React.useEffect(() => {
        return () => {
            avatarUrlCache.current.forEach((url) => URL.revokeObjectURL(url));
            avatarUrlCache.current.clear();
        };
    }, []);

    const getAvatarUrl = () => {
        if (avatarFile?.originFileObj) {
            const cachedUrl = avatarUrlCache.current.get(avatarFile.uid);
            if (cachedUrl) return cachedUrl;
            const newUrl = URL.createObjectURL(avatarFile.originFileObj);
            avatarUrlCache.current.set(avatarFile.uid, newUrl);
            return newUrl;
        }
        if (avatarUrl) return avatarUrl;
        return null;
    };

    const validateImageFile = (file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            return { isValid: false, errorMessage: "Chỉ chấp nhận file ảnh!" };
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            return { isValid: false, errorMessage: "Ảnh phải nhỏ hơn 5MB!" };
        }
        return { isValid: true, errorMessage: "" };
    };

    const uploadProps: UploadProps = {
        beforeUpload: (file) => {
            const { isValid, errorMessage } = validateImageFile(file);
            if (!isValid) {
                notify.error(errorMessage);
                return Upload.LIST_IGNORE;
            }
            const uploadFile: UploadFile = {
                uid: `${Date.now()}`,
                name: file.name,
                status: "done",
                originFileObj: file,
            };
            setState({ avatarFile: uploadFile, avatarUrl: null });
            return false;
        },
        accept: "image/*",
        showUploadList: false,
        maxCount: 1,
    };

    const handleRemoveAvatar = () => {
        if (avatarFile) {
            const cachedUrl = avatarUrlCache.current.get(avatarFile.uid);
            if (cachedUrl) {
                URL.revokeObjectURL(cachedUrl);
                avatarUrlCache.current.delete(avatarFile.uid);
            }
        }
        setState({ avatarFile: null, avatarUrl: null });
    };

    const uploadAvatarToCloudinary = async (): Promise<string | null> => {
        if (!avatarFile?.originFileObj) return null;
        setState({ isUploadingAvatar: true });
        try {
            const cloudinaryResponse = await uploadToCloudinary(avatarFile.originFileObj, "avatars");
            const cloudinaryUrl = cloudinaryResponse.url;
            setState({ isUploadingAvatar: false, avatarUrl: cloudinaryUrl });
            return cloudinaryUrl;
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            setState({ isUploadingAvatar: false });
            notify.error("Có lỗi xảy ra khi tải ảnh lên!");
            return null;
        }
    };

    const handleCloseChangePasswordDialog = () => {
        setState({ password: "", newPassword: "", passwordError: "", newPasswordError: "", isOpenChangePasswordDialog: false });
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

    const showNewPasswordIcon = React.useMemo(() => {
        const Icon = isShowNewPassword ? FaEyeSlash : FaEye;

        const iconStyles: React.CSSProperties = {
            height: 20,
            width: 20,
            color: "#333",
            cursor: "pointer",
        };
        return <Icon style={iconStyles} onClick={() => setState({ isShowNewPassword: !isShowNewPassword })} />;
    }, [isShowNewPassword]);

    const onRenderDialogContent = () => {
        return (
            <Box padding={[8, 16, 8, 16]}>
                <Text requireIcon fontWeight="semibold" titleText="Mật khẩu hiện tại" />
                <Box margin={[4, 0, 16, 0]} className="flex flex-col items-start justify-start gap-2">
                    <BaseInput
                        id="password"
                        name="password"
                        placeholder="Nhập mật khẩu hiện tại của bạn"
                        type={isShowPassword ? "text" : "password"}
                        rightIcon={showPasswordIcon}
                        isError={!!passwordError}
                        value={password}
                        onChange={onChangeInput}
                        disabled={isChangingPassword}
                    />
                    {passwordError && <Text className="flex-1 text-[#c10000]" titleText={passwordError} />}
                </Box>
                <Text requireIcon fontWeight="semibold" titleText="Mật khẩu mới" />
                <Box margin={[4, 0, 16, 0]} className="flex flex-col items-start justify-start gap-2">
                    <BaseInput
                        id="newPassword"
                        name="newPassword"
                        placeholder="Nhập mật khẩu mới của bạn"
                        type={isShowNewPassword ? "text" : "password"}
                        rightIcon={showNewPasswordIcon}
                        isError={!!newPasswordError}
                        value={newPassword}
                        onChange={onChangeInput}
                        disabled={isChangingPassword}
                    />
                    {newPasswordError && <Text className="flex-1 text-[#c10000]" titleText={newPasswordError} />}
                </Box>
            </Box>
        );
    };

    const handleSubmit = async () => {
        try {
            setState({ isSubmitting: true });
            if (!validateInput(displayName.trim(), email.trim(), phoneNumber.trim())) {
                return Promise.resolve();
            } else {
                let avatarUrl = state.avatarUrl;
                if (avatarFile) {
                    avatarUrl = await uploadAvatarToCloudinary();
                }

                const userData = {
                    displayName: displayName.trim(),
                    email: email.trim(),
                    phoneNumber: phoneNumber.trim(),
                    address: address.trim(),
                    avatarUrl: avatarUrl!,
                };
                const result = await UserService.userUpdateInfo(userData);
                if (result.status === IResponseStatus.Error) {
                    notify.error(result.message);
                } else {
                    notify.success(result.message);
                    const clonedUser = cloneDeep(user);
                    dispatch(updateUserInfo({ ...clonedUser, displayName: displayName.trim(), email: email.trim(), address: address.trim(), phoneNumber: phoneNumber.trim(), avatar: avatarUrl }));
                }
            }
        } catch (error: any) {
            console.error("Error updating user:", error);
            if (error instanceof UnauthorizedError || error instanceof AccountLockedError) {
                return;
            }
            notify.error("Có lỗi xảy ra khi cập nhật thông tin");
        } finally {
            setState({ isSubmitting: false });
        }
    };

    const handleSubmitNewPassword = async () => {
        try {
            setState({ isChangingPassword: true });
            if (!validatePassword(password, newPassword)) {
                setState({ isChangingPassword: false });
                return Promise.resolve();
            } else {
                const result = await UserService.userUpdatePassword(password, newPassword);
                if (result.status === IResponseStatus.Error) {
                    setState({ [`${result?.fieldError}Error`]: result.message! });
                } else {
                    notify.success(result.message);
                    handleCloseChangePasswordDialog();
                }
            }
        } catch (error) {
            console.error("Error updating user:", error);
            if (error instanceof UnauthorizedError || error instanceof AccountLockedError) {
                return;
            }
            notify.error("Có lỗi xảy ra khi cập nhật mật khẩu");
        } finally {
            setState({ isChangingPassword: false });
        }
    };

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

    if (isLoading) {
        return <UserInformationShimmer />;
    }

    return (
        <Container className="h-full relative text-[#333] flex flex-col max-w-4xl !mx-auto !p-6">
            <Box className="flex-1">
                <Text padding={[16, 0, 16, 0]} fontWeight="semibold" size="3xl" textAlign="center" titleText="Thông tin cá nhân" />
                <Flex vertical align="center" className="!mb-8">
                    <Box margin={[0, 0, 16, 0]} className="relative">
                        <Avatar size={128} icon={<UserOutlined />} src={getAvatarUrl()} className="!border-4 !border-gray-200" />
                        {isUploadingAvatar && (
                            <Flex align="center" justify="center" className="absolute inset-0 bg-black bg-opacity-50 !rounded-full">
                                <LoadingOutlined className="text-white text-2xl" />
                            </Flex>
                        )}
                    </Box>

                    <Flex gap={8}>
                        <Upload {...uploadProps}>
                            <Button icon={<CameraOutlined />} disabled={isUploadingAvatar}>
                                {avatarFile || avatarUrl ? "Thay đổi ảnh" : "Tải ảnh lên"}
                            </Button>
                        </Upload>

                        {(avatarFile || avatarUrl) && (
                            <Tooltip title="Xóa ảnh đại diện">
                                <Button danger icon={<DeleteOutlined />} onClick={handleRemoveAvatar} disabled={state.isUploadingAvatar} />
                            </Tooltip>
                        )}
                    </Flex>

                    <Text size="xs" margin={[8, 0, 0, 0]} className="text-gray-500" titleText="Chấp nhận: JPG, PNG, GIF (Tối đa 5MB)" />
                </Flex>

                <Box margin={[0, 0, 16, 0]}>
                    <Box margin={[0, 0, 4, 0]}>
                        <Text requireIcon fontWeight="semibold" padding={[0, 4, 0, 0]} titleText="Họ và tên khách hàng" />
                    </Box>
                    <Box className="flex flex-col lg:flex-row items-start lg:items-center justify-start lg:gap-4 gap-2">
                        <BaseInput
                            id="displayName"
                            name="displayName"
                            placeholder="Vd. Nguyễn Văn A"
                            className="max-w-100"
                            type="text"
                            isError={!!displayNameError}
                            value={displayName}
                            onChange={onChangeInput}
                            disabled={isSubmitting}
                        />
                        {displayNameError && <Text className="flex-1 text-[#c10000]" titleText={displayNameError} />}
                    </Box>
                </Box>

                <Box margin={[0, 0, 16, 0]}>
                    <Box margin={[0, 0, 4, 0]}>
                        <Text requireIcon fontWeight="semibold" padding={[0, 4, 0, 0]} titleText="Email cá nhân" />
                    </Box>
                    <Box className="flex flex-col lg:flex-row items-start lg:items-center justify-start lg:gap-4 gap-2">
                        <BaseInput
                            id="email"
                            name="email"
                            placeholder="Vd. nguyenA123@gmail.com"
                            className="max-w-100"
                            type="text"
                            isError={!!emailError}
                            value={email}
                            onChange={onChangeInput}
                            disabled={isSubmitting}
                        />
                        {emailError && <Text className="flex-1 text-[#c10000]" titleText={emailError} />}
                    </Box>
                </Box>

                <Box margin={[0, 0, 16, 0]}>
                    <Box margin={[0, 0, 4, 0]}>
                        <Text requireIcon fontWeight="semibold" padding={[0, 4, 0, 0]} titleText="Số điện thoại" />
                    </Box>
                    <Box className="flex flex-col lg:flex-row items-start lg:items-center justify-start lg:gap-4 gap-2">
                        <BaseInput
                            id="phoneNumber"
                            name="phoneNumber"
                            className="max-w-100"
                            placeholder="Vd. 0123456789"
                            type="text"
                            isError={!!phoneNumberError}
                            value={phoneNumber}
                            disabled={isSubmitting}
                            onChange={onChangeInput}
                        />
                        {phoneNumberError && <Text className="flex-1 text-[#c10000]" titleText={phoneNumberError} />}
                    </Box>
                </Box>

                <Box margin={[0, 0, 16, 0]}>
                    <Box margin={[0, 0, 4, 0]}>
                        <Text as="span" fontWeight="semibold" padding={[0, 4, 0, 0]} titleText="Địa chỉ" />
                    </Box>
                    <Flex align="flex-start" justify="flex-start" gap={16}>
                        <BaseTextArea className="max-w-100" rows={3} name="address" placeholder="Vd. Ngõ A, phường B, thành phố C" value={address} onChange={onChangeInput} disabled={isSubmitting} />
                    </Flex>
                </Box>
            </Box>

            <Flex align="center" justify="flex-start" gap={8} className="!mt-4 w-full">
                <BaseButton
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    textProps={{ fontWeight: 600, size: "base", textTransform: "uppercase" }}
                    displayText={state.isUploadingAvatar ? "Đang tải..." : "Cập nhật"}
                />
                <BaseButton
                    colors={{ normal: { bgColor: "transparent", textColor: "#333" }, hover: { bgColor: "transparent", textColor: "#2a9dcc" } }}
                    textProps={{ fontWeight: 600, size: "base", textTransform: "uppercase" }}
                    disabled={isSubmitting}
                    onClick={() => setState({ isOpenChangePasswordDialog: true })}
                    displayText={
                        <React.Fragment>
                            <IoKeyOutline size={24} />
                            Đổi mật khẩu
                        </React.Fragment>
                    }
                />
            </Flex>

            {isOpenChangePasswordDialog && (
                <Dialog
                    title="Đổi mật khẩu"
                    isOpen={isOpenChangePasswordDialog}
                    onClose={handleCloseChangePasswordDialog}
                    onConfirm={handleSubmitNewPassword}
                    confirmText="Đổi mật khẩu"
                    confirmButtonStyle="primary"
                >
                    {onRenderDialogContent()}
                </Dialog>
            )}
        </Container>
    );
};

export { UserInformation };
