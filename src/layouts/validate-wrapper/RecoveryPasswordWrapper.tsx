/** @format */

import { Loading, NotFound } from "@/pages";
import { IResponseBase, IResponseStatus } from "@/types";
import React, { useEffect } from "react";
import { MainLayout } from "../main";
import { delayTime } from "@/utils";

interface IRecoveryPasswordWrapper {
    children: React.ReactNode;
    validatePromise: Promise<IResponseBase>;
}

const RecoveryPasswordWrapper: React.FunctionComponent<IRecoveryPasswordWrapper> = (props) => {
    const { children, validatePromise } = props;
    const [isValidating, setIsValidating] = React.useState(true);
    const [isValid, setIsValid] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    useEffect(() => {
        const verifyToken = () => {
            return Promise.all([validatePromise, delayTime(3000)]).then(([result, _time]) => {
                setIsValidating(false);
                if (result.status === IResponseStatus.Error) {
                    setIsValid(false);
                    setErrorMessage(result.message || "");
                } else {
                    setIsValid(true);
                }
            });
        };

        verifyToken();
    }, [validatePromise]);

    if (isValidating) {
        return <Loading />;
    }

    if (!isValidating && isValid === false) {
        return <NotFound errorMessage={errorMessage} />;
    }

    return <MainLayout>{children}</MainLayout>;
};

export { RecoveryPasswordWrapper };
