/** @format */

import { isValidPasswordCharacter } from "../../signup/utils/validation";

export interface ILoginValidationResult {
    errorField: "email" | "password" | null;
    errorMessage: string;
}

export const validateSignIn = (email: string, password: string): ILoginValidationResult => {
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

    if (!!email) {
        const emailRegex =
            /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)$/;
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

    return {
        errorField: null,
        errorMessage: "",
    };
};

