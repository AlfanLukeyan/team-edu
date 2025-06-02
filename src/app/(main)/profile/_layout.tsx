import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';
import React from 'react';

const SCREEN_OPTIONS = {
    headerBackVisible: false,
    headerTitleAlign: 'center' as const,
    headerTitleStyle: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    headerShadowVisible: false,
};

export default function ProfileLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack 
            screenOptions={{
                ...SCREEN_OPTIONS,
                headerStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                },
            }}
        >
            <Stack.Screen 
                name="index" 
                options={{ 
                    title: "User Profile",
                }} 
            />
            <Stack.Screen 
                name="edit_profile" 
                options={{ 
                    headerShown: true,
                    title: "Edit Profile",
                }} 
            />
            <Stack.Screen 
                name="change_face_reference" 
                options={{ 
                    headerShown: true,
                    title: "Change Face Reference",
                }}
            />
        </Stack>
    );
}