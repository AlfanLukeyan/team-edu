import { Button } from "@/components/Button";
import { ButtonWithDescription } from "@/components/ButtonWithDescription";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { authService } from "@/services/authService";
import { ModalEmitter } from "@/services/modalEmitter";
import { restoreBrightness, setMaxBrightness } from "@/utils/utils";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useCallback, useEffect, useRef } from "react";
import {
    Animated,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";

interface CrucialFeatureAuthModalProps {
    visible: boolean;
    onSuccess: () => void;
    onCancel: () => void;
    title?: string;
    description?: string;
}

const CAMERA_CONFIG = {
    facing: "front" as const,
    ratio: "1:1" as const,
    pictureSize: "1088x1088",
    autofocus: "on" as const,
    quality: 0.8,
};

const CrucialFeatureAuthModal: React.FC<CrucialFeatureAuthModalProps> = ({
    visible,
    onSuccess,
    onCancel,
    title = "Crucial Feature Authentication",
    description = "Look straight at the camera for crucial verification"
}) => {
    const colorScheme = useColorScheme() ?? "light";
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setMaxBrightness();
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            restoreBrightness();
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }

        return () => {
            if (visible) {
                restoreBrightness();
            }
        };
    }, [visible, fadeAnim]);

    const handleVerify = useCallback(async () => {
        if (!cameraRef.current) return;

        ModalEmitter.showLoading("Verifying crucial access...");

        try {
            const photo = await cameraRef.current.takePictureAsync({
                shutterSound: false,
                quality: CAMERA_CONFIG.quality,
            });

            const response = await authService.crucialVerify(photo.uri);

            ModalEmitter.hideLoading();
            ModalEmitter.showSuccess(response.message || "Crucial access granted!");

            // Short delay for user to see success message
            setTimeout(() => {
                onSuccess();
            }, 1000);

        } catch (error: any) {
            ModalEmitter.hideLoading();
            ModalEmitter.showError(error.message || "Crucial verification failed. Please try again.");
        }
    }, [onSuccess]);

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    if (!permission?.granted) {
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={visible}
                onRequestClose={handleCancel}
            >
                <Animated.View style={[styles.centeredView, { opacity: fadeAnim }]}>
                    <ThemedView isCard={true} style={styles.permissionContainer}>
                        <ThemedText type="title" style={styles.title}>
                            {title}
                        </ThemedText>
                        <ThemedText style={styles.description}>
                            We need camera permission for crucial feature verification
                        </ThemedText>
                        <View style={styles.buttonRow}>
                            <Button
                                onPress={requestPermission}
                                style={{ flex: 1 }}
                            >
                                Allow Camera
                            </Button>
                            <Button
                                type="secondary"
                                onPress={handleCancel}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </Button>
                        </View>
                    </ThemedView>
                </Animated.View>
            </Modal>
        );
    }

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={handleCancel}
        >
            <Animated.View style={[styles.centeredView, { opacity: fadeAnim }]}>
                <ThemedView isCard={true} style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
                            {title}
                        </ThemedText>
                        <ThemedText style={styles.modalDescription}>
                            {description}
                        </ThemedText>
                        <ThemedText style={styles.subDescription}>
                            This verification is required for sensitive operations
                        </ThemedText>
                    </View>

                    {/* Camera */}
                    <View style={styles.cameraContainer}>
                        <CameraView
                            ref={cameraRef}
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

                    {/* Actions */}
                    <View style={styles.actions}>
                        <ButtonWithDescription
                            description="Verify your identity to continue"
                            onPress={handleVerify}
                        >
                            Verify Identity
                        </ButtonWithDescription>

                        <TouchableOpacity
                            onPress={handleCancel}
                            style={styles.cancelButton}
                        >
                            <ThemedText style={[styles.cancelText, { color: Colors[colorScheme].text }]}>
                                Cancel
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </ThemedView>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 20,
    },
    modalContainer: {
        width: "100%",
        maxWidth: 400,
        borderRadius: 20,
        padding: 0,
        overflow: 'hidden',
    },
    permissionContainer: {
        width: "100%",
        maxWidth: 350,
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
        gap: 15,
    },
    header: {
        padding: 20,
        paddingBottom: 15,
        alignItems: 'center',
    },
    modalTitle: {
        textAlign: "center",
        marginBottom: 8,
    },
    modalDescription: {
        textAlign: "center",
        opacity: 0.7,
        marginBottom: 4,
    },
    subDescription: {
        textAlign: 'center',
        opacity: 0.5,
        fontSize: 12,
    },
    cameraContainer: {
        aspectRatio: 1,
        marginHorizontal: 20,
        borderRadius: 15,
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
        width: 120,
        height: 160,
        borderRadius: 80,
        borderWidth: 3,
        borderColor: "white",
        borderStyle: "dashed",
    },
    actions: {
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
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    title: {
        textAlign: "center",
        marginBottom: 8,
    },
    description: {
        textAlign: "center",
        opacity: 0.7,
        marginBottom: 15,
    },
});

export default CrucialFeatureAuthModal;