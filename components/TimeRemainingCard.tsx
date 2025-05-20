import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface TimeRemainingCardProps {
    duration: number; // in seconds
}

export const TimeRemainingCard: React.FC<TimeRemainingCardProps> = ({
    duration,
}) => {
    const theme = useColorScheme() || "light";

    return (
        <ThemedView isCard={true} style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <ThemedText type="title">{Math.floor(duration / 60)}</ThemedText>
                    <ThemedText>h</ThemedText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <ThemedText type="title">{duration % 60}</ThemedText>
                    <ThemedText>min</ThemedText>
                </View>
            </View>
        </ThemedView>
    );
};
const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 18,
        padding: 8,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
});
