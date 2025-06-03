import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

const TAB_BAR_PADDING = 20;
const TAB_BAR_WIDTH = Math.min(width - 40, 400);
const SLIDER_SIZE = 45;
const TAB_COUNT = 3;
const AVAILABLE_WIDTH = TAB_BAR_WIDTH - (TAB_BAR_PADDING * 2);
const TAB_WIDTH = AVAILABLE_WIDTH / TAB_COUNT;

const TAB_CONFIG = {
    animationSpeed: 12,
    bounciness: 8,
    iconSize: 24,
    activeScale: 1.2,
    inactiveScale: 1,
};

const ICON_MAP = {
    index: { focused: 'home', unfocused: 'home-outline' },
    classes: { focused: 'book', unfocused: 'book-outline' },
    profile: { focused: 'person', unfocused: 'person-outline' },
} as const;

export default function MainLayout() {
    const colorScheme = useColorScheme() || 'light';
    const pathname = usePathname();
    const [activeIndex, setActiveIndex] = useState(0);
    const translateX = useRef(new Animated.Value(0)).current;
    const scaleValues = useRef([
        new Animated.Value(TAB_CONFIG.activeScale),
        new Animated.Value(TAB_CONFIG.inactiveScale),
        new Animated.Value(TAB_CONFIG.inactiveScale),
    ]).current;

    // Calculate slider position based on tab index and center it within each tab
    const getSliderPosition = useCallback((index: number) => {
        const tabCenter = (index * TAB_WIDTH) + (TAB_WIDTH / 2);
        return tabCenter - (SLIDER_SIZE / 2);
    }, []);

    // Extract common animation logic
    const animateToIndex = useCallback((index: number) => {
        Animated.spring(translateX, {
            toValue: getSliderPosition(index),
            useNativeDriver: true,
            speed: TAB_CONFIG.animationSpeed,
            bounciness: TAB_CONFIG.bounciness,
        }).start();

        scaleValues.forEach((scale, i) => {
            Animated.spring(scale, {
                toValue: i === index ? TAB_CONFIG.activeScale : TAB_CONFIG.inactiveScale,
                useNativeDriver: true,
                speed: TAB_CONFIG.animationSpeed,
                bounciness: TAB_CONFIG.bounciness,
            }).start();
        });
    }, [translateX, scaleValues, getSliderPosition]);

    const initializeAnimations = useCallback(() => {
        translateX.setValue(getSliderPosition(0));
        scaleValues.forEach((scale, index) => {
            scale.setValue(index === 0 ? TAB_CONFIG.activeScale : TAB_CONFIG.inactiveScale);
        });
    }, [translateX, scaleValues, getSliderPosition]);

    useEffect(() => {
        initializeAnimations();
    }, [initializeAnimations]);

    // Sync tab state with pathname changes
    useEffect(() => {
        let newIndex = 0;
        if (pathname.includes('/classes')) newIndex = 1;
        else if (pathname.includes('/profile')) newIndex = 2;
        else if (pathname === '/(main)' || pathname === '/') newIndex = 0;

        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
            animateToIndex(newIndex);
        }
    }, [pathname, activeIndex, animateToIndex]);

    const animateTab = useCallback((index: number) => {
        animateToIndex(index);
        setActiveIndex(index);
    }, [animateToIndex]);

    const getIconName = useCallback((routeName: keyof typeof ICON_MAP, isFocused: boolean): string => {
        return ICON_MAP[routeName][isFocused ? 'focused' : 'unfocused'];
    }, []);

    const handleTabPress = useCallback((navigation: any, route: any, index: number, isFocused: boolean) => {
        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            if (route.name === 'profile') {
                navigation.navigate('profile', { screen: 'index' });
            } else {
                navigation.navigate(route.name);
            }
            animateTab(index);
        }
    }, [animateTab]);

    const renderTabBar = useCallback(({ navigation, state }: any) => {
        const shouldHideTabBar = pathname.includes('/profile/edit_profile') ||
            pathname.includes('/profile/change_face_reference') ||
            (pathname.includes('/profile/') && pathname !== '/profile');

        if (shouldHideTabBar) return null;

        const currentTabIndex = state.index;
        if (currentTabIndex !== activeIndex) {
            requestAnimationFrame(() => {
                setActiveIndex(currentTabIndex);
                animateToIndex(currentTabIndex);
            });
        }

        return (
            <View style={[
                styles.tabBarContainer,
                {
                    backgroundColor: Colors[colorScheme].background,
                    shadowColor: Colors[colorScheme].tint,
                    width: TAB_BAR_WIDTH,
                }
            ]}>
                <Animated.View
                    style={[
                        styles.slider,
                        {
                            backgroundColor: Colors[colorScheme].tint,
                            transform: [{ translateX }],
                        },
                    ]}
                />

                {state.routes.map((route: any, index: number) => (
                    <TabButton
                        key={route.key}
                        route={route}
                        index={index}
                        isFocused={state.index === index}
                        scaleValue={scaleValues[index]}
                        onPress={() => handleTabPress(navigation, route, index, state.index === index)}
                        getIconName={getIconName}
                        colorScheme={colorScheme}
                    />
                ))}
            </View>
        );
    }, [colorScheme, handleTabPress, getIconName, translateX, scaleValues, pathname, activeIndex, animateToIndex]);

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: Colors[colorScheme].background },
                headerTitleAlign: 'center',
                headerTitleStyle: { fontSize: 16, fontFamily: 'Poppins-Regular' },
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
                headerShadowVisible: false,
            }}
            tabBar={renderTabBar}
        >
            <Tabs.Screen name="index" options={{ title: "Hi, Team Edu" }} />
            <Tabs.Screen name="classes" options={{ title: "Assigned Classes" }} />
            <Tabs.Screen name="profile" options={{ headerShown: false }} />
        </Tabs>
    );
}

const TabButton = React.memo(({
    route, index, isFocused, scaleValue, onPress, getIconName, colorScheme
}: {
    route: any;
    index: number;
    isFocused: boolean;
    scaleValue: Animated.Value;
    onPress: () => void;
    getIconName: (routeName: keyof typeof ICON_MAP, isFocused: boolean) => string;
    colorScheme: 'light' | 'dark';
}) => (
    <Pressable style={[styles.tabButton, { width: TAB_WIDTH }]} onPress={onPress}>
        <Animated.View
            style={[
                styles.iconContainer,
                { transform: [{ scale: scaleValue }] },
            ]}
        >
            <Ionicons
                name={getIconName(route.name as keyof typeof ICON_MAP, isFocused) as any}
                size={TAB_CONFIG.iconSize}
                color={isFocused ? Colors[colorScheme].background : Colors[colorScheme].text}
            />
        </Animated.View>
    </Pressable>
));

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: Platform.select({ ios: 24, default: 18 }),
        alignSelf: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 65,
        borderRadius: 30,
        paddingHorizontal: TAB_BAR_PADDING,
        ...Platform.select({
            web: {
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
            },
            default: {
                elevation: 4,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
        }),
    },
    tabBar: { display: 'none' },
    slider: {
        position: 'absolute',
        width: SLIDER_SIZE,
        height: SLIDER_SIZE,
        borderRadius: SLIDER_SIZE / 2,
        top: (65 - SLIDER_SIZE) / 2,
        left: TAB_BAR_PADDING,
    },
    tabButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    iconContainer: {
        width: SLIDER_SIZE,
        height: SLIDER_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
});