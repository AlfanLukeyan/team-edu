import { Colors } from '@/constants/Colors';
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, View } from 'react-native';
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from './ui/IconSymbol';

interface CompletedCountCardProps {
    comletedCount: number;
    totalCount: number;
}

export const CompletedCountCard: React.FC<CompletedCountCardProps > = ({ comletedCount, totalCount }) => {
    const theme = useColorScheme() || "light";
    return (
        <ThemedView isCard={true} style={styles.container}>
            <ThemedText type="defaultSemiBold">Completed</ThemedText>
            <IconSymbol
                name="person.fill"
                size={48}
                color={Colors[theme].icon}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ThemedText type='title'>{comletedCount}</ThemedText>
                <ThemedText>/{totalCount} Students</ThemedText>
            </View>
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    container: {
        height: "100%",
        flex: 1,
        gap: 18,
        padding: 18,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
});