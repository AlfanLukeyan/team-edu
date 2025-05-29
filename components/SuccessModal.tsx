import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Animated,
    Modal,
    StyleSheet
} from "react-native";
import { Button } from "./Button";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface SuccessModalProps {
    visible: boolean;
    successMessage: string;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    visible,
    successMessage,
    onClose,
}) => {
    const theme = useColorScheme() ?? "light";
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, fadeAnim]);

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Animated.View style={[styles.centeredView, { opacity: fadeAnim }]}>
                <ThemedView isCard={true} style={styles.modalView}>
                    <Ionicons
                        name="checkmark-circle"
                        size={48}
                        color="#4CAF50"
                    />
                    <ThemedText style={{ textAlign: "center" }}>{successMessage}</ThemedText>
                    <Button onPress={onClose}>Continue</Button>
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
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
        width: "70%",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        gap: 15,
    },
});

export default SuccessModal;