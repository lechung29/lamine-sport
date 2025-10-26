/** @format */

import { Breadcrumbs } from "@/components";
import { IStoreInformation } from "@/types";
import { lamineStoreAddressList } from "@/utils";
import { useState } from "react";
import { BsPhone } from "react-icons/bs";
import { FaMapPin } from "react-icons/fa";

const AllStore = () => {
    const [selectedStore, setSelectedStore] = useState<IStoreInformation>(lamineStoreAddressList[0]);

    const handleStoreClick = (store) => {
        setSelectedStore(store);
    };

    return (
        <div className="!w-full !min-h-screen">
            <Breadcrumbs />

            <div className="!px-8 lg:!px-[45px] !py-6">
                <h1 className="!text-xl !font-bold !text-gray-900 !uppercase">HỆ THỐNG CỬA HÀNG</h1>
            </div>
            <div className="!flex !flex-col md:!flex-row !h-[calc(100vh-200px)] !px-4 sm:!px-8 lg:!px-[45px] !pb-4 md:!py-0 !gap-0 md:!gap-4">
                <div className="!w-full md:!w-2/5 !bg-[#ededed] max-h-[calc(100vh-200px) !overflow-y-auto custom-scrollbar !pb-0">
                    <div className="!p-0 md:!p-4">
                        <div className="!space-y-1 !bg-white">
                            {lamineStoreAddressList.map((store) => (
                                <div
                                    key={store.id}
                                    className={`!p-4 !border-b !border-gray-100 !cursor-pointer !hover:bg-gray-50 !transition-colors ${
                                        selectedStore?.id === store.id ? "!bg-blue-50 md:!border-l-4 md:!border-l-blue-500" : ""
                                    }`}
                                    onClick={() => handleStoreClick(store)}
                                >
                                    <h3 className="!font-semibold !text-gray-900 !mb-2">{store.name}</h3>
                                    <div className="!space-y-2">
                                        <div className="!flex !items-start !gap-2">
                                            <FaMapPin className="!h-4 !w-4 !text-gray-400 !mt-0.5 !flex-shrink-0" />
                                            <p className="!text-gray-600 !text-sm !leading-relaxed">{store.address}</p>
                                        </div>
                                        <div className="!flex !items-center !gap-2">
                                            <BsPhone className="!h-4 !w-4 !text-gray-400 !flex-shrink-0" />
                                            <span className="!text-gray-600 !text-sm">{store.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Map */}
                <div className="!w-full md:!w-3/5 !bg-white !mt-4 md:!mt-0">
                    {selectedStore ? (
                        <div className="!h-full !flex !flex-col">
                            <iframe
                                title={`Map for ${selectedStore.name}`}
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedStore.address)}&output=embed`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    ) : (
                        <div className="!h-full !flex !items-center !justify-center !bg-gray-100 !p-6 md:!p-0">
                            <div className="!text-center">
                                <FaMapPin className="!h-16 !w-16 !text-gray-300 !mx-auto !mb-4" />
                                <p className="!text-gray-500 !text-lg">Chọn một cửa hàng để xem bản đồ</p>
                                <p className="!text-gray-400 !text-sm !mt-2">Click vào một cửa hàng bên trái để hiển thị vị trí</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export { AllStore };
