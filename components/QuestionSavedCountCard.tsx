import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface QuestionSavedCountCardProps {
    savedCount: number;
    totalCount: number;
}

export const QuestionSavedCountCard: React.FC<QuestionSavedCountCardProps> = ({
    savedCount,
    totalCount,
}) => {
    const theme = useColorScheme() || "light";

    return (
        <ThemedView isCard={true} style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <ThemedText type="title">{savedCount}</ThemedText>
                <ThemedText>/{totalCount} saved</ThemedText>
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