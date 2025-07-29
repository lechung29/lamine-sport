/** @format */

import { SUB_LOGO_URL } from "@/constants";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// Navbar Component: Giờ đây chứa nút menu (cho mobile), logo và các nút bên phải
const Navbar = ({ toggleSidebar }) => {
    return (
        <div className="!flex !items-center !justify-between !w-full">
            {/* Left section: Hamburger menu (mobile) and Logo */}
            <div className="!flex !items-center">
                {/* Hamburger menu for mobile: Chỉ hiển thị khi màn hình nhỏ hơn md */}
                <div className="block md:hidden !mr-4">
                    <button onClick={toggleSidebar} className="!text-gray-700 !hover:text-black !focus:outline-none">
                        <svg className="!h-6 !w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
                {/* Logo */}
                <div className="!flex-shrink-0">
                    <img src={SUB_LOGO_URL} alt="app-logo" className="!h-12 cursor-pointer object-cover" />
                </div>
            </div>

            {/* Right side (Search, ADMIN, Notifications) */}
            <div className="!flex !items-center !space-x-4">
                <div className="!relative">
                    <button className="!text-gray-700 !hover:text-black !focus:outline-none">
                        <span className="!sr-only">Search</span>
                        <svg className="!h-6 !w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
                        </svg>
                    </button>
                </div>
                <div>
                    <button className="!bg-gray-200 !text-gray-700 !px-3 !py-2 !rounded-md !text-sm !font-medium !hover:bg-gray-300">ADMIN</button>
                </div>
                <div>
                    <button className="!text-gray-700 !hover:text-black !focus:outline-none">
                        <span className="!sr-only">Notifications</span>
                        <svg className="!h-6 !w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Sidebar Component
const Sidebar = ({ toggleSidebar, navigate }) => {
    // Nhận navigate làm prop
    return (
        <div className="!p-4 !relative">
            <button onClick={toggleSidebar} className="block md:hidden !absolute !top-2 !right-2 !text-gray-700 !hover:text-black !focus:outline-none !p-2">
                <svg className="!h-6 !w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <nav className="!space-y-2 md:!mt-0 !mt-8">
                <div onClick={() => navigate("/dashboard")} className="!flex !items-center !text-gray-900 hover:!bg-gray-700 hover:!text-white !p-2 !rounded-md !text-sm !font-medium !cursor-pointer">
                    <span className="!mr-2">🏠</span> Dashboard
                </div>
                <div onClick={() => navigate("/products")} className="!flex !items-center !text-gray-900 hover:!bg-gray-700 hover:!text-white !p-2 !rounded-md !text-sm !font-medium !cursor-pointer">
                    <span className="!mr-2">📦</span> All Products
                </div>
                <div onClick={() => navigate("/orders")} className="!flex !items-center !text-gray-900 hover:!bg-gray-700 hover:!text-white !p-2 !rounded-md !text-sm !font-medium !cursor-pointer">
                    <span className="!mr-2">📋</span> Order List
                </div>
            </nav>
        </div>
    );
};

// Layout Component
const AdminLayout = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div className="!h-screen !bg-[#e7e7e3] !flex !flex-col">
            <header className="!bg-white !w-full !flex-shrink-0 !h-16 !flex !items-center !justify-between !px-4 !md:px-6 !shadow-md !z-20">
                {" "}
                {/* Added !shadow-md here */}
                {/* Render Navbar Component và truyền toggleSidebar xuống */}
                <Navbar toggleSidebar={toggleSidebar} />
            </header>

            <div className="!flex-1 !flex !overflow-hidden">
                <aside
                    className={`
                    !bg-white !overflow-y-auto !transition-transform !duration-300
                    
                    !fixed !top-0 !left-0 !h-screen !w-64 !z-50
                    ${sidebarVisible ? "!translate-x-0" : "!-translate-x-full"}
                    
                    md:!static md:!translate-x-0 md:!block md:!h-auto md:!flex-shrink-0 md:!w-64 md:!z-auto {/* Removed !shadow-md and md:!border-r md:!border-gray-200 */}
                `}
                >
                    <Sidebar toggleSidebar={toggleSidebar} navigate={navigate} /> {/* Truyền navigate xuống Sidebar */}
                </aside>

                {sidebarVisible && <div className="block md:hidden !fixed !inset-0 !z-40" onClick={toggleSidebar}></div>}

                <main
                    className={`
                    !flex-1 !p-6 md:!p-8 !overflow-y-auto !relative
                `}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export { AdminLayout, Sidebar, Navbar };
