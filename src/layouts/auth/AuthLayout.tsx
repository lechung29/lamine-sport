/** @format */

import React from "react";
import { Outlet } from "react-router-dom";
const AuthLayout: React.FunctionComponent = () => {
    return (
        <section className="sm:flex dark:bg-[#0f172a] min-h-screen w-full">
            <div className="w-full p-10 flex items-center justify-center overflow-auto">
                <Outlet />
            </div>
        </section>
    );
};

export { AuthLayout };
