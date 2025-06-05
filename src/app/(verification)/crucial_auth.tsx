import { Button } from "@/components/Button";
import { ButtonWithDescription } from "@/components/ButtonWithDescription";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { authService } from "@/services/authService";
import { crucialAuthManager } from "@/services/crucialAuthManager";
import { httpClient } from "@/services/httpClient";
import { ModalEmitter } from "@/services/modalEmitter";
import { restoreBrightness, setMaxBrightness } from "@/utils/utils";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface CallbackData {
    returnPath: string;
    params: Record<string, any>;
}

const INSTRUCTION = {
    image: require('../../../assets/images/step_1_instruction.png'),
    desc: "Look straight at the camera for crucial verification"
};

const CAMERA_CONFIG = {
    facing: "front" as const,
    ratio: "1:1" as const,
    pictureSize: "1088x1088",
    autofocus: "on" as const,
    quality: 0.8,
};

export default function CrucialAuthScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() || 'light';
    const cameraRef = useRef<CameraView>(null);
    const params = useLocalSearchParams();
    const [permission, requestPermission] = useCameraPermissions();

    const callbackData: CallbackData | null = params.callbackData
        ? JSON.parse(params.callbackData as string)
        : null;

    useEffect(() => {
        setMaxBrightness();
        return () => {
            restoreBrightness();
        };
    }, []);

    const handleVerify = useCallback(async () => {
        if (!cameraRef.current) return;

        ModalEmitter.showLoading("Verifying crucial access...");

        try {
            const photo = await cameraRef.current.takePictureAsync({
                shutterSound: false,
                quality: CAMERA_CONFIG.quality,
            });

            console.log("Photo taken for crucial auth:", photo);

            const response = await authService.crucialVerify(photo.uri);
            console.log("Crucial verification response:", response);

            ModalEmitter.hideLoading();
            ModalEmitter.showSuccess(response.message || "Crucial access granted!");
            if (crucialAuthManager.hasPendingRequest()) {
                await crucialAuthManager.handleVerificationSuccess(httpClient);
                navigateBack(true);
            } else {
                setTimeout(() => navigateBack(true), 1500);
            }
        } catch (error: any) {
            ModalEmitter.hideLoading();
            ModalEmitter.showError(error.message || "Crucial verification failed. Please try again.");
            console.error("Crucial verification error:", error);
            
            crucialAuthManager.handleVerificationFailure();
        }
    }, []);

    const handleCancel = useCallback(() => {
        crucialAuthManager.handleVerificationFailure();
        navigateBack(false);
    }, []);

    const navigateBack = useCallback((success: boolean) => {
        if (callbackData) {
            router.push({
                pathname: callbackData.returnPath as any,
                params: {
                    crucialSuccess: success.toString(),
                    ...callbackData.params
                }
            });
        } else {
            router.back();
        }
    }, [callbackData, router]);

    if (!permission?.granted) {
        return <CameraPermissionRequest onRequestPermission={requestPermission} />;
    }

    return (
        <ThemedView style={styles.container}>
            <InstructionSection />
            <CameraSection ref={cameraRef} />
            <ActionSection onVerify={handleVerify} onCancel={handleCancel} colorScheme={colorScheme} />
        </ThemedView>
    );
}

// Extracted Components
const CameraPermissionRequest = React.memo(({ onRequestPermission }: { onRequestPermission: () => void }) => (
    <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>
            <ThemedText type="title" style={styles.title}>
                Crucial Feature Authentication
            </ThemedText>
            <ThemedText style={styles.description}>
                We need camera permission for crucial feature verification
            </ThemedText>
            <Button onPress={onRequestPermission}>
                Allow Camera Access
            </Button>
        </ThemedView>
    </ThemedView>
));

const InstructionSection = React.memo(() => (
    <View style={styles.instructionContainer}>
        <ThemedText style={styles.instruction}>
            {INSTRUCTION.desc}
        </ThemedText>
        <ThemedText style={styles.subInstruction}>
            This verification is required for sensitive operations
        </ThemedText>
    </View>
));

const CameraSection = React.forwardRef<CameraView>((props, ref) => (
    <View style={styles.cameraContainer}>
        <CameraView
            ref={ref}
            style={styles.camera}
            facing={CAMERA_CONFIG.facing}
            ratio={CAMERA_CONFIG.ratio}
            pictureSize={CAMERA_CONFIG.pictureSize}
            autofocus={CAMERA_CONFIG.autofocus}
        />
        <View style={styles.overlay}>
            <View style={styles.faceOutline} />
        </View>
    </View>
));

const ActionSection = React.memo(({
    onVerify,
    onCancel,
    colorScheme
}: {
    onVerify: () => void;
    onCancel: () => void;
    colorScheme: 'light' | 'dark' | undefined;
}) => (
    <View style={styles.bottom}>
        <ButtonWithDescription
            description="Verify your identity to continue"
            onPress={onVerify}
        >
            Verify Identity
        </ButtonWithDescription>

        <TouchableOpacity
            onPress={onCancel}
            style={styles.cancelButton}
        >
            <ThemedText style={[styles.cancelText, { color: Colors[colorScheme ?? 'light'].text }]}>
                Cancel
            </ThemedText>
        </TouchableOpacity>
    </View>
));

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        gap: 20,
    },
    title: {
        textAlign: "center",
    },
    description: {
        textAlign: "center",
        opacity: 0.7,
    },
    instructionContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    instruction: {
        textAlign: 'center',
        opacity: 0.7,
        marginBottom: 8,
    },
    subInstruction: {
        textAlign: 'center',
        opacity: 0.5,
        fontSize: 12,
    },
    cameraContainer: {
        aspectRatio: 1,
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    faceOutline: {
        width: 150,
        height: 200,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: "white",
        borderStyle: "dashed",
    },
    bottom: {
        padding: 20,
        gap: 15,
    },
    cancelButton: {
        alignSelf: 'center',
        padding: 10,
    },
    cancelText: {
        opacity: 0.7,
    },
});