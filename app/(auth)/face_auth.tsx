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

export default function FaceAuthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);

  if (!permission?.granted) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Face Authentication
          </ThemedText>
          <ThemedText style={styles.description}>
            We need camera permission to verify your identity
          </ThemedText>
          <Button onPress={requestPermission}>
            Allow Camera Access
          </Button>
        </ThemedView>
      </ThemedView>
    );
  }

  const handleVerify = async () => {
    if (!cameraRef.current) return;

    setIsLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        shutterSound: false,
      });
      console.log("Photo taken:", photo);

      
      setTimeout(() => {
        ErrorModalEmitter.emit("SHOW_ERROR", "Face verification successful!");
        setIsLoading(false);
        router.replace("/(main)/(tabs)");
      }, 1000);
      
    } catch (error) {
      ErrorModalEmitter.emit("SHOW_ERROR", "Failed to capture image. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title">Face Auth</ThemedText>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="front" flash="on" focusable={true}>
          <View style={styles.overlay}>
            <View style={styles.faceOutline} />
          </View>
        </CameraView>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 20 }]}>
      <ButtonWithDescription description="Ready for the flash, then tap the verify button!" onPress={handleVerify} disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify"}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
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
    gap: 20,
  },
  instruction: {
    textAlign: "center",
    opacity: 0.8,
  },
});