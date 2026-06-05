/** @format */

export interface ISignUpValidationResult {
    errorField: "firstName" | "lastName" | "email" | "password" | "phoneNumber" | null;
    errorMessage: string;
}

export const validateSignUp = (firstName: string, lastName: string, email: string, password: string, phoneNumber: string): ISignUpValidationResult => {
    if (!firstName) {
        return {
            errorField: "firstName",
            errorMessage: "Vui lòng nhập họ để tiếp tục xử lý",
        };
    }

    if (!lastName) {
        return {
            errorField: "lastName",
            errorMessage: "Vui lòng nhập tên để tiếp tục xử lý",
        };
    }

    if (!email) {
        return {
            errorField: "email",
            errorMessage: "Vui lòng nhập email để tiếp tục xử lý",
        };
    }

    if (!phoneNumber) {
        return {
            errorField: "phoneNumber",
            errorMessage: "Vui lòng nhập số điện thoại để tiếp tục xử lý",
        };
    }

    if (!password) {
        return {
            errorField: "password",
            errorMessage: "Vui lòng nhập mật khẩu để tiếp tục xử lý",
        };
    }

    if (!!firstName) {
        const nameRegex = /^[\p{Lu}][\p{Ll}]*$/u;
        if (!firstName.match(nameRegex)) {
            return {
                errorField: "firstName",
                errorMessage: "Họ chỉ được chứa các chữ cái, bắt đầu bằng chữ hoa và không được bao gồm số hoặc ký tự đặc biệt.",
            };
        }
    }

    if (!!lastName) {
        const nameRegex = /^[\p{Lu}][\p{Ll}]*$/u;
        if (!lastName.match(nameRegex)) {
            return {
                errorField: "lastName",
                errorMessage: "Tên chỉ được chứa các chữ cái, bắt đầu bằng chữ hoa và không được bao gồm số hoặc ký tự đặc biệt.",
            };
        }
    }

    if (!!email) {
        const emailRegex =
            /^(?:[a-zA-Z0-9!#$%&"*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&"*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)$/;
        if (!email.match(emailRegex)) {
            return {
                errorField: "email",
                errorMessage: "Định dang email không hợp lệ. Vui lòng đảm email đã đúng định dạng (VD. name@example.com)",
            };
        }
    }

    if (!!phoneNumber && phoneNumber[0] !== "0") {
        return {
            errorField: "phoneNumber",
            errorMessage: "Số điện thoại phải bắt đầu bằng 0",
        };
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
