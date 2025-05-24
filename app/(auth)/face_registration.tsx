import { Button } from "@/components/Button";
import { ButtonWithDescription } from "@/components/ButtonWithDescription";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ErrorModalEmitter } from "@/services/api_services";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FaceRegistrationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

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

  const getStepInstruction = () => {
    switch (currentStep) {
      case 1:
        return "Look straight at the camera";
      case 2:
        return "Turn your head slightly to the left";
      case 3:
        return "Turn your head slightly to the right";
      default:
        return "Position your face in the circle";
    }
  };

  const handleTakePicture = async () => {
    if (!cameraRef.current) return;

    setIsLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        shutterSound: false,
        quality: 0.8,
      });
      
      console.log(`Photo ${currentStep} taken:`, photo.uri);
      
      const newPhotos = [...capturedPhotos, photo.uri];
      setCapturedPhotos(newPhotos);
      
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
        ErrorModalEmitter.emit("SHOW_ERROR", `Photo ${currentStep} captured! Now step ${currentStep + 1} of 3`);
      } else {
        ErrorModalEmitter.emit("SHOW_ERROR", "Face registration completed successfully!");
        console.log("All photos captured:", newPhotos);
        
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 2000);
      }
      
    } catch (error) {
      console.error("Error taking picture:", error);
      ErrorModalEmitter.emit("SHOW_ERROR", "Failed to capture image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title">Face Registration</ThemedText>
      </View>

      {/* <View style={styles.stepContainer}>
        <ThemedText type="defaultSemiBold" style={styles.stepText}>
          Step {currentStep} of 3
        </ThemedText>
        <ThemedText style={styles.instructionText}>
          {getStepInstruction()}
        </ThemedText>
      </View>

      <View style={styles.progressContainer}>
        {[1, 2, 3].map((step) => (
          <View
            key={step}
            style={[
              styles.progressDot,
              {
                backgroundColor: step <= currentStep 
                  ? capturedPhotos.length >= step 
                    ? "#4CAF50" // Green for completed
                    : "#2196F3" // Blue for current
                  : "#E0E0E0" // Gray for pending
              }
            ]}
          />
        ))}
      </View> */}

      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="front" />
        
        {/* Overlay positioned absolutely over the camera */}
        <View style={styles.overlay}>
          <View style={styles.faceOutline} />
        </View>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 20 }]}>
        <ButtonWithDescription 
          description={`Capture photo ${currentStep} of 3 for face registration`}
          onPress={handleTakePicture} 
          disabled={isLoading}
        >
          {isLoading ? "Taking Picture..." : "Take Picture"}
        </ButtonWithDescription>
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
  stepContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  stepText: {
    fontSize: 18,
    marginBottom: 8,
  },
  instructionText: {
    textAlign: "center",
    opacity: 0.8,
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
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
    width: 200,
    height: 250,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "white",
    borderStyle: "dashed",
  },
  bottom: {
    padding: 20,
    gap: 15,
  },
  skipButton: {
    marginTop: 10,
  },
});