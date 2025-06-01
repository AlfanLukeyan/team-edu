import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface DurationCardProps {
    duration: number; // Duration in minutes
}

export const DurationCard: React.FC<DurationCardProps> = ({
    duration,
}) => {
    const theme = useColorScheme() || "light";

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return (
        <ThemedView isCard={true} style={styles.container}>
            {/* ✅ Header for duration */}
            <ThemedText type="subtitle" style={styles.header}>
                Duration
            </ThemedText>

            <View style={styles.timeContainer}>
                {hours > 0 && (
                    <View style={styles.timeUnit}>
                        <ThemedText type="title">{hours}</ThemedText>
                        <ThemedText>h</ThemedText>
                    </View>
                )}
                <View style={styles.timeUnit}>
                    <ThemedText type="title">{minutes}</ThemedText>
                    <ThemedText>min</ThemedText>
                </View>
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 8,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        textAlign: "center",
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    timeUnit: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
});