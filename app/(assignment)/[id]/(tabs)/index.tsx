import { AttachmentCard } from "@/components/AttachmentCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { response } from "@/data/response";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const AboutAssignmentScreen = () => {
    const params = useLocalSearchParams();
    const assignmentId = params.id as string;
    const router = useRouter();
    const theme = useColorScheme() ?? 'light';

    useEffect(() => {
        console.log('AboutAssignmentScreen mounted with params:', params);
    }, [params]);

    const assignment = response.getAllAssignments.data.find(
        (item) => item.id === assignmentId
    );

    if (!assignment) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>Assignment not found</ThemedText>
            </ThemedView>
        );
    }

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const dueDateInfo = formatDateTime(assignment.due_date);

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <View style={styles.assignmentHeader}>
                        <ThemedText type="title">{assignment.title}</ThemedText>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <IconSymbol
                                name="calendar.badge.checkmark"
                                size={20}
                                color={Colors[theme].icon}
                            />
                            <ThemedText style={{ paddingLeft: 8, fontSize: 14 }} type="defaultSemiBold">Due Date </ThemedText>
                            <ThemedText>{dueDateInfo}</ThemedText>
                        </View>
                        <ThemedText type="default">
                            {assignment.description}
                        </ThemedText>
                        <AttachmentCard
                            name={assignment.attachment.file_name}
                            url={assignment.attachment.file_url}
                        />
                    </View>

                </View>
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        borderRadius: 15,
        margin: 16,
    },
    assignmentHeader: {
        gap: 8,
    },
    sectionTitle: {
        marginBottom: 8,
    },
    dueDateContainer: {
        marginTop: 8,
    },
    dueDateCard: {
        padding: 16,
    },
    dueDateContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    attachmentContainer: {
        marginTop: 8,
    },
    attachmentCard: {
        padding: 16,
    },
    attachmentContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusCardsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
});

export default AboutAssignmentScreen;