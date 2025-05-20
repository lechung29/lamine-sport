/** @format */

import { Footer, Header } from "@/components";
import { Outlet } from "react-router-dom";

const MainLayout: React.FunctionComponent = () => {
    return (
        <section className="min-h-screen w-full flex flex-col bg-white">
            <header className="sticky top-0 w-full min-h-[70px] !py-2 bg-[#1c2635] !text-white z-50">
                <Header />
            </header>
            {/* <div className="w-full !h-11 !px-11 !bg-[#f8f8f8] flex items-center"><Breadcrumbs /></div> */}
            <div className="flex-1">
                <Outlet />
            </div>
            <footer className="w-full h-auto !py-5 !pb-10 !px-[45px] !border-t-4 !border-[#a2ff00]">
                <Footer />
            </footer>
            <div className="w-full min-h-12 !px-[45px] bg-[#1c2635] flex items-center justify-center gap-1 text-white">
                {"© Bản quyền thuộc về "}
                <b className="text-[#a2ff00]">Killian Le</b>
            </div>
        </section>
    );
};

export { MainLayout };
