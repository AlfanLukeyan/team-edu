import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface AssessmentCardProps {
    title: string;
    startDate: string;
    endDate: string;
    onPress?: () => void;
    onLongPress?: () => void;
    isSelected?: boolean;
}

export function AssessmentCard({
    title,
    startDate,
    endDate,
    onPress,
    onLongPress,
    isSelected = false
}: AssessmentCardProps) {
    const theme = useColorScheme() ?? "light";

    return (
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            delayLongPress={500}
        >
            <View style={[
                styles.container,
                isSelected && {
                    borderColor: Colors[theme].tint,
                    borderWidth: 2,
                    backgroundColor: theme === "dark"
                        ? 'rgba(190, 27, 182, 0.1)'
                        : 'rgba(30, 206, 206, 0.1)',
                }
            ]}>
                <View style={styles.gradientContainer}>
                    <LinearGradient
                        colors={["#BE1BB6", "#1ECEFF"]}
                        style={styles.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.textContainer}>
                        <ThemedText type="defaultSemiBold" style={styles.title}>
                            {title}
                        </ThemedText>
                        <View style={styles.dateRow}>
                            <ThemedText type="default" style={styles.dateText}>
                                {startDate}
                            </ThemedText>
                            <IconSymbol
                                name="circle.fill"
                                size={6}
                                color={
                                    theme === "light"
                                        ? Colors.light.tabIconSelected
                                        : Colors.dark.tabIconSelected
                                }
                                style={styles.separator}
                            />
                            <ThemedText type="default" style={styles.dateText}>
                                {endDate}
                            </ThemedText>
                        </View>
                    </View>

                    {isSelected && (
                        <View style={styles.selectionContainer}>
                            <Ionicons
                                name="checkmark-circle"
                                size={24}
                                color={Colors[theme].tint}
                            />
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    gradientContainer: {
        position: "absolute",
        left: 12,
        top: 12,
        bottom: 12,
        width: 3,
    },
    gradient: {
        flex: 1,
        width: "100%",
    },
    contentContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginLeft: 14,
    },
    textContainer: {
        flexDirection: "column",
        flex: 1,
    },
    title: {
        fontSize: 16,
        marginBottom: 4,
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    dateText: {
        fontSize: 14,
        opacity: 0.8,
    },
    separator: {
        marginHorizontal: 8,
        alignSelf: "center",
    },
    selectionContainer: {
        marginLeft: 12,
    },
});