import { AssignmentCard } from "@/components/AssignmentCard";
import { AttachmentCard } from "@/components/AttachmentCard";
import { Button } from "@/components/Button";
import WeeklySectionActionsMenu from "@/components/WeeklySectionActionsMenu";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getYoutubeEmbedUrl } from "@/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface WeeklyCardProps {
    count?: number;
    title?: string;
    description?: string;
    videoUrl?: string;
    attachment?: {
        name: string;
        url: string;
    };
    assignment?: {
        id: string;
        title: string;
        dueDate: string;
        description: string;
    };
    weekId?: number;
    onEdit?: (weekId: number) => void;
    onDelete?: (weekId: number) => void;
    onCreateAssignment?: (weekId: number) => void;
    onEditAssignment?: (weekId: number) => void;
    onDeleteAssignment?: (weekId: number) => void;
}

export function WeeklyCard({
    count,
    title,
    description,
    videoUrl,
    attachment,
    assignment,
    weekId,
    onEdit,
    onDelete,
    onCreateAssignment,
    onEditAssignment,
    onDeleteAssignment
}: WeeklyCardProps) {
    const router = useRouter();
    const theme = useColorScheme() ?? "light";
    const screenWidth = Dimensions.get("window").width;
    const videoHeight = screenWidth * 0.5625;
    const [showActionsMenu, setShowActionsMenu] = useState(false);

    const embedUrl = videoUrl ? getYoutubeEmbedUrl(videoUrl) : "";

    const handleEdit = () => {
        if (weekId && onEdit) {
            onEdit(weekId);
        }
        setShowActionsMenu(false);
    };

    const handleDelete = () => {
        if (weekId && onDelete) {
            onDelete(weekId);
        }
        setShowActionsMenu(false);
    };

    const handleCreateAssignment = () => {
        if (weekId && onCreateAssignment) {
            onCreateAssignment(weekId);
        }
    };

    const handleEditAssignment = () => {
        if (weekId && onEditAssignment) {
            onEditAssignment(weekId);
        }
    };

    const handleDeleteAssignment = () => {
        if (weekId && onDeleteAssignment) {
            onDeleteAssignment(weekId);
        }
    };

    return (
        <ThemedView style={{ borderRadius: 15, marginBottom: 16 }} isCard>
            <WeeklySectionActionsMenu
                visible={showActionsMenu}
                onClose={() => setShowActionsMenu(false)}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <View style={{ position: 'relative' }}>
                <LinearGradient
                    colors={["#BE1BB6", "#1ECEFF"]}
                    style={{
                        height: 30,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />

                {/* Ellipsis Menu Button */}
                {weekId && onEdit && onDelete && (
                    <TouchableOpacity
                        style={styles.ellipsisButton}
                        onPress={() => setShowActionsMenu(true)}
                    >
                        <Ionicons
                            name="ellipsis-horizontal"
                            size={14}
                            color={Colors[theme].background}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <View style={{ padding: 16 }}>
                <View>
                    <ThemedText type="subtitle">
                        {count ? `Week ${count}` : "Week"}
                    </ThemedText>
                    <ThemedText type="defaultSemiBold">{title}</ThemedText>
                </View>

                <View
                    style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}
                >
                    <ThemedText
                        type="default"
                        style={{ flexShrink: 1, flex: 1 }}
                        numberOfLines={2}
                    >
                        {description}
                    </ThemedText>
                </View>

                {/* Video Section */}
                {videoUrl && (
                    <View style={styles.videoContainer}>
                        <WebView
                            style={[styles.webview, { height: videoHeight }]}
                            source={{ uri: embedUrl }}
                            allowsFullscreenVideo
                            javaScriptEnabled
                        />
                    </View>
                )}

                {/* Attachment Section */}
                {attachment && (
                    <View style={styles.attachmentContainer}>
                        <ThemedText type="subtitle">
                            Attachment
                        </ThemedText>
                        <AttachmentCard
                            name={attachment.name}
                            url={attachment.url}
                        />
                    </View>
                )}

                {/* Assignment Section */}
                {assignment ? (
                    <View style={styles.assignmentContainer}>
                        <ThemedText type="subtitle">
                            Assignment
                        </ThemedText>
                        <AssignmentCard
                            title={assignment.title}
                            dueDate={assignment.dueDate}
                            onPress={() => {
                                router.push(`/(assignment)/${assignment.id}/(tabs)`);
                            }}
                            onEdit={handleEditAssignment}
                            onDelete={handleDeleteAssignment}
                            showActions={true}
                        />
                    </View>
                ) : (
                    <View style={styles.assignmentContainer}>
                        <Button
                            type="secondary"
                            onPress={handleCreateAssignment}
                            icon={{ name: "plus.circle.fill" }}
                        >
                            Create Assignment
                        </Button>
                    </View>
                )}
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    ellipsisButton: {
        position: 'absolute',
        top: 5,
        right: 12,
        zIndex: 2,
        padding: 5,
    },
    videoContainer: {
        marginTop: 8,
        borderRadius: 8,
        overflow: "hidden",
    },
    webview: {
        width: "100%",
    },
    videoPlaceholder: {
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    playText: {
        fontSize: 16,
    },
    attachmentContainer: {
        paddingVertical: 8,
    },
    assignmentContainer: {
        paddingVertical: 8,
    },
    attachmentLabel: {
        color: "#007AFF",
    },
});