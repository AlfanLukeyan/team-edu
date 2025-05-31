import { AssignmentCard } from "@/components/AssignmentCard";
import { AttachmentCard } from "@/components/AttachmentCard";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getYoutubeEmbedUrl } from "@/utils/utils";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
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
}

export function WeeklyCard({
    count,
    title,
    description,
    videoUrl,
    attachment,
    assignment
}: WeeklyCardProps) {
    const router = useRouter();
    const theme = useColorScheme() ?? "light";
    const screenWidth = Dimensions.get("window").width;
    const videoHeight = screenWidth * 0.5625;

    const embedUrl = videoUrl ? getYoutubeEmbedUrl(videoUrl) : "";

    return (
        <ThemedView style={{ borderRadius: 15, marginBottom: 16 }} isCard>
            <View
                style={{
                    zIndex: 2,
                    position: "absolute",
                    margin: 18,
                    right: 0,
                }}
            ></View>
            <LinearGradient
                colors={["#BE1BB6", "#1ECEFF"]}
                style={{
                    height: 30,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            ></LinearGradient>

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
                {assignment && (
                    <View style={styles.attachmentContainer}>
                        <ThemedText type="subtitle">
                            Assignment
                        </ThemedText>
                        <AssignmentCard
                            title={assignment.title}
                            dueDate={assignment.dueDate}
                            onPress={() => {
                                router.push({
                                    pathname: "/(assignment)/(tabs)",
                                    params: { id: assignment.id },
                                });
                            }}
                        />
                    </View>
                )}
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
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
    attachmentLabel: {
        color: "#007AFF",
    },
});
