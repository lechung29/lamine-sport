/** @format */

import { updateUserInfo, useAppDispatch, useAppSelector, userState } from "@/redux-store";
import { authState, handleVisiblePasswordDialog } from "@/redux-store/reducers/auth";
import { delayTime } from "@/utils";
import React from "react";
import { Dialog } from "../dialog";
import { BaseInput, Box, Text } from "../elements";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useImmerState } from "@/hooks";
import { UserService } from "@/services";
import { IResponseStatus } from "@/types";
import { useNotification } from "@/context";
import { cloneDeep } from "lodash";

interface ICreatePasswordDialog {
    isShowPassword: boolean;
    isChangingPassword: boolean;
    password: string;
    passwordError: string;
}

const initialState: ICreatePasswordDialog = {
    isShowPassword: false,
    isChangingPassword: false,
    password: "",
    passwordError: "",
};

const CreatePasswordDialog: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<ICreatePasswordDialog>(initialState);
    const { isShowPassword, password, passwordError, isChangingPassword } = state;
    const { isOpenCreatePasswordDialog } = useAppSelector(authState);
    const { user } = useAppSelector(userState);
    const dispatch = useAppDispatch();
    const notify = useNotification();

    const validatePassword = (password: string): boolean => {
        let isValid = true;
        if (!password) {
            isValid = false;
            setState({ passwordError: "Mật khẩu cũ là bắt buộc. Vui lòng nhập mật khẩu để tiếp tục xử lý" });
        }

        if (!!password && password.length < 8) {
            isValid = false;
            setState({ passwordError: "Mật khẩu phải có tối thiểu 8 ký tự" });
        }

        const passwordRegex = /^\S+$/;

        if (!!password && !password.match(passwordRegex)) {
            isValid = false;
            setState({ passwordError: "Mật khẩu không thể tồn tại khoảng trắng" });
        }

        return isValid;
    };

    const handleSubmitNewPassword = async () => {
        try {
            setState({ isChangingPassword: true });
            if (!validatePassword(password)) {
                setState({ isChangingPassword: false });
                return Promise.resolve();
            } else {
                const result = await UserService.userCreatePassword(password);
                if (result.status === IResponseStatus.Error) {
                    setState({ [`${result?.fieldError}Error`]: result.message! });
                } else {
                    notify.success(result.message);
                    setState({ isChangingPassword: false });
                    await delayTime(1000).then(() => handleCloseChangePasswordDialog());
                }
            }
        } catch (error) {
            console.error("Error updating user:", error);
            notify.error("Có lỗi xảy ra khi cập nhật mật khẩu");
            setState({ isChangingPassword: false });
        }
    };

    const handleCloseChangePasswordDialog = () => {
        const clonedUser = cloneDeep(user);
        dispatch(updateUserInfo({ ...clonedUser, isFirstLogin: undefined }));
        dispatch(handleVisiblePasswordDialog(false));
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
        <Dialog
            title="Thông báo hệ thống"
            isOpen={isOpenCreatePasswordDialog}
            onConfirm={handleSubmitNewPassword}
            noCancelButton
            isCloseByOutside={false}
            disabledCloseAction
            confirmText="Xác nhận"
            confirmButtonStyle="primary"
        >
            <Text size="base" margin={[0, 0, 16, 0]} titleText="Đây là lần đăng nhập đầu tiên bằng Google. Vui lòng tạo mật khẩu cho tài khoản trong những trường hợp cần dùng đến nhé!" />
            <Text requireIcon fontWeight="semibold" titleText="Mật khẩu mới" />
            <Box margin={[4, 0, 16, 0]} className="flex flex-col items-start justify-start gap-2">
                <BaseInput
                    id="password"
                    name="password"
                    placeholder="Tạo mật khẩu của bạn"
                    type={isShowPassword ? "text" : "password"}
                    rightIcon={showPasswordIcon}
                    isError={!!passwordError}
                    value={password}
                    onChange={onChangeInput}
                    disabled={isChangingPassword}
                />
                {passwordError && <Text className="flex-1 text-[#c10000]" titleText={passwordError} />}
            </Box>
        </Dialog>
    );
};

export { CreatePasswordDialog };
