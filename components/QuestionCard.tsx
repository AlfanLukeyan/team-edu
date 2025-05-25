import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from './ui/IconSymbol';

interface QuestionCardProps {
    id: string;
    questionNumber: number;
    questionText: string;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    id,
    questionNumber,
    questionText,
    onDelete,
    onEdit
}) => {
    const theme = useColorScheme() || "light";

    const renderRightActions = () => {
        return (
            <View style={{ flexDirection: 'row', marginRight: 16, alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => onEdit?.(id)}
                >
                    <ThemedView isCard={true} style={{
                            flex: 1,
                            marginVertical: 5,
                            marginHorizontal: 8,
                            borderRadius: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 8
                    }}>
                        <IconSymbol name="pencil.circle.fill" size={24} color={Colors[theme].icon} />
                    </ThemedView>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onDelete?.(id)}
                >
                    <ThemedView isCard={true} style={{
                        flex: 1,
                        marginVertical: 5,
                        borderRadius: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 8
                    }}>
                        <IconSymbol name="trash.circle.fill" size={24} color="red" />
                    </ThemedView>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            friction={2}
            rightThreshold={40}
            overshootRight={false}
        >
            <ThemedView isCard={true} style={styles.container}>
                <View style={{ backgroundColor: theme === "dark" ? Colors.light.background : Colors.dark.background, borderRadius: 12, paddingHorizontal: 14, paddingTop: 4, marginTop: 2, marginRight: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <ThemedText type="defaultSemiBold" style={{ textAlign: "center", alignItems: "center", color: theme === "dark" ? Colors.light.text : Colors.dark.text }}>{questionNumber}</ThemedText>
                </View>
                <View style={styles.questionTextContainer}>
                    <ThemedText style={{}}>{questionText}</ThemedText>
                </View>
            </ThemedView>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    questionTextContainer: {
        flex: 1,
    }
});