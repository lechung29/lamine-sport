/** @format */

export interface ILoginValidationResult {
    errorField: "email" | "password" | null;
    errorMessage: string;
}

export const validateSignIn = (email: string, password: string): ILoginValidationResult => {
    if (!email) {
        return {
            errorField: "email",
            errorMessage: "Vui lòng nhập email để tiếp tục xử lý",
        };
    }

    if (!password) {
        return {
            errorField: "password",
            errorMessage: "Vui lòng nhập mật khẩu để tiếp tục xử lý",
        };
    }

    if (!!email) {
        const emailRegex =
            /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)$/;
        if (!email.match(emailRegex)) {
            return {
                errorField: "email",
                errorMessage: "Định dang email không hợp lệ. Vui lòng đảm email đã đúng định dạng (VD. name@example.com)",
            };
        }
    }

    if (!!password && password.length < 8) {
        return {
            errorField: "password",
            errorMessage: "Mật khẩu phải chứa ít nhất 8 ký tự",
        };
    }

    return {
        errorField: null,
        errorMessage: "",
    };
};
