/** @format */

import { ExpiredDialog, Footer, Header } from "@/components";
import { CreatePasswordDialog } from "@/components/create-password-dialog/CreatePasswordDialog";
import { Outlet } from "react-router-dom";

interface IMainLayoutProps {
    children?: React.ReactNode;
}
const MainLayout: React.FunctionComponent<IMainLayoutProps> = (props) => {
    return (
        <section className="min-h-screen w-full flex flex-col bg-white">
            <header className="sticky top-0 w-full min-h-[70px] !py-2 bg-[#01112f] text-white z-50">
                <Header />
            </header>
            <div className="flex-1 !mb-8">{props?.children ? props.children : <Outlet />}</div>
            <footer className="w-full h-auto !py-5 !pb-10 !px-4 sm:!px-8 lg:!px-[45px] !border-t-4 !border-[#a2ff00]">
                <Footer />
            </footer>
            <div className="w-full min-h-12 !px-4 sm:!px-8 lg:!px-[45px] bg-[#1c2635] flex items-center justify-center gap-1 text-white text-xs sm:text-sm text-center">
                {"© Ban quyen thuoc ve "}
                <b className="text-[#a2ff00]">Killian Le</b>
            </div>
            <ExpiredDialog />
            <CreatePasswordDialog />
        </section>
    );
};

export { MainLayout };
