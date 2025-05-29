import ErrorModal from "@/components/ErrorModal";
import LoadingModal from "@/components/LoadingModal";
import SuccessModal from "@/components/SuccessModal";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ModalEmitter } from "@/services/modalEmitter";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

function NavigationHandler({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inProtectedGroup = segments[0] === '(main)'
            || segments[0] === '(assessment)'
            || segments[0] === '(assignment)'
            || segments[0] === '(class)'
            || segments[0] === '(verification)';

        if (isAuthenticated) {
            if (inAuthGroup) {
                router.replace('/(main)');
            }
        } else {
            if (inProtectedGroup) {
                router.replace('/(auth)/login');
            }
        }
    }, [isAuthenticated, segments, isLoading]);

    return <>{children}</>;
}

export default function RootLayout() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined);

    useEffect(() => {
        const handleError = (message: string) => {
            setErrorMessage(message);
        };

        const handleSuccess = (message: string) => {
            setSuccessMessage(message);
        };

        const handleShowLoading = (message?: string) => {
            setLoadingMessage(message);
            setIsLoading(true);
        };

        const handleHideLoading = () => {
            setIsLoading(false);
            setLoadingMessage(undefined);
        };

        const handleUnauthorized = () => {
            setErrorMessage("Session expired. Please log in again.");
            setTimeout(() => {
                router.replace('/(auth)/login');
            }, 1000);
        };

        const handleAnotherDeviceLogin = (message: string) => {
            setErrorMessage(message);
            setTimeout(() => {
                router.replace('/(auth)/login');
            }, 1000);
        };

        ModalEmitter.on("SHOW_ERROR", handleError);
        ModalEmitter.on("SHOW_SUCCESS", handleSuccess);
        ModalEmitter.on("SHOW_LOADING", handleShowLoading);
        ModalEmitter.on("HIDE_LOADING", handleHideLoading);
        ModalEmitter.on("UNAUTHORIZED", handleUnauthorized);
        ModalEmitter.on("ANOTHER_DEVICE_LOGIN", handleAnotherDeviceLogin);

        return () => {
            ModalEmitter.off("SHOW_ERROR", handleError);
            ModalEmitter.off("SHOW_SUCCESS", handleSuccess);
            ModalEmitter.off("SHOW_LOADING", handleShowLoading);
            ModalEmitter.off("HIDE_LOADING", handleHideLoading);
            ModalEmitter.off("UNAUTHORIZED", handleUnauthorized);
            ModalEmitter.off("ANOTHER_DEVICE_LOGIN", handleAnotherDeviceLogin);
        };
    }, [router]);

    if (!loaded) {
        return null;
    }

    return (
        <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                        <NavigationHandler>
                            <Slot />
                        </NavigationHandler>
                        <StatusBar style="auto" />
                        <ErrorModal
                            visible={!!errorMessage}
                            errorMessage={errorMessage || ""}
                            onClose={() => setErrorMessage(null)}
                        />
                        <SuccessModal
                            visible={!!successMessage}
                            successMessage={successMessage || ""}
                            onClose={() => setSuccessMessage(null)}
                        />
                        <LoadingModal
                            visible={isLoading}
                            message={loadingMessage}
                        />
                    </ThemeProvider>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </AuthProvider>
    );
}