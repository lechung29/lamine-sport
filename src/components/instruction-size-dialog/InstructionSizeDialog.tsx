/** @format */

import React from "react";
import { Dialog } from "../dialog";
import { IoIosArrowDown } from "react-icons/io";
import { Popover } from "antd";
import { classNames } from "@/utils";
import { Box, Image, Text } from "../elements";

interface IInstructionSizeDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IInstructionProductOptionProps {
    options: IBasicDropdownOption[];
    menuWidth?: number;
    selectedOption?: IBasicDropdownOption;
    onChange: (newOption: IBasicDropdownOption) => void;
}

export interface IBasicDropdownOption {
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

export const InstructionProductOption: React.FunctionComponent<IInstructionProductOptionProps> = (props) => {
    const { menuWidth, selectedOption, options, onChange } = props;
    return (
        <Box bgColor="white" padding={[2, 2, 2, 2]} className="h-auto" style={{ width: menuWidth || "100%" }}>
            {options.map((productType) => (
                <Box
                    key={productType.key}
                    className={classNames("w-full !my-0.5 !p-2 !py-1.5 cursor-pointer text-[#333] hover:bg-[#1c2635] hover:text-white transition-all duration-300", {
                        "bg-[#1c2635] text-white": selectedOption?.key === productType.key,
                    })}
                    onClick={() => onChange(productType)}
                >
                    {productType.text}
                </Box>
            ))}
        </Box>
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
                imgSrc = "./assets/instruction-size-shoes.webp";
                break;
            case "shirt":
                imgSrc = "./assets/instruction-size-shirt.webp";
                break;
            case "shorts":
                imgSrc = "./assets/instruction-size-shorts.webp";
                break;
            case "skirt":
                imgSrc = "./assets/instruction-size-skirt.jpg";
                break;
            case "socks":
                imgSrc = "./assets/instruction-size-socks.webp";
                break;
        }
        return imgSrc;
    }, [productType]);

    return (
        <Dialog isOpen={isOpen} onClose={onClose} withoutFooter={true}>
            <Box className="w-full h-full">
                <Text size="base" fontWeight="semibold" textTransform="uppercase" margin={[0, 0, 14, 0]} titleText="Bảng gợi ý kích cỡ" />
                <Popover
                    open={isOpenMenu}
                    arrow={false}
                    align={{ offset: [0, 5] }}
                    placement="bottomRight"
                    content={
                        <InstructionProductOption
                            options={productTypeOptions}
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
                    <Box className="inline-flex items-center justify-between max-w-90 w-full h-auto !px-2 !py-1.5 !mb-4 !border !border-[#ebebeb] cursor-pointer" ref={triggerRef}>
                        <Text as="span" titleText={productType?.text ?? "Chọn loại sản phẩm"} />
                        <IoIosArrowDown />
                    </Box>
                </Popover>
                {instructionSizeImg && <Image src={instructionSizeImg} alt="Bảng hướng dẫn size" objectFit="contain" className="w-full h-auto !mb-2" />}
            </Box>
        </Dialog>
    );
};

export { InstructionSizeDialog };
