import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { ButtonWithDescription } from "@/components/ButtonWithDescription";
import { RegistrationProgress } from "@/components/RegistrationProgress";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ModalEmitter } from '@/services/modalEmitter';
import { userService } from '@/services/userService';
import { restoreBrightness, setMaxBrightness } from "@/utils/utils";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

const FACE_REFERENCE_CONFIG = {
    TOTAL_STEPS: 3,
    PROCESSING_DELAY: 500,
} as const;

const STEP_INSTRUCTIONS = [
    {
        image: require('../../../../assets/images/step_1_instruction.png'),
        desc: "Look straight at the camera"
    },
    {
        image: require('../../../../assets/images/step_2_instruction.png'),
        desc: "Turn your head slightly to the left"
    },
    {
        image: require('../../../../assets/images/step_3_instruction.png'),
        desc: "Turn your head slightly to the right"
    }
];

export default function ChangeFaceReferenceScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const cameraRef = useRef<CameraView>(null);

    const [permission, requestPermission] = useCameraPermissions();
    const [currentStep, setCurrentStep] = useState(1);
    const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        setMaxBrightness();
        return () => {
            restoreBrightness();
        };
    }, []);

    useEffect(() => {
        if (capturedPhotos.length === FACE_REFERENCE_CONFIG.TOTAL_STEPS) {
            handleUpdateComplete();
        }
    }, [capturedPhotos]);

    // Header setup
    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Change Face Reference",
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.headerButton}
                    disabled={isUpdating}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={Colors[colorScheme ?? 'light'].tint}
                    />
                </TouchableOpacity>
            ),
        });
    }, [navigation, colorScheme, isUpdating, router]);

    const handleUpdateComplete = useCallback(async () => {
        if (capturedPhotos.length !== FACE_REFERENCE_CONFIG.TOTAL_STEPS) return;

        setIsUpdating(true);
        ModalEmitter.showLoading("Updating face reference...");

        try {
            const response = await userService.updateFaceReference(capturedPhotos);

            ModalEmitter.hideLoading();
            ModalEmitter.showSuccess(response.message || "Face reference updated successfully!");

            // Delay navigation to allow user to see success message
            setTimeout(() => {
                router.back();
            }, 1500);

        } catch (error: any) {
            ModalEmitter.hideLoading();
            ModalEmitter.showError(error.message || "Failed to update face reference");
            setIsUpdating(false);
        }
    }, [capturedPhotos, router]);

    const handleTakePicture = useCallback(async () => {
        if (!cameraRef.current || isUpdating) return;

        ModalEmitter.showLoading(`Capturing photo ${currentStep}...`);

        try {
            const photo = await cameraRef.current.takePictureAsync({
                shutterSound: false,
                quality: 0.8,
            });

            console.log(`Photo taken for step ${currentStep}:`, photo);

            const newPhotos = [...capturedPhotos, photo.uri];
            setCapturedPhotos(newPhotos);

            ModalEmitter.hideLoading();

            if (currentStep < FACE_REFERENCE_CONFIG.TOTAL_STEPS) {
                setCurrentStep(prev => prev + 1);
                ModalEmitter.showSuccess(
                    `Photo ${currentStep} captured! Now step ${currentStep + 1} of ${FACE_REFERENCE_CONFIG.TOTAL_STEPS}`
                );
            } else {
                ModalEmitter.showSuccess("All photos captured! Processing...");
            }

        } catch (error) {
            console.error("Error taking picture:", error);
            ModalEmitter.hideLoading();
            ModalEmitter.showError("Failed to capture image. Please try again.");
        }
    }, [cameraRef, currentStep, capturedPhotos, isUpdating]);

    const resetCapture = useCallback(() => {
        if (isUpdating) return;
        setCurrentStep(1);
        setCapturedPhotos([]);
    }, [isUpdating]);

    if (!permission?.granted) {
        return (
            <ThemedView style={styles.container}>
                <ThemedView style={styles.content}>
                    <ThemedText type="title" style={styles.title}>
                        Camera Permission Required
                    </ThemedText>
                    <ThemedText style={styles.description}>
                        We need camera permission to update your face reference for secure authentication
                    </ThemedText>
                    <Button onPress={requestPermission}>
                        Allow Camera Access
                    </Button>
                </ThemedView>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            {/* Header Info */}
            <View style={styles.header}>
                <ThemedText type='subtitle' style={styles.headerText}>
                    Update Face Reference
                </ThemedText>
                <ThemedText style={styles.subHeaderText}>
                    Take 3 photos for improved recognition
                </ThemedText>
            </View>

            {/* Progress Indicator */}
            <RegistrationProgress
                steps={STEP_INSTRUCTIONS}
                currentStep={currentStep}
                completedSteps={capturedPhotos.length}
            />

            {/* Camera Section */}
            <View style={styles.cameraContainer}>
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing="front"
                    ratio="1:1"
                    pictureSize='1088x1088'
                    autofocus="on"
                />
                <View style={styles.overlay}>
                    <View style={styles.faceOutline} />
                </View>

                {isUpdating && (
                    <View style={styles.processingOverlay}>
                        <ActivityIndicator size="large" color="white" />
                        <ThemedText style={styles.processingText}>
                            Processing...
                        </ThemedText>
                    </View>
                )}
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottom}>
                <ButtonWithDescription
                    description={`Capture photo ${currentStep} of ${FACE_REFERENCE_CONFIG.TOTAL_STEPS} for face reference update`}
                    onPress={handleTakePicture}
                    disabled={isUpdating}
                >
                    {isUpdating ? "Processing..." : "Take Picture"}
                </ButtonWithDescription>

                {capturedPhotos.length > 0 && !isUpdating && (
                    <Button
                        onPress={resetCapture}
                        style={styles.resetButton}
                    >
                        Start Over
                    </Button>
                )}
            </View>
        </ThemedView>
    );
}

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
    headerButton: {
        padding: 8,
    },
    header: {
        alignItems: "center",
        padding: 16,
        paddingTop: 8,
    },
    headerText: {
        textAlign: "center",
        marginBottom: 4,
    },
    subHeaderText: {
        textAlign: "center",
        opacity: 0.7,
        fontSize: 14,
    },
    cameraContainer: {
        marginHorizontal: 20,
        aspectRatio: 1,
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
    processingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    processingText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    bottom: {
        padding: 20,
        gap: 15,
    },
    resetButton: {
        marginTop: 10,
    },
});