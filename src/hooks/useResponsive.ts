import { useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';

export interface BreakpointConfig {
    mobile: number;
    tablet: number;
    desktop: number;
    largeDesktop: number;
}

export interface ResponsiveValues {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isLargeDesktop: boolean;
    screenWidth: number;
    screenHeight: number;
    isWeb: boolean;
    isNativeMobile: boolean;
    isWebMobile: boolean;
    breakpoint: 'mobile' | 'tablet' | 'desktop' | 'largeDesktop';
}

const DEFAULT_BREAKPOINTS: BreakpointConfig = {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    largeDesktop: 1440,
};

export const useResponsive = (customBreakpoints?: Partial<BreakpointConfig>): ResponsiveValues => {
    const breakpoints = { ...DEFAULT_BREAKPOINTS, ...customBreakpoints };
    const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions(window);
        });

        return () => subscription?.remove();
    }, []);

    const { width: screenWidth, height: screenHeight } = dimensions;
    const isWeb = Platform.OS === 'web';
    const isNativeMobile = Platform.OS === 'ios' || Platform.OS === 'android';

    const isMobile = isNativeMobile ? true : screenWidth < breakpoints.tablet;
    const isTablet = isNativeMobile ? false : screenWidth >= breakpoints.tablet && screenWidth < breakpoints.desktop;
    const isDesktop = isNativeMobile ? false : screenWidth >= breakpoints.desktop && screenWidth < breakpoints.largeDesktop;
    const isLargeDesktop = isNativeMobile ? false : screenWidth >= breakpoints.largeDesktop;

    const isWebMobile = isWeb && screenWidth < breakpoints.tablet;

    const breakpoint: ResponsiveValues['breakpoint'] =
        isNativeMobile ? 'mobile' :
            isLargeDesktop ? 'largeDesktop' :
                isDesktop ? 'desktop' :
                    isTablet ? 'tablet' :
                        'mobile';

    return {
        isMobile,
        isTablet,
        isDesktop,
        isLargeDesktop,
        screenWidth,
        screenHeight,
        isWeb,
        isNativeMobile,
        isWebMobile,
        breakpoint,
    };
};

export const useResponsiveValue = <T>(values: {
    mobile?: T;
    tablet?: T;
    desktop?: T;
    largeDesktop?: T;
    default: T;
}): T => {
    const { breakpoint } = useResponsive();

    return values[breakpoint] ?? values.default;
};