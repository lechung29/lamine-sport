/** @format */

import React from "react";
import { Spin } from "antd";
import { MdLocationOn } from "react-icons/md";


interface GoongPrediction {
    description: string;
    place_id: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}

export interface AddressAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    size?: "large" | "middle" | "small";
    apiKey?: string;
}


const GOONG_AUTOCOMPLETE_URL = "https://rsapi.goong.io/Place/AutoComplete";
const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;

const AddressAutocomplete: React.FunctionComponent<AddressAutocompleteProps> = ({ value, onChange, placeholder = "Địa chỉ nhận hàng", className = "", size = "large", apiKey }) => {
    const resolvedKey = apiKey ?? (import.meta as any).env?.VITE_GOONG_API_KEY ?? "";

    const [inputValue, setInputValue] = React.useState<string>(value);
    const [predictions, setPredictions] = React.useState<GoongPrediction[]>([]);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [activeIndex, setActiveIndex] = React.useState<number>(-1);

    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const sessionTokenRef = React.useRef<string>(crypto.randomUUID());

    React.useEffect(() => {
        setInputValue(value);
    }, [value]);
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setPredictions([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchPredictions = async (query: string) => {
        if (!resolvedKey) {
            console.warn("[AddressAutocomplete] Thiếu VITE_GOONG_API_KEY");
            return;
        }
        try {
            setIsLoading(true);
            const params = new URLSearchParams({
                input: query,
                api_key: resolvedKey,
                sessiontoken: sessionTokenRef.current,
                limit: "7",
            });
            const res = await fetch(`${GOONG_AUTOCOMPLETE_URL}?${params.toString()}`);
            const data = await res.json();
            if (data.status === "OK" && Array.isArray(data.predictions)) {
                setPredictions(data.predictions);
                setIsOpen(true);
                setActiveIndex(-1);
            } else {
                setPredictions([]);
                setIsOpen(false);
            }
        } catch {
            setPredictions([]);
            setIsOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        onChange(val);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (val.trim().length < MIN_CHARS) {
            setPredictions([]);
            setIsOpen(false);
            return;
        }

        debounceRef.current = setTimeout(() => {
            fetchPredictions(val.trim());
        }, DEBOUNCE_MS);
    };

    const handleSelect = (prediction: GoongPrediction) => {
        const fullAddress = prediction.description;
        setInputValue(fullAddress);
        onChange(fullAddress);
        setPredictions([]);
        setIsOpen(false);
        sessionTokenRef.current = crypto.randomUUID();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen || predictions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => (prev < predictions.length - 1 ? prev + 1 : 0));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : predictions.length - 1));
        } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            handleSelect(predictions[activeIndex]);
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setPredictions([]);
        }
    };

    const handleClear = () => {
        setInputValue("");
        onChange("");
        setPredictions([]);
        setIsOpen(false);
    };
    const sizeClass = size === "large" ? "h-10 text-sm px-3" : size === "small" ? "h-6 text-xs px-2" : "h-8 text-sm px-3";

    return (
        <div ref={containerRef} className={`relative w-full mt-3! ${className}`}>
            <div
                className={`
                    flex items-center gap-2
                    w-full ${sizeClass}
                    border border-[#d9d9d9] rounded-md bg-white
                    transition-all duration-200
                    focus-within:border-[#4096ff] focus-within:shadow-[0_0_0_2px_rgba(5,145,255,0.1)]
                    hover:border-[#4096ff]
                `}
            >
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (predictions.length > 0) setIsOpen(true);
                    }}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="flex-1 outline-none border-none bg-transparent text-[#333] placeholder-[#bfbfbf] min-w-0"
                />
                {isLoading && <Spin size="small" />}
                {inputValue && !isLoading && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-[#bfbfbf] hover:text-[#888] transition-colors text-base leading-none shrink-0 cursor-pointer bg-transparent border-none p-0"
                        tabIndex={-1}
                    >
                        ✕
                    </button>
                )}
            </div>
            {isOpen && predictions.length > 0 && (
                <ul
                    className="
                        absolute z-9999 w-full mt-1
                        bg-white border border-[#e8e8e8] rounded-md
                        shadow-[0_6px_16px_rgba(0,0,0,0.12)]
                        max-h-72 overflow-y-auto
                        py-1
                        list-none m-0 p-0
                    "
                >
                    {predictions.map((pred, idx) => (
                        <li
                            key={pred.place_id}
                            onMouseDown={() => handleSelect(pred)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={`
                                flex items-start gap-2.5 px-3 py-2.5 cursor-pointer
                                transition-colors duration-100
                                ${activeIndex === idx ? "bg-[#e6f4ff]" : "hover:bg-[#f5f5f5]"}
                            `}
                        >
                            <MdLocationOn className="text-[#2a9dcc] text-base shrink-0 mt-0.5" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm text-[#333] font-medium truncate">{pred.structured_formatting.main_text}</span>
                                {pred.structured_formatting.secondary_text && <span className="text-xs text-[#888] truncate">{pred.structured_formatting.secondary_text}</span>}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export { AddressAutocomplete };
