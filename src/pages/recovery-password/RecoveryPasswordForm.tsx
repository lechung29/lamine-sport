/** @format */

import { BaseButton, BaseInput, Container, Title, Text } from "@/components";
import { useNotification } from "@/context";
import { AuthService } from "@/services";
import { IResponseStatus } from "@/types";
import { delayTime } from "@/utils";
import { Flex } from "antd";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { validateRecoveryPassword } from "./utils/validation";

interface IRecoveryPasswordForm {
    customerEmail: string;
}
const RecoveryPasswordForm: React.FunctionComponent<IRecoveryPasswordForm> = (props) => {
    const { customerEmail } = props;
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const [isShowPassword, setIsShowPassword] = React.useState<boolean>(false);
    const [newPassword, setNewPassword] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");

    const notify = useNotification();
    const navigate = useNavigate();

    const showPasswordIcon = React.useMemo(() => {
        const Icon = isShowPassword ? FaEyeSlash : FaEye;

        const iconStyles: React.CSSProperties = {
            height: 20,
            width: 20,
            color: "#333",
            cursor: "pointer",
        };
        return <Icon style={iconStyles} onClick={() => setIsShowPassword(!isShowPassword)} />;
    }, [isShowPassword]);

    const onChangeInput = (value: string, _event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(value);
        setError("");
    };

    const onSubmitRecoveryPassword = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        const passwordError = validateRecoveryPassword(newPassword);
        console.log(passwordError)
        if (passwordError) {
            setIsSubmitting(false);
            setError(passwordError)
        } else {
            const data = await AuthService.resetPasswordByRPToken(customerEmail, newPassword);
            setIsSubmitting(false);
            if (data) {
                if (data.status === IResponseStatus.Success) {
                    notify.success(data.message);
                    await delayTime(1500).then(() => navigate("/login"));
                } else {
                    notify.error(data.message);
                }
            }
        }
    };

    return (
        <Flex align="center" justify="center">
            <Container className="shadow-primary" maxWidth="sm" padding={[16, 20, 16, 20]} margin={[40, 0, 40, 0]}>
                <Title size="xl" textAlign="center" textTransform="uppercase" className="text-primary" fontWeight="medium" titleText="Khôi phục mật khẩu" level={1} margin={[0, 0, 16, 0]} />
                <Flex vertical align="flex-start" justify="center" className="!mb-2" gap={4}>
                    <BaseInput id="email" name="email" placeholder="Email" type="text" value={customerEmail} disabled={true} />
                </Flex>
                <Flex vertical align="flex-start" justify="center" className="!mb-2" gap={4}>
                    <BaseInput
                        id="password"
                        name="password"
                        placeholder="Mật khẩu"
                        type={isShowPassword ? "text" : "password"}
                        isError={!!error}
                        value={newPassword}
                        disabled={isSubmitting}
                        rightIcon={showPasswordIcon}
                        onChange={onChangeInput}
                    />
                    {error && <Text as="p" color="#fb2c36" titleText={error} />}
                </Flex>
                <BaseButton
                    children="Thay đổi mật khẩu"
                    width="full"
                    margin={[0, 0, 16, 0]}
                    isLoading={isSubmitting}
                    textProps={{
                        fontWeight: 400,
                        size: 16,
                        textTransform: "uppercase",
                    }}
                    onClick={onSubmitRecoveryPassword}
                />
            </Container>
        </Flex>
    );
};

export default RecoveryPasswordForm;
