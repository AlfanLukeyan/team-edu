import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface SubmissionCardProps {
    id: string;
    user_profile_url: string;
    user_name: string;
    user_id: string;
    time_remaining?: number;
    status: string;
    score?: number;
    total_score?: number;
    isSelected?: boolean;
    onLongPress?: (id: string) => void;
    onPress?: (id: string) => void;
}

export const SubmissionCard: React.FC<SubmissionCardProps> = ({
    id,
    user_profile_url,
    user_name,
    user_id,
    time_remaining,
    status,
    score,
    total_score,
    isSelected = false,
    onLongPress,
    onPress
}) => {
    const theme = useColorScheme() || "light";

    return (
        <TouchableOpacity
            onLongPress={() => onLongPress?.(id)}
            onPress={() => onPress?.(id)}
            delayLongPress={500}
        >
            <ThemedView
                isCard={true}
                style={[
                    styles.container,
                    isSelected && {
                        borderColor: Colors[theme].tint,
                        backgroundColor: theme === "dark" ? 'rgba(190, 27, 182, 0.1)' : 'rgba(30, 206, 206, 0.1)',
                    },
                ]}
            >
                <View style={styles.userInfoContainer}>
                    <Image
                        source={{ uri: user_profile_url }}
                        style={styles.profileImage}
                    />
                    <View style={styles.textContainer}>
                        <ThemedText type="defaultSemiBold">{user_name}</ThemedText>
                        <ThemedText>{user_id}</ThemedText>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statusContainer}>
                        <View
                            style={[
                                styles.statusIndicator,
                                { backgroundColor: getStatusColor(status, theme) }
                            ]}
                        />
                        <ThemedText>{formatStatus(status)}</ThemedText>
                    </View>

                    {status === "completed" ? (
                        <ThemedText type="defaultSemiBold">{score}/{total_score}</ThemedText>
                    ) : (
                        <ThemedText>{time_remaining != null ? formatTimeRemaining(time_remaining) : "Empty"}</ThemedText>
                    )}
                </View>
            </ThemedView>
        </TouchableOpacity>
    );
}

// Helper functions remain the same
const formatStatus = (status: string): string => {
    switch (status) {
        case "completed": return "Completed";
        case "in_progress": return "In Progress";
        case "not_started": return "Not Started";
        default: return status;
    }
}

const getStatusColor = (status: string, theme: string): string => {
    switch (status) {
        case "completed": return "#4CAF50";
        case "in_progress": return "#2196F3";
        case "not_started": return theme === "dark" ? "#999" : "#757575";
        default: return "#FF9800";
    }
}

const formatTimeRemaining = (seconds: number): string => {
    if (seconds === 0) return "No time remaining";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    textContainer: {
        justifyContent: 'center',
    },
    statsContainer: {
        alignItems: 'flex-end',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
});