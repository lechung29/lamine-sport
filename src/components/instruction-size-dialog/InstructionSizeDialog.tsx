/** @format */

import React from "react";
import { Dialog } from "../dialog";
import { IoIosArrowDown } from "react-icons/io";
import { Popover } from "antd";
import { classNames } from "@/utils";

interface IInstructionSizeDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IInstructionProductOptionProps {
    menuWidth?: number;
    selectedOption?: IBasicDropdownOption;
    onChange: (newOption: IBasicDropdownOption) => void;
}

interface IBasicDropdownOption {
    key: string;
    text: string;
}

const productTypeOptions: IBasicDropdownOption[] = [
    {
        key: "sportShoes",
        text: "Giày thể thao",
    },
    {
        key: "shirt",
        text: "Áo",
    },
    {
        key: "shorts",
        text: "Quần",
    },
    {
        key: "skirt",
        text: "Váy",
    },
    {
        key: "socks",
        text: "Tất/Vớ",
    },
];

const InstructionProductOption: React.FunctionComponent<IInstructionProductOptionProps> = (props) => {
    const { menuWidth, selectedOption, onChange } = props;
    return (
        <div className="!p-0.5 !bg-white h-auto" style={{ width: menuWidth || "100%" }}>
            {productTypeOptions.map((productType) => (
                <div
                    key={productType.key}
                    className={classNames("w-full !my-0.5 !p-2 !py-1.5 cursor-pointer text-[#333] hover:bg-[#1c2635] hover:text-white transition-all duration-300", {
                        "bg-[#1c2635] text-white": selectedOption?.key === productType.key,
                    })}
                    onClick={() => onChange(productType)}
                >
                    {productType.text}
                </div>
            ))}
        </div>
    );
};

const InstructionSizeDialog: React.FunctionComponent<IInstructionSizeDialogProps> = (props) => {
    const { isOpen, onClose } = props;
    const [productType, setProductType] = React.useState<IBasicDropdownOption>();
    const [triggerWidth, setTriggerWidth] = React.useState<number>(0);
    const [isOpenMenu, setIsOpenMenu] = React.useState<boolean>(false);
    const triggerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, [isOpen]);

    const instructionSizeImg = React.useMemo(() => {
        let imgSrc = "";
        switch (productType?.key) {
            case "sportShoes":
                imgSrc = "/src/assets/instruction-size-shoes.webp";
                break;
            case "shirt":
                imgSrc = "/src/assets/instruction-size-shirt.webp";
                break;
            case "shorts":
                imgSrc = "/src/assets/instruction-size-shorts.webp";
                break;
            case "skirt":
                imgSrc = "/src/assets/instruction-size-skirt.jpg";
                break;
            case "socks":
                imgSrc = "/src/assets/instruction-size-socks.webp";
                break;
        }
        return imgSrc;
    }, [productType]);

    return (
        <Dialog isOpen={isOpen} onClose={onClose} withoutFooter={true}>
            <div className="w-full h-full">
                <h2 className="!text-[16px] !font-semibold uppercase !mb-3.5">Bảng gợi ý kích cỡ</h2>
                <Popover
                    open={isOpenMenu}
                    arrow={false}
                    align={{ offset: [0, 5] }}
                    placement="bottomRight"
                    content={
                        <InstructionProductOption
                            selectedOption={productType}
                            menuWidth={triggerWidth}
                            onChange={(newOption) => {
                                setProductType(newOption);
                                setIsOpenMenu(false);
                            }}
                        />
                    }
                    getPopupContainer={() => document.body}
                    onOpenChange={(isOpen) => setIsOpenMenu(isOpen)}
                    trigger="click"
                >
                    <div className="inline-flex items-center justify-between max-w-90 w-full h-auto !px-2 !py-1.5 !mb-4 !border !border-[#ebebeb] cursor-pointer" ref={triggerRef}>
                        <span>{productType?.text ?? "Chọn loại sản phẩm"}</span>
                        <IoIosArrowDown />
                    </div>
                </Popover>
                {instructionSizeImg && <img src={instructionSizeImg} alt="Instruction Size" className="w-full h-auto !mb-2 object-contain" />}
            </div>
        </Dialog>
    );
};

export { InstructionSizeDialog };
