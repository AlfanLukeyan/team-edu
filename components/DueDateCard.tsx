import { Colors } from '@/constants/Colors';
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, View } from 'react-native';
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from './ui/IconSymbol';

interface DueDateCardProps {
    startDate: string;
    endDate: string;
}

export const DueDateCard: React.FC<DueDateCardProps> = ({ startDate, endDate }) => {
    const theme = useColorScheme() || "light";
    return (
        <ThemedView isCard={true} style={styles.container}>
            <ThemedText type="defaultSemiBold">Due Dates</ThemedText>
            <IconSymbol
                name="calendar.circle.fill"
                size={48}
                color={Colors[theme].icon}
            />
            <View>
                <ThemedText>{startDate}</ThemedText>
                <ThemedText>{endDate}</ThemedText>
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