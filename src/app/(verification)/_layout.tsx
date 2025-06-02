import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { TouchableOpacity } from "react-native";

const SCREEN_OPTIONS = {
    headerShown: true,
    headerTitleAlign: 'center' as const,
    headerTitleStyle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
    },
    headerShadowVisible: false,
    headerBackVisible: false,
};

export default function VerificationLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();

    const createBackButton = useCallback(() => (
        <TouchableOpacity
            onPress={() => router.back()}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        >
            <IconSymbol
                name="chevron.left"
                size={24}
                color={Colors[colorScheme ?? 'light'].tint}
            />
            <ThemedText>Back</ThemedText>
        </TouchableOpacity>
    ), [router, colorScheme]);

    return (
        <Stack
            screenOptions={{
                ...SCREEN_OPTIONS,
                headerStyle: {
                    backgroundColor: Colors[colorScheme ?? "light"].background,
                },
                contentStyle: {
                    backgroundColor: Colors[colorScheme ?? "light"].background,
                },
            }}
        >
            <Stack.Screen
                name="crucial_auth"
                options={{
                    title: "Crucial Verification Required",
                    presentation: "modal",
                    gestureEnabled: true,
                    animation: "slide_from_bottom",
                    headerLeft: () => createBackButton(),
                }}
            />
        </Stack>
    );
}