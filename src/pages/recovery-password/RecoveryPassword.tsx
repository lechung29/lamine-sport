/** @format */

import { RecoveryPasswordWrapper } from "@/layouts";
import { AuthService } from "@/services";
import React from "react";
import { useSearchParams } from "react-router-dom";
import RecoveryPasswordForm from "./RecoveryPasswordForm";

const RecoveryPassword: React.FunctionComponent = () => {
    const [searchParams] = useSearchParams();
    const customerEmail = searchParams.get("customerEmail") || "";
    const token = searchParams.get("token") || "";

    const verifyTokenPromise = AuthService.verifyRecoveryPasswordToken(customerEmail, token);

    return (
        <RecoveryPasswordWrapper validatePromise={verifyTokenPromise}>
            <RecoveryPasswordForm customerEmail={customerEmail} />
        </RecoveryPasswordWrapper>
    );
};
export { RecoveryPassword };
