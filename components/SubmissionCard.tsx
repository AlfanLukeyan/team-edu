import { useColorScheme } from "@/hooks/useColorScheme";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Swipeable, } from 'react-native-gesture-handler';
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from './ui/IconSymbol';

interface SubmissionCardProps {
    id: string;
    user_profile_url: string;
    user_name: string;
    user_id: string;
    time_remaining?: number;
    status: string;
    score?: number;
    total_score?: number;
    onDelete?: (id: string) => void;
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
    onDelete
}) => {
    const theme = useColorScheme() || "light";
    const isNotStarted = status === "not_started";
    const renderRightActions = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    Alert.alert(
                        "Delete Submission",
                        `Are you sure you want to delete ${user_name}'s submission?`,
                        [
                            { text: "Cancel", style: "cancel" },
                            {
                                text: "Delete",
                                style: "destructive",
                                onPress: () => onDelete?.(id)
                            }
                        ]
                    );
                }}
                style={{ marginRight: 8 }}
            >
                <ThemedView
                    isCard={true}
                    style={{
                        flex: 1,
                        marginVertical: 5,
                        marginHorizontal: 8,
                        borderRadius: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 8
                    }}
                >
                    <IconSymbol name="trash.circle.fill" size={24} color="red" />
                </ThemedView>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            friction={2}
            rightThreshold={40}
            overshootRight={false}
            enabled={!isNotStarted}
        >
            <ThemedView isCard={true} style={styles.container}>
                {/* Existing card content */}
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
        </Swipeable>
    );
}

// Helper functions
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
        case "completed": return "#4CAF50";  // Green
        case "in_progress": return "#2196F3"; // Blue
        case "not_started": return theme === "dark" ? "#999" : "#757575"; // Gray
        default: return "#FF9800"; // Orange for unknown status
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
    deleteAction: {
        marginVertical: 8,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
});