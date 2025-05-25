import { Colors } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <ActivityIndicator color="#000" />;
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="onboarding"/>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot_password" />
        <Stack.Screen name="warning_screen" />
      </Stack>
    </SafeAreaProvider>
  );
}