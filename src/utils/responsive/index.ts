/** @format */

import React from "react";
import { useMediaQuery } from "react-responsive";

enum Breakpoint {
    DesktopMin = 1273,
    LaptopMax = 1272,
    LaptopMin = 992,
    TabletMax = 991,
    TabletMin = 768,
    MobileMax = 767,
    MobileMedium = 575,
    MobileMin = 440,
}

const useResponsive = (minWidth: number, maxWidth: number) => useMediaQuery({ minWidth: minWidth, maxWidth: maxWidth });
const useMinWidth = (minWidth: number) => useMediaQuery({ minWidth: minWidth });
const useMaxWidth = (maxWidth: number) => useMediaQuery({ maxWidth: maxWidth });

const useDesktop = () => useMediaQuery({ minWidth: Breakpoint.DesktopMin });
const Desktop: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
    const isDesktop = useDesktop();
    return isDesktop ? children : null;
};

const useLaptop = () => useMediaQuery({ maxWidth: Breakpoint.LaptopMax, minWidth: Breakpoint.LaptopMin });
const Laptop: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
    const isLaptop = useLaptop();
    return isLaptop ? children : null;
};

const useTablet = () => useMediaQuery({ maxWidth: Breakpoint.TabletMax, minWidth: Breakpoint.MobileMax });
const Tablet: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
    const isTablet = useTablet();
    return isTablet ? children : null;
};

const useMobile = () => useMediaQuery({ maxWidth: Breakpoint.MobileMax });
const Mobile: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
    const isMobile = useMobile();
    return isMobile ? children : null;
};

const useMiniMobile = () => useMediaQuery({ maxWidth: Breakpoint.MobileMedium });
const MiniMobile: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
    const isMiniMobile = useMiniMobile();
    return isMiniMobile ? children : null;
};

const useExtraMini = () => useMediaQuery({ maxWidth: Breakpoint.MobileMin });

export { Breakpoint, useDesktop, Desktop, useLaptop, Laptop, useTablet, Tablet, useMobile, Mobile, useMiniMobile, MiniMobile, useExtraMini, useResponsive, useMinWidth, useMaxWidth };
