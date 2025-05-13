/** @format */

export enum PasswordStrongValue {
    None,
    Weak,
    Medium,
    Strong,
    VeryStrong,
}

export interface ISignUpValidationResult {
    errorField: "firstName" | "lastName" | "email" | "password" | "confirmPassword" | null;
    errorMessage: string;
}

export const checkPasswordStrength = (password: string): PasswordStrongValue => {
    let score = 0;
    let label: PasswordStrongValue = PasswordStrongValue.None;

    const isValidPassword = isValidPasswordCharacter(password)
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const specialCharMatches = password.match(/[\W_]/g) || [];
    const specialCharCount = specialCharMatches.length;
    const isLongEnough = password.length >= 8;
    const isVeryLong = password.length >= 15;

    if (!isLongEnough || !isValidPassword) return label

    if (isLongEnough) score++;

    if (hasUppercase) score++;

    if (hasLowercase) score++;

    if (hasNumber) score++;

    if (specialCharCount > 0) score++;

    if (specialCharCount >= 2) score++;

    if (isVeryLong) score++;

    if (score > 0 && score <4) {
        label = PasswordStrongValue.Weak
    } 
    if (score >= 4) {
        label = PasswordStrongValue.Medium
    }
    if (score >= 5 && specialCharCount > 0 ) {
        label = PasswordStrongValue.Strong
    } 
    if (score === 7 && specialCharCount >= 2) {
        label = PasswordStrongValue.VeryStrong
    }

    return label;
};

export const isValidPasswordCharacter = (password: string): boolean => {
    const regex = /^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;""<>,.?/\\|`~-]*$/;
    return regex.test(password);
}

export const validateSignUp = (firstName: string, lastName: string, email: string, password: string, cfPassword: string): ISignUpValidationResult => {
    if (!firstName) {
        return {
            errorField: "firstName",
            errorMessage: "The first name is required. Please provide a value to proceed.",
        }
    }

    if (!lastName) {
        return {
            errorField: "lastName",
            errorMessage: "The last name is required. Please provide a value to proceed.",
        }
    }

    if (!email) {
        return {
            errorField: "email",
            errorMessage: "The email address is required. Please provide a value to proceed.",
        };
    }

    if (!password) {
        return {
            errorField: "password",
            errorMessage: "The password is required. Please provide a value to proceed.",
        };
    }

    if (!cfPassword) {
        return {
            errorField: "confirmPassword",
            errorMessage: "The confirm password is required. Please provide a value to proceed.",
        };
    }

    if (!!firstName) {
        const nameRegex = /^[\p{Lu}][\p{Ll}]*$/u
        if (!firstName.match(nameRegex)) {
            return {
                errorField: "firstName",
                errorMessage: "The first name must contain only letters, start with uppercase letter, and cannot include numbers or special characters."
            }
        }
    }

    if (!!lastName) {
        const nameRegex = /^[\p{Lu}][\p{Ll}]*$/u
        if (!lastName.match(nameRegex)) {
            return {
                errorField: "lastName",
                errorMessage: "The last name must contain only letters, start with uppercase letter, and cannot include numbers or special characters."
            }
        }
    }

    if (!!email) {
        const emailRegex =
            /^(?:[a-zA-Z0-9!#$%&"*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&"*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)$/;
        if (!email.match(emailRegex)) {
            return {
                errorField: "email",
                errorMessage: "The email address entered is invalid. Please ensure it follows the correct email format (e.g., name@example.com)."
            }
        }
    }

    if (!!password) {
        if (password.length < 8) {
            return {
                errorField: "password",
                errorMessage: "The password is too short. Please provide a password with at least 8 characters."
            };
        } else if (!isValidPasswordCharacter(password)) {
            return {
                errorField: "password",
                errorMessage: "The password can only contain English's letters, numbers, and common special characters. No accents or unsupported symbols are allowed."
            }
        }
    }

    if (!!cfPassword) {
        if (cfPassword.length < 8) {
            return {
                errorField: "confirmPassword",
                errorMessage: "The confirm password is too short. Please provide a password with at least 8 characters."
            };
        } else if (!isValidPasswordCharacter(cfPassword)) {
            return {
                errorField: "confirmPassword",
                errorMessage: "The confirm password can only contain English's letters, numbers, and common special characters. No accents or unsupported symbols are allowed."
            }
        } else if (password !== cfPassword) {
            return {
                errorField: "confirmPassword",
                errorMessage: "The confirmation password does not match the original password. Please check again."
            }
        }
    }

    return {
        errorField: null,
        errorMessage: "",
    };
};

export const weakMessage = "Your password is too weak. For better security, we recommend a stronger password. If you wish to continue with this password, click 'Continue'."
export const mediumMessage = "Your password is of medium strength. For better security, we recommend a stronger password. If you still want to proceed with this password, click 'Continue'."