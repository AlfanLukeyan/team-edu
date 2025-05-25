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

export default function AssessmentTabsLayout() {
  const theme = useColorScheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const scaleValues = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  // Tab order: index (About) → Questions → Submissions → Todo
  const tabOrder = ['index', 'questions', 'submissions', 'todo'];

  const animateTab = (index: number) => {
    scaleValues.forEach((scale, i) => {
      Animated.spring(scale, {
        toValue: i === index ? 1.05 : 1,
        useNativeDriver: true,
      }).start();
    });
    setActiveIndex(index);
  };

  const getIconName = (routeName: string): string => {
    const icons: { [key: string]: string } = {
      'index': 'information-circle-outline', // About
      'questions': 'help-circle-outline',
      'submissions': 'document-text-outline',
      'todo': 'list-outline',
    };
    return icons[routeName] || 'help-outline';
  };

  return (
    <MaterialTopTabs
      initialRouteName="index"
      screenOptions={{
        swipeEnabled: true,
      }}
      tabBar={({ state, navigation }) => (
        <View style={[styles.tabBarContainer, {
          backgroundColor: Colors[theme ?? 'light'].background,
        }]}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const label = route.name === 'index' ? 'About' : 
                         route.name.charAt(0).toUpperCase() + route.name.slice(1);

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
                    styles.tabContent,
                    {
                      transform: [{ scale: scaleValues[index] }],
                      backgroundColor: isFocused 
                        ? Colors[theme ?? 'light'].tint + '20' 
                        : 'transparent',
                      borderColor: isFocused 
                        ? Colors[theme ?? 'light'].tint 
                        : 'transparent',
                    }
                  ]}
                >
                  <View style={styles.tabInner}>
                    <Ionicons
                      name={getIconName(route.name) as any}
                      size={18}
                      color={isFocused 
                        ? Colors[theme ?? 'light'].tint 
                        : Colors[theme ?? 'light'].tabIconDefault}
                      style={styles.tabIcon}
                    />
                    {isFocused && (
                      <Text style={[
                        styles.tabText,
                        {
                          color: isFocused 
                            ? Colors[theme ?? 'light'].tint 
                            : Colors[theme ?? 'light'].tabIconDefault,
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
      )}
      screenListeners={({ route }) => ({
        focus: () => {
          const index = tabOrder.indexOf(route.name);
          if (index !== -1) animateTab(index);
        },
      })}
    >
      <MaterialTopTabs.Screen name="index" options={{ title: 'About' }} />
      <MaterialTopTabs.Screen name="questions" options={{ title: 'Questions' }} />
      <MaterialTopTabs.Screen name="submissions" options={{ title: 'Submissions' }} />
      <MaterialTopTabs.Screen name="todo" options={{ title: 'Todo' }} />
    </MaterialTopTabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
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
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIcon: {
    marginRight: 6,
  },
});