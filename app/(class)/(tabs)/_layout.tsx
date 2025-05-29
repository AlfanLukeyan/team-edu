import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

const TabsLayout = () => {
    const theme = useColorScheme();
    const [activeIndex, setActiveIndex] = useState(0);
    const scaleValues = useRef([
        new Animated.Value(1),
        new Animated.Value(1),
        new Animated.Value(1),
        new Animated.Value(1),
    ]).current;

    const animateTab = (index: number) => {
        scaleValues.forEach((scale, i) => {
            Animated.spring(scale, {
                toValue: i === index ? 1.05 : 1,
                useNativeDriver: true,
            }).start();
        });

        setActiveIndex(index);
    };

    const handleIndexChange = (index: number) => {
        animateTab(index);
    };

    const getIconName = (routeName: string): string => {
        const icons: { [key: string]: string } = {
            'index': 'calendar-outline',
            'assessments': 'document-text-outline',
            'students': 'people-outline',
            'about': 'information-circle-outline',
        };
        return icons[routeName] || 'help-outline';
    };

    return (
        <MaterialTopTabs
            screenOptions={{
                swipeEnabled: true,
            }}
            tabBar={({ state, navigation }) => {
                return (
                    <View style={[styles.tabBarContainer, {
                        backgroundColor: Colors[theme ?? 'light'].background,
                        justifyContent: 'flex-start',
                    }]}>
                        {state.routes.map((route, index) => {
                            const isFocused = state.index === index;
                            const label =
                                route.name === 'index' ? 'Weekly' :
                                    route.name === 'assessments' ? 'Assessments' :
                                        route.name === 'students' ? 'Students' :
                                            'About';

                            return (
                                <Pressable
                                    key={route.key}
                                    style={styles.tabButton}
                                    onPress={() => {
                                        console.log('Tab pressed:', route.name);
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
                                            styles.tabContent,
                                            {
                                                transform: [{ scale: scaleValues[index] }],
                                                backgroundColor: isFocused ?
                                                    Colors[theme ?? 'light'].tint + '20' : 'transparent',
                                                borderColor: isFocused ?
                                                    Colors[theme ?? 'light'].tint : 'transparent',
                                            }
                                        ]}
                                    >
                                        <View style={styles.tabInner}>
                                            <Ionicons
                                                name={getIconName(route.name) as any}
                                                size={18}
                                                color={isFocused ?
                                                    Colors[theme ?? 'light'].tint :
                                                    Colors[theme ?? 'light'].tabIconDefault}
                                                style={styles.tabIcon}
                                            />
                                            {isFocused && (
                                                <Text style={[
                                                    styles.tabText,
                                                    {
                                                        color: isFocused ?
                                                            Colors[theme ?? 'light'].tint :
                                                            Colors[theme ?? 'light'].tabIconDefault,
                                                    }
                                                ]}>
                                                    {label}
                                                </Text>
                                            )}
                                        </View>
                                    </Animated.View>
                                </Pressable>
                            );
                        })}
                    </View>
                );
            }}
            screenListeners={({ navigation, route }) => ({
                focus: () => {
                    const index = ['index', 'assessments', 'students', 'about'].indexOf(route.name);
                    if (index !== -1) {
                        handleIndexChange(index);
                    }
                },
            })}
        >
            <MaterialTopTabs.Screen name="index" options={{ title: 'Weekly' }} />
            <MaterialTopTabs.Screen name="assessments" options={{ title: 'Assessments' }} />
            <MaterialTopTabs.Screen name="students" options={{ title: 'Students' }} />
            <MaterialTopTabs.Screen name="about" options={{ title: 'About' }} />
        </MaterialTopTabs>
    );
};

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 16,
        position: 'relative',
        overflow: 'visible',
    },
    tabButton: {
        marginRight: 4,
    },
    tabContent: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 15,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        textAlign: 'left',
    },
    tabInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        marginRight: 6,
    },
});

export default TabsLayout;