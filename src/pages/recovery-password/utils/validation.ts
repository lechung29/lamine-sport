/** @format */

export const validateRecoveryPassword = (password: string): string => {
    if (!password) {
        return "Vui lòng nhập mật khẩu mới cần thay đổi";
    } else if (password.length < 8) {
        return "Mật khẩu cần tối thiểu gồm 8 kí tự";
    }

    return "";
};
