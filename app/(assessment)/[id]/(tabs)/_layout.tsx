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
    { name: 'questions', label: 'Questions', icon: 'help-circle-outline' },
    { name: 'submissions', label: 'Submissions', icon: 'document-text-outline' },
    { name: 'todo', label: 'Todo', icon: 'list-outline' },
];

export default function AssessmentTabsLayout() {
    return (
        <MaterialTopTabs
            initialRouteName="index"
            screenOptions={{ swipeEnabled: true }}
            tabBar={(props) => <AnimatedTabBar {...props} tabs={tabs} />}
        >
            <MaterialTopTabs.Screen name="index" options={{ title: 'About' }} />
            <MaterialTopTabs.Screen name="questions" options={{ title: 'Questions' }} />
            <MaterialTopTabs.Screen name="submissions" options={{ title: 'Submissions' }} />
            <MaterialTopTabs.Screen name="todo" options={{ title: 'Todo' }} />
        </MaterialTopTabs>
    );
}