import { Colors } from "@/constants/Colors";
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from "expo-router";
import React from "react";

export default function ClassDetailLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Class Detail",
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 16,
          fontFamily: "Poppins-Medium",
        },
      }}
    />
  );
}