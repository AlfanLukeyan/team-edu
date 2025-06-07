import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
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
        image: require('../../../assets/images/step_1_instruction.png'),
        desc: "Look straight at the camera"
    },
    {
        image: require('../../../assets/images/step_2_instruction.png'),
        desc: "Turn your head slightly to the left"
    },
    {
        image: require('../../../assets/images/step_3_instruction.png'),
        desc: "Turn your head slightly to the right"
    }
];

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isTablet = screenWidth > 768;

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

        if (!isWeb) {
            setMaxBrightness();
            return () => {
                restoreBrightness();
            };
        }
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

            router.replace("/(auth)/login");

        } catch (error: any) {
            ModalEmitter.hideLoading();
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
                <View style={[styles.content, isWeb && styles.webContent]}>
                    <ThemedText type="title" style={styles.title}>
                        Face Registration
                    </ThemedText>
                    <ThemedText style={styles.description}>
                        We need camera permission to register your face for secure authentication
                    </ThemedText>
                    <Button onPress={requestPermission}>
                        Allow Camera Access
                    </Button>
                </View>
            </ThemedView>
        );
    }

    // Current step instruction
    const currentInstruction = STEP_INSTRUCTIONS[currentStep - 1];

    // Web/Desktop Layout
    if (isWeb) {
        return (
            <ThemedView style={styles.container}>
                <ScrollView contentContainerStyle={styles.webScrollContainer}>
                    <View style={styles.webMainContainer}>
                        <View style={styles.webLeftSection}>
                            <View style={styles.webHeader}>
                                <ThemedText type="title" style={styles.webTitle}>
                                    Face Registration
                                </ThemedText>
                                <ThemedText style={styles.webSubtitle}>
                                    Registering as: {registrationData?.name}
                                </ThemedText>
                            </View>

                            <View style={styles.webProgressSection}>
                                <RegistrationProgress
                                    steps={STEP_INSTRUCTIONS}
                                    currentStep={currentStep}
                                    completedSteps={capturedPhotos.length}
                                />
                            </View>

                            <View style={styles.webInstructionContainer}>
                                <ThemedText style={styles.webInstruction}>
                                    Step {currentStep} of {FACE_REGISTRATION_CONFIG.TOTAL_STEPS}
                                </ThemedText>
                                <ThemedText style={styles.webInstructionDetail}>
                                    {currentInstruction.desc}
                                </ThemedText>
                            </View>

                            <View style={styles.webButtonContainer}>
                                <ButtonWithDescription
                                    description={`Capture photo ${currentStep} of ${FACE_REGISTRATION_CONFIG.TOTAL_STEPS} for face registration`}
                                    onPress={handleTakePicture}
                                    style={styles.webButton}
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
                        </View>

                        <View style={styles.webRightSection}>
                            <View style={styles.webCameraContainer}>
                                <CameraView
                                    ref={cameraRef}
                                    style={styles.webCamera}
                                    facing="front"
                                    ratio="1:1"
                                    pictureSize='1088x1088'
                                />
                                <View style={styles.overlay}>
                                    <View style={styles.faceOutline} />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </ThemedView>
        );
    }

    // Mobile Layout
    return (
        <ThemedView style={styles.container}>
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
            <View style={styles.bottom}>
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
    webContent: {
        maxWidth: 400,
        alignSelf: 'center',
    },
    title: {
        textAlign: "center",
    },
    description: {
        textAlign: "center",
        opacity: 0.7,
    },

    // Mobile Styles
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
    bottom: {
        padding: 20,
        gap: 15,
    },
    resetButton: {
        marginTop: 10,
    },

    // Web Styles
    webScrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        minHeight: screenHeight,
        padding: 20,
    },
    webMainContainer: {
        flexDirection: isTablet ? 'row' : 'column',
        maxWidth: isTablet ? 1200 : 600,
        alignSelf: 'center',
        gap: isTablet ? 40 : 30,
        alignItems: 'center',
    },
    webLeftSection: {
        flex: isTablet ? 1 : undefined,
        width: isTablet ? undefined : '100%',
        maxWidth: isTablet ? undefined : 400,
        gap: 24,
    },
    webRightSection: {
        flex: isTablet ? 1 : undefined,
        alignItems: 'center',
        justifyContent: 'center',
    },
    webHeader: {
        gap: 8,
    },
    webTitle: {
        textAlign: isTablet ? "left" : "center",
        fontSize: 28,
    },
    webSubtitle: {
        textAlign: isTablet ? "left" : "center",
        opacity: 0.8,
        fontSize: 16,
    },
    webProgressSection: {
        width: '100%',
    },
    webInstructionContainer: {
        gap: 8,
    },
    webInstruction: {
        textAlign: isTablet ? "left" : "center",
        fontSize: 18,
        fontWeight: '600',
    },
    webInstructionDetail: {
        textAlign: isTablet ? "left" : "center",
        opacity: 0.7,
        fontSize: 16,
    },
    webButtonContainer: {
        width: '100%',
        gap: 12,
    },
    webButton: {
        width: '100%',
    },
    webCameraContainer: {
        width: isTablet ? 350 : Math.min(screenWidth - 40, 350),
        height: isTablet ? 350 : Math.min(screenWidth - 40, 350),
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        ...Platform.select({
            web: {
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 8,
            },
        }),
    },
    webCamera: {
        width: '100%',
        height: '100%',
    },

    // Shared Styles
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
        ...Platform.select({
            web: {
                borderStyle: 'dashed',
            },
            default: {},
        }),
    },
});