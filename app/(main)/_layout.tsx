import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from "@expo/vector-icons";
const { width } = Dimensions.get('window');
const TAB_WIDTH = (width - 190) / 3;

export default function MainLayout() {
    const colorScheme = useColorScheme();
    const { user, isLoading } = useAuth();
    const [activeIndex, setActiveIndex] = useState(0);
    const translateX = useRef(new Animated.Value(0)).current;
    const scaleValues = useRef([
        new Animated.Value(1),
        new Animated.Value(1),
        new Animated.Value(1),
    ]).current;

    useEffect(() => {
        translateX.setValue(0);
        scaleValues.forEach((scale, index) => {
            scale.setValue(index === 0 ? 1.2 : 1);
        });
    }, []);

    if (!user) {
        return <Redirect href="/(auth)/onboarding" />;
    }

    const animateTab = (index: number) => {
        Animated.spring(translateX, {
            toValue: index * TAB_WIDTH,
            useNativeDriver: true,
        }).start();

        scaleValues.forEach((scale, i) => {
            Animated.spring(scale, {
                toValue: i === index ? 1.2 : 1,
                useNativeDriver: true,
                speed: 12,
                bounciness: 8,
            }).start();
        });

        setActiveIndex(index);
    };

    const getIconName = (routeName: string, isFocused: boolean): string => {
        const icons: { [key: string]: string } = {
            index: isFocused ? 'home' : 'home-outline',
            classes: isFocused ? 'book' : 'book-outline',
            profile: isFocused ? 'person' : 'person-outline',
        };
        return icons[routeName];
    };

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                },
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontSize: 16,
                    fontFamily: 'Poppins-Regular',
                },
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
                headerShadowVisible: false,
            }}
            tabBar={({ navigation, state, descriptors }) => (
                <View style={[styles.tabBarContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background, shadowColor: Colors[colorScheme ?? 'light'].tint }]}>
                    {/* Sliding Indicator */}
                    <Animated.View
                        style={[
                            styles.slider,
                            {
                                backgroundColor: Colors[colorScheme ?? 'light'].tint,
                                transform: [{ translateX }],
                            },
                        ]}
                    />

                    {/* Tab Buttons */}
                    {state.routes.map((route, index) => {
                        const isFocused = state.index === index;

                        return (
                            <Pressable
                                key={route.key}
                                style={styles.tabButton}
                                onPress={() => {
                                    const event = navigation.emit({
                                        type: 'tabPress',
                                        target: route.key,
                                        canPreventDefault: true,
                                    });

                                    if (!isFocused && !event.defaultPrevented) {
                                        navigation.navigate(route.name);
                                        animateTab(index);
                                    }
                                }}
                            >
                                <Animated.View
                                    style={[
                                        styles.iconContainer,
                                        {
                                            transform: [{ scale: scaleValues[index] }],
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name={getIconName(
                                            route.name as 'index' | 'classes' | 'profile',
                                            isFocused
                                        ) as any}
                                        size={24}
                                        color={isFocused ? '#FFFFFF' : '#666666'}
                                    />
                                </Animated.View>
                            </Pressable>
                        );
                    })}
                </View>
            )}
        >
            <Tabs.Screen name="index" options={{ title: "Hi, Team Edu" }} />
            <Tabs.Screen name="classes" options={{ title: "Assigned Classes" }} />
            <Tabs.Screen name="profile" options={{ title: "User Profile" }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: Platform.select({
            ios: 24,
            default: 18,
        }),
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        height: 65,
        borderRadius: 30,
        padding: 10,
        elevation: 4,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    tabBar: {
        display: 'none',
    },
    slider: {
        position: 'absolute',
        width: 45,
        height: 45,
        borderRadius: 22.5,
        top: 10,
        left: 20,
    },
    tabButton: {
        width: TAB_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
});