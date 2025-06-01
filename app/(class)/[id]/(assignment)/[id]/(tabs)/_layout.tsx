import { AnimatedTabBar } from '@/components/AnimatedTabBar';
import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import React from 'react';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

const tabs = [
    { name: 'index', label: 'About', icon: 'information-circle-outline' },
    { name: 'submissions', label: 'Submissions', icon: 'document-text-outline' },
    { name: 'completed', label: 'Completed', icon: 'checkmark-done-outline' },
    { name: 'uncompleted', label: 'Uncompleted', icon: 'close-circle-outline' },
];

export default function AssignmentTabsLayout() {
    return (
        <MaterialTopTabs
            initialRouteName="index"
            screenOptions={{ swipeEnabled: true }}
            tabBar={(props) => <AnimatedTabBar {...props} tabs={tabs} />}
        >
            <MaterialTopTabs.Screen name="index" options={{ title: 'About' }} />
            <MaterialTopTabs.Screen name="submissions" options={{ title: 'Submissions' }} />
            <MaterialTopTabs.Screen name="completed" options={{ title: 'Completed' }} />
            <MaterialTopTabs.Screen name="uncompleted" options={{ title: 'Uncompleted' }} />
        </MaterialTopTabs>
    );
}