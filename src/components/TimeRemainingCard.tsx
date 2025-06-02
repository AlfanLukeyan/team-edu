import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface TimeRemainingCardProps {
    timeRemaining: number;
}

export const TimeRemainingCard: React.FC<TimeRemainingCardProps> = ({
    timeRemaining,
}) => {
    const theme = useColorScheme() || "light";

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    return (
        <ThemedView isCard={true} style={styles.container}>
            {/* ✅ Added header */}
            <ThemedText type="subtitle" style={styles.header}>
                Time Remaining
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
                <View style={styles.timeUnit}>
                    <ThemedText type="title">{seconds}</ThemedText>
                    <ThemedText>sec</ThemedText>
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