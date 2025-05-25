import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from "@/components/Button";
import { ButtonWithDescription } from "@/components/ButtonWithDescription";
import { RegistrationProgress } from "@/components/RegistrationProgress";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ErrorModalEmitter } from "@/services/api_services";
import { restoreBrightness, saveImageToGallery, setMaxBrightness, simulateSuccessWithDelay } from "@/utils/utils";

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
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [optimalPictureSize, setOptimalPictureSize] = useState<string>('medium');

  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

  useEffect(() => {
    setMaxBrightness();
    return () => {
      restoreBrightness();
    };
  }, []);

  useEffect(() => {
    if (capturedPhotos.length === FACE_REGISTRATION_CONFIG.TOTAL_STEPS) {
      handleRegistrationComplete();
    }
  }, [capturedPhotos]);

  const handleRegistrationComplete = useCallback(() => {
    simulateSuccessWithDelay(() => {
      ErrorModalEmitter.emit("SHOW_ERROR", "Face registration completed successfully!");
      router.replace("/(auth)/login");
    }, FACE_REGISTRATION_CONFIG.PROCESSING_DELAY);
  }, [router]);

  const handleTakePicture = useCallback(async () => {
    if (!cameraRef.current || isLoading) return;

    setIsLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        shutterSound: false,
      });
      console.log("Photo taken:", photo);
      saveImageToGallery(photo.uri);

      const newPhotos = [...capturedPhotos, photo.uri];
      setCapturedPhotos(newPhotos);

      if (currentStep < FACE_REGISTRATION_CONFIG.TOTAL_STEPS) {
        setCurrentStep(prev => prev + 1);
        ErrorModalEmitter.emit("SHOW_ERROR",
          `Photo ${currentStep} captured! Now step ${currentStep + 1} of ${FACE_REGISTRATION_CONFIG.TOTAL_STEPS}`
        );
      } else {
        ErrorModalEmitter.emit("SHOW_ERROR", "Processing images...");
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      ErrorModalEmitter.emit("SHOW_ERROR", "Failed to capture image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [cameraRef, isLoading, currentStep, capturedPhotos, optimalPictureSize]);

  const resetRegistration = useCallback(() => {
    setCurrentStep(1);
    setCapturedPhotos([]);
    setIsLoading(false);
  }, []);

  if (!permission?.granted) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Face Registration
          </ThemedText>
          <ThemedText style={styles.description}>
            We need camera permission to register your face
          </ThemedText>
          <Button onPress={requestPermission}>
            Allow Camera Access
          </Button>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Face Registration</ThemedText>
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
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 20 }]}>
        <ButtonWithDescription
          description={`Capture photo ${currentStep} of ${FACE_REGISTRATION_CONFIG.TOTAL_STEPS} for face registration`}
          onPress={handleTakePicture}
          disabled={isLoading}
        >
          {isLoading ?
            (capturedPhotos.length === FACE_REGISTRATION_CONFIG.TOTAL_STEPS ? "Processing..." : "Taking Picture...")
            : "Take Picture"
          }
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
    padding: 20,
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