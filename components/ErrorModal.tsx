import React from "react";
import {
    Animated,
    Modal,
    StyleSheet
} from "react-native";
import { Button } from "./Button";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface ErrorModalProps {
    visible: boolean;
    errorMessage: string;
    onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
    visible,
    errorMessage,
    onClose,
}) => {
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
                    <ThemedText style={{ textAlign: "center" }}>{errorMessage}</ThemedText>
                    <Button onPress={onClose}>Dismiss</Button>
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
        width: "60%",
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
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 16,
    },
    button: {
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#2196F3",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});

export default ErrorModal;
