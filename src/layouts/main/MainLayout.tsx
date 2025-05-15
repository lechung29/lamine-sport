/** @format */

import { Header } from "@/components";
import { Outlet } from "react-router-dom";

const MainLayout: React.FunctionComponent = () => {
    return (
        <section className="min-h-screen w-full">
            <header className="sticky top-0 w-full min-h-[70px] !py-2 bg-[#1c2635] text-white">
               <Header />
            </header>
            <div className="!pt-16 flex gap-2 h-auto">
                <main className="flex-1 scroll-on-hover !p-6">
                    <Outlet />
                </main>
            </div>
        </section>
    );
};

export { MainLayout };
