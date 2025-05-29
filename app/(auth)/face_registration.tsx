import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from "@/components/Button";
import { ButtonWithDescription } from "@/components/ButtonWithDescription";
import { RegistrationProgress } from "@/components/RegistrationProgress";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRegistration } from "@/contexts/RegistrationContext";
import { useAuth } from "@/hooks/useAuth";
import { ModalEmitter } from '@/services/modalEmitter';
import { restoreBrightness, setMaxBrightness } from "@/utils/utils";

const FACE_REGISTRATION_CONFIG = {
    TOTAL_STEPS: 3,
    PROCESSING_DELAY: 500,
} as const;

const STEP_INSTRUCTIONS = [
    {
        image: require('@/assets/images/step_1_instruction.png'),
        desc: "Look straight at the camera"
    },
    {
        image: require('@/assets/images/step_2_instruction.png'),
        desc: "Turn your head slightly to the left"
    },
    {
        image: require('@/assets/images/step_3_instruction.png'),
        desc: "Turn your head slightly to the right"
    }
];

export default function FaceRegistrationScreen() {
    const router = useRouter();
    const cameraRef = useRef<CameraView>(null);
    const { registerUser } = useAuth();
    const { registrationData, clearRegistrationData } = useRegistration();

    const [permission, requestPermission] = useCameraPermissions();
    const [currentStep, setCurrentStep] = useState(1);
    const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
    const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

    useEffect(() => {
        if (!registrationData && !isRegistrationComplete) {
            ModalEmitter.showError("Registration data not found. Please start over.");
            router.replace("/(auth)/register");
            return;
        }

        setMaxBrightness();
        return () => {
            restoreBrightness();
        };
    }, [registrationData, isRegistrationComplete]);

    useEffect(() => {
        if (capturedPhotos.length === FACE_REGISTRATION_CONFIG.TOTAL_STEPS) {
            handleRegistrationComplete();
        }
    }, [capturedPhotos]);

    const handleRegistrationComplete = useCallback(async () => {
        if (!registrationData || capturedPhotos.length !== FACE_REGISTRATION_CONFIG.TOTAL_STEPS) return;

        ModalEmitter.showLoading("Creating your account...");

        try {
            const response = await registerUser(
                registrationData.name,
                registrationData.email,
                registrationData.password,
                registrationData.phone,
                capturedPhotos
            );

            setIsRegistrationComplete(true);
            ModalEmitter.hideLoading();
            ModalEmitter.showSuccess(response.message || "Registration successful! Please check your email for verification.");
            clearRegistrationData();

            // Delay navigation to allow user to see success message
            setTimeout(() => {
                router.replace("/(auth)/login");
            }, 1500);

        } catch (error: any) {
            ModalEmitter.hideLoading();
            // Error is already handled by the HTTP client, but we can add specific handling here if needed
        }
    }, [registrationData, capturedPhotos, registerUser, clearRegistrationData, router]);

    const handleTakePicture = useCallback(async () => {
        if (!cameraRef.current) return;

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

            if (currentStep < FACE_REGISTRATION_CONFIG.TOTAL_STEPS) {
                setCurrentStep(prev => prev + 1);
                ModalEmitter.showSuccess(
                    `Photo ${currentStep} captured! Now step ${currentStep + 1} of ${FACE_REGISTRATION_CONFIG.TOTAL_STEPS}`
                );
            } else {
                ModalEmitter.showSuccess("All photos captured! Processing...");
            }

        } catch (error) {
            console.error("Error taking picture:", error);
            ModalEmitter.hideLoading();
            ModalEmitter.showError("Failed to capture image. Please try again.");
        }
    }, [cameraRef, currentStep, capturedPhotos]);

    const resetRegistration = useCallback(() => {
        setCurrentStep(1);
        setCapturedPhotos([]);
    }, []);

    if (!permission?.granted) {
        return (
            <ThemedView style={styles.container}>
                <ThemedView style={styles.content}>
                    <ThemedText type="title" style={styles.title}>
                        Face Registration
                    </ThemedText>
                    <ThemedText style={styles.description}>
                        We need camera permission to register your face for secure authentication
                    </ThemedText>
                    <Button onPress={requestPermission}>
                        Allow Camera Access
                    </Button>
                </ThemedView>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={[styles.container]}>
            {/* Header */}
            <View style={styles.header}>
                <ThemedText type='subtitle'>
                    Registering as: {registrationData?.name}
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
                />
                <View style={styles.overlay}>
                    <View style={styles.faceOutline} />
                </View>
            </View>

            {/* Bottom Actions */}
            <View style={[styles.bottom]}>
                <ButtonWithDescription
                    description={`Capture photo ${currentStep} of ${FACE_REGISTRATION_CONFIG.TOTAL_STEPS} for face registration`}
                    onPress={handleTakePicture}
                >
                    Take Picture
                </ButtonWithDescription>

                {capturedPhotos.length > 0 && (
                    <Button
                        onPress={resetRegistration}
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
    header: {
        alignItems: "center",
        padding: 8,
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
    bottom: {
        padding: 20,
        gap: 15,
    },
    resetButton: {
        marginTop: 10,
    },
});