import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { formatDate, readableHash } from "@/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import { Alert, Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface AssignmentSubmissionCardProps {
    id: string;
    user_profile_url: string;
    user_name: string;
    user_id: string;
    status: string;
    score: number;
    submitted_at: string | null;
    file_name: string | null;
    file_url: string | null;
    isSelected?: boolean;
    onLongPress?: (id: string) => void;
    onPress?: (id: string) => void;
}

export const AssignmentSubmissionCard: React.FC<AssignmentSubmissionCardProps> = ({
    id,
    user_profile_url,
    user_name,
    user_id,
    status,
    score,
    submitted_at,
    file_name,
    file_url,
    isSelected = false,
    onLongPress,
    onPress
}) => {
    const theme = useColorScheme() || "light";
    const [isExpanded, setIsExpanded] = useState(false);
    const [animation] = useState(new Animated.Value(0));
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const shouldShowImage = user_profile_url && !imageError;

    const handleDownloadSubmission = async () => {
        if (file_url) {
            try {
                const canOpen = await Linking.canOpenURL(file_url);
                if (canOpen) {
                    await Linking.openURL(file_url);
                } else {
                    Alert.alert("Error", "Cannot open the submission file");
                }
            } catch (error) {
                Alert.alert("Error", "Failed to open submission");
            }
        }
    };

    const toggleExpanded = () => {
        const toValue = isExpanded ? 0 : 1;
        setIsExpanded(!isExpanded);

        Animated.timing(animation, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const expandedHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, status === "submitted" ? 110 : 20],
    });

    const rotateChevron = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const handleCardPress = () => {
        if (onPress) {
            onPress(id);
        } else {
            toggleExpanded();
        }
    };

    return (
        <TouchableOpacity
            onLongPress={() => onLongPress?.(id)}
            onPress={handleCardPress}
            delayLongPress={500}
        >
            <ThemedView
                isCard={true}
                style={[
                    styles.container,
                    isSelected && {
                        borderColor: Colors[theme].tint,
                        borderWidth: 2,
                        backgroundColor: theme === "dark" ? 'rgba(190, 27, 182, 0.1)' : 'rgba(30, 206, 206, 0.1)',
                    },
                ]}
            >
                {/* Main Content Row */}
                <View style={styles.mainContent}>
                    {/* User Info */}
                    <View style={styles.userInfoContainer}>
                        <View style={styles.avatarContainer}>
                            {shouldShowImage ? (
                                <Image
                                    source={{
                                        uri: user_profile_url,
                                        cache: 'reload'
                                    }}
                                    style={styles.profileImage}
                                    onError={handleImageError}
                                />
                            ) : (
                                <View style={[styles.avatarPlaceholder, { backgroundColor: Colors[theme].tint + '20' }]}>
                                    <Ionicons
                                        name="person-outline"
                                        size={20}
                                        color={Colors[theme].text}
                                    />
                                </View>
                            )}
                        </View>
                        <View style={styles.textContainer}>
                            <ThemedText type="defaultSemiBold">{user_name}</ThemedText>
                            <ThemedText style={{ opacity: 0.7, fontSize: 12 }}>{readableHash(user_id, "STU")}</ThemedText>
                        </View>
                    </View>

                    {/* Status and Chevron */}
                    <View style={styles.statusSection}>
                        <View style={styles.statusContainer}>
                            <View
                                style={[
                                    styles.statusIndicator,
                                    { backgroundColor: getStatusColor(status, theme) }
                                ]}
                            />
                            <ThemedText style={styles.statusText}>
                                {status === "submitted" ? "Submitted" : "Pending"}
                            </ThemedText>
                        </View>

                        {status === "submitted" && (
                            <TouchableOpacity
                                onPress={toggleExpanded}
                                style={styles.chevronButton}
                            >
                                <Animated.View style={{ transform: [{ rotate: rotateChevron }] }}>
                                    <Ionicons
                                        name="chevron-down"
                                        size={20}
                                        color={Colors[theme].text}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Expandable Submitted Details */}
                {status === "submitted" && (
                    <Animated.View style={[styles.expandableContainer, { height: expandedHeight }]}>
                        <View style={styles.submittedDetails}>
                            <View style={styles.detailRow}>
                                <ThemedText style={styles.detailLabel}>Score:</ThemedText>
                                <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                                    {score}/100
                                </ThemedText>
                            </View>

                            {submitted_at && (
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.detailLabel}>Submitted:</ThemedText>
                                    <ThemedText style={styles.detailValue}>
                                        {formatDate(submitted_at)}
                                    </ThemedText>
                                </View>
                            )}
                            {file_name && (
                                <TouchableOpacity
                                    onPress={handleDownloadSubmission}
                                    style={styles.downloadButton}
                                >
                                    <Ionicons
                                        name="document-text"
                                        size={16}
                                        color={Colors[theme].tint}
                                    />
                                    <ThemedText
                                        style={[styles.fileName, { color: Colors[theme].tint }]}
                                        numberOfLines={1}
                                    >
                                        {file_name}
                                    </ThemedText>
                                    <Ionicons
                                        name="download"
                                        size={14}
                                        color={Colors[theme].tint}
                                        style={{ marginLeft: 4 }}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </Animated.View>
                )}

                {/* Pending State */}
                {status === "todo" && (
                    <View style={styles.pendingContainer}>
                        <ThemedText style={styles.pendingText}>Not submitted</ThemedText>
                    </View>
                )}
            </ThemedView>
        </TouchableOpacity>
    );
};

const getStatusColor = (status: string, theme: string): string => {
    switch (status) {
        case "submitted": return "#4CAF50";
        case "todo": return theme === "dark" ? "#999" : "#757575";
        default: return "#FF9800";
    }
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    mainContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        marginRight: 12,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        justifyContent: 'center',
        flex: 1,
    },
    statusSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 14,
    },
    chevronButton: {
        padding: 4,
    },
    expandableContainer: {
        overflow: 'hidden',
        marginTop: 12,
    },
    submittedDetails: {
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(128, 128, 128, 0.2)',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    detailLabel: {
        fontSize: 12,
        opacity: 0.7,
    },
    detailValue: {
        fontSize: 12,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingVertical: 6,
        paddingHorizontal: 8,
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
        borderRadius: 6,
    },
    fileName: {
        marginLeft: 4,
        fontSize: 12,
        flex: 1,
    },
    pendingContainer: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(128, 128, 128, 0.2)',
        alignItems: 'center',
    },
    pendingText: {
        fontSize: 12,
        opacity: 0.7,
        fontStyle: 'italic',
    },
});