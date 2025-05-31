import CustomAlert from "@/components/CustomAlert";
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
import { View } from "react-native";
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

    const [alertOptions, setAlertOptions] = useState<{
        visible: boolean;
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        type?: 'warning' | 'danger' | 'info';
        onConfirm?: () => void;
        onCancel?: () => void;
    }>({
        visible: false,
        title: '',
        message: '',
    });

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

        const handleShowAlert = (options: any) => {
            setAlertOptions({
                visible: true,
                ...options,
            });
        };

        const handleHideAlert = () => {
            setAlertOptions(prev => ({ ...prev, visible: false }));
        };

        ModalEmitter.on("SHOW_ERROR", handleError);
        ModalEmitter.on("SHOW_SUCCESS", handleSuccess);
        ModalEmitter.on("SHOW_LOADING", handleShowLoading);
        ModalEmitter.on("HIDE_LOADING", handleHideLoading);
        ModalEmitter.on("UNAUTHORIZED", handleUnauthorized);
        ModalEmitter.on("ANOTHER_DEVICE_LOGIN", handleAnotherDeviceLogin);
        ModalEmitter.on("SHOW_ALERT", handleShowAlert);
        ModalEmitter.on("HIDE_ALERT", handleHideAlert);

        return () => {
            ModalEmitter.off("SHOW_ERROR", handleError);
            ModalEmitter.off("SHOW_SUCCESS", handleSuccess);
            ModalEmitter.off("SHOW_LOADING", handleShowLoading);
            ModalEmitter.off("HIDE_LOADING", handleHideLoading);
            ModalEmitter.off("UNAUTHORIZED", handleUnauthorized);
            ModalEmitter.off("ANOTHER_DEVICE_LOGIN", handleAnotherDeviceLogin);
            ModalEmitter.off("SHOW_ALERT", handleShowAlert);
            ModalEmitter.off("HIDE_ALERT", handleHideAlert);
        };
    }, [router]);

    if (!loaded) {
        return null;
    }

    return (
        <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                    <BottomSheetModalProvider>
                        <NavigationHandler>
                            <Slot />
                        </NavigationHandler>
                        <StatusBar style="auto" />

                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 9999,
                            pointerEvents: (isLoading || !!errorMessage || !!successMessage || alertOptions.visible) ? 'auto' : 'none'
                        }}>
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
                            <CustomAlert
                                visible={alertOptions.visible}
                                title={alertOptions.title}
                                message={alertOptions.message}
                                confirmText={alertOptions.confirmText}
                                cancelText={alertOptions.cancelText}
                                type={alertOptions.type}
                                onConfirm={() => {
                                    alertOptions.onConfirm?.();
                                    setAlertOptions(prev => ({ ...prev, visible: false }));
                                }}
                                onCancel={() => {
                                    alertOptions.onCancel?.();
                                    setAlertOptions(prev => ({ ...prev, visible: false }));
                                }}
                            />
                        </View>
                    </BottomSheetModalProvider>
                </ThemeProvider>
            </GestureHandlerRootView>
        </AuthProvider>
    );
}