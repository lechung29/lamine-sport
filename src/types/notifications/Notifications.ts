/** @format */

export interface INotification {
    type: "success" | "error" | "info" | "warning" | undefined;
    message?: string;
}
