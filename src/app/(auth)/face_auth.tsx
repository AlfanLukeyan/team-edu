import { TextInput } from "@/components/AuthTextInput";
import { Button } from "@/components/Button";
import { ButtonWithDescription } from "@/components/ButtonWithDescription";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/hooks/useAuth";
import { ModalEmitter } from "@/services/modalEmitter";
import {
    restoreBrightness,
    setMaxBrightness,
} from "@/utils/utils";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

const STEP_INSTRUCTION = {
    image: require('../../../assets/images/step_1_instruction.png'),
    desc: "Look straight at the camera"
};

export default function FaceAuthScreen() {
    const router = useRouter();
    const cameraRef = useRef<CameraView>(null);
    const { faceLoginUser } = useAuth();

    const [permission, requestPermission] = useCameraPermissions();
    const [email, setEmail] = useState("");

    useEffect(() => {
        setMaxBrightness();
        return () => {
            restoreBrightness();
        };
    }, []);

    const handleVerify = async () => {
        if (!email.trim()) {
            ModalEmitter.showError("Please enter your email address");
            return;
        }

        if (!cameraRef.current) return;

        ModalEmitter.showLoading("Verifying your identity...");
        
        try {
            const photo = await cameraRef.current.takePictureAsync({
                shutterSound: false,
                quality: 0.8,
            });

            console.log("Photo taken for face auth:", photo);

            const userData = await faceLoginUser(email.trim(), photo.uri);
            
            if (userData) {
                ModalEmitter.hideLoading();
                ModalEmitter.showSuccess("Face verification successful!");
                
                // Delay navigation to allow user to see success message
                setTimeout(() => {
                    router.replace("/(main)");
                }, 1500);
            }

        } catch (error: any) {
            console.error("Face verification error:", error);
            ModalEmitter.hideLoading();
            // Error is already handled by the HTTP client, but we can add specific handling here if needed
            ModalEmitter.showError(error.message || "Face verification failed. Please try again.");
        }
    };

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

    return (
        <ThemedView style={styles.container}>
            <View style={styles.instructionContainer}>
                <ThemedText style={styles.instruction}>
                    {STEP_INSTRUCTION.desc}
                </ThemedText>
            </View>

            <View style={styles.form}>
                <TextInput
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    leftIcon="person.fill"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.cameraContainer}>
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing="front"
                    ratio="1:1"
                    pictureSize="1088x1088"
                    autofocus="on"
                />
                <View style={styles.overlay}>
                    <View style={styles.faceOutline} />
                </View>
            </View>

            <View style={[styles.bottom]}>
                <ButtonWithDescription
                    description="Ready for authentication? Tap verify!"
                    onPress={handleVerify}
                    disabled={!email.trim()}
                >
                    Verify Identity
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
    instructionContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
        marginTop: 20,
    },
    instruction: {
        textAlign: 'center',
        opacity: 0.7,
    },
    form: {
        paddingHorizontal: 20,
        marginBottom: 20,
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
});