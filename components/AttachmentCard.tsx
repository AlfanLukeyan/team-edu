import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface AttachmentCardProps {
    name: string;
    url: string;
}

export function AttachmentCard({ name, url }: AttachmentCardProps) {
    const theme = useColorScheme() ?? "light";

    const handlePress = () => {
        if (url) {
            Linking.openURL(url).catch((err) => {
                console.error("An error occurred opening the attachment:", err);
            });
        }
    };

    return (
        <Pressable onPress={handlePress}>
            <View style={[styles.container, { borderColor: Colors[theme].border }]}>
                <Ionicons
                    name="document-attach"
                    size={24}
                    color={theme === "light" ? Colors.light.text : Colors.dark.text}
                    style={{ marginRight: 8 }}
                />
                <ThemedText type="default">{name}</ThemedText>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
    },
});