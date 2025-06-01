import { AttachmentCard } from "@/components/AttachmentCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useAssignment } from "@/contexts/AssignmentContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { formatDateTime } from "@/utils/utils";
import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from "react-native";

export default function AboutAssignmentScreen() {
    const theme = useColorScheme() ?? 'light';
    const { assignmentInfo, loading, error, refetchAssignmentInfo } = useAssignment();

    const handleRefresh = useCallback(async () => {
        await refetchAssignmentInfo();
    }, [refetchAssignmentInfo]);

    useEffect(() => {
        refetchAssignmentInfo();
    }, [refetchAssignmentInfo]);

    if (loading) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={Colors[theme].tint} />
                <ThemedText style={{ marginTop: 16 }}>Loading assignment...</ThemedText>
            </ThemedView>
        );
    }

    if (error || !assignmentInfo) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ThemedText style={{ textAlign: 'center', marginBottom: 16 }}>
                    {error || 'Assignment not found'}
                </ThemedText>
                <ThemedText
                    style={{ color: Colors[theme].tint, textAlign: 'center' }}
                    onPress={refetchAssignmentInfo}
                >
                    Tap to retry
                </ThemedText>
            </ThemedView>
        );
    }

    const dueDateInfo = formatDateTime(assignmentInfo.deadline);

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={handleRefresh}
                        colors={[Colors[theme].tint]}
                        tintColor={Colors[theme].tint}
                    />
                }
            >
                <View style={styles.content}>
                    <ThemedText type="title">{assignmentInfo.title}</ThemedText>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <IconSymbol
                            name="calendar.badge.checkmark"
                            size={20}
                            color={Colors[theme].icon}
                        />
                        <ThemedText style={{ paddingLeft: 8, fontSize: 14 }} type="defaultSemiBold">
                            Due Date
                        </ThemedText>
                        <ThemedText>{dueDateInfo.date} at {dueDateInfo.time}</ThemedText>
                    </View>

                    <ThemedText type="default">
                        {assignmentInfo.description}
                    </ThemedText>

                    {assignmentInfo.file_url && (
                        <AttachmentCard
                            name={assignmentInfo.file_name}
                            url={assignmentInfo.file_url}
                        />
                    )}
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    scrollView: {
        flex: 1,
        borderRadius: 15,
        margin: 16,
    },
    content: {
        gap: 14,
    },
});