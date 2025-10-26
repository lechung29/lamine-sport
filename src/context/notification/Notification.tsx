/** @format */

import React from "react";
import { notification } from "antd";
import "antd/dist/reset.css"; // Import antd styling

interface NotificationApi {
    success: (message: React.ReactNode) => void;
    info: (message: React.ReactNode) => void;
    warning: (message: React.ReactNode) => void;
    error: (message: React.ReactNode) => void;
}

const NotificationContext = React.createContext<NotificationApi | undefined>(undefined);

const useNotification = (): NotificationApi => {
    const context = React.useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

interface NotificationProviderProps {
    children: React.ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    const notificationApi: NotificationApi = React.useMemo(
        () => ({
            success: (message) => {
                api.success({ message: "Thông báo", description: message, duration: 5 });
            },
            info: (message) => {
                api.info({ message: "Thông báo", description: message, duration: 5 });
            },
            warning: (message) => {
                api.warning({ message: "Thông báo", description: message, duration: 5 });
            },
            error: (message) => {
                api.error({ message: "Thông báo", description: message, duration: 5 });
            },
        }),
        [api]
    );

    return (
        <NotificationContext.Provider value={notificationApi}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};

export { NotificationProvider, useNotification };
