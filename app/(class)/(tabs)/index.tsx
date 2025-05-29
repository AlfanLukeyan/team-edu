import { Button } from "@/components/Button";
import CreateWeeklySectionBottomSheet, {
    CreateWeeklySectionBottomSheetRef,
} from "@/components/teacher/CreateWeeklySectionBottomSheet";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { WeeklyCard } from "@/components/WeeklyCard";
import { useClassDetail } from "@/hooks/useClassDetail";
import { WeeklySectionFormData } from "@/types/common";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet } from "react-native";

const WeeklyScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { 
        classDetail, 
        loading, 
        refreshing, 
        error, 
        refreshClassDetail, 
        getAllWeeks 
    } = useClassDetail(id);
    
    const createSectionRef = useRef<CreateWeeklySectionBottomSheetRef>(null);

    const handleOpenWeeklySheet = useCallback(() => createSectionRef.current?.open(), []);
    
    const handleCreateSection = useCallback((data: WeeklySectionFormData) => {
        console.log("New section created:", data);
        // TODO: Add API call to create weekly section
        // After successful creation, refresh the data
        refreshClassDetail();
    }, [refreshClassDetail]);

    if (loading) {
        return (
            <ThemedView style={styles.centered}>
                <ActivityIndicator size="large" />
                <ThemedText style={styles.loadingText}>Loading weekly content...</ThemedText>
            </ThemedView>
        );
    }

    if (error || !classDetail) {
        return (
            <ThemedView style={styles.centered}>
                <ThemedText style={styles.errorText}>
                    {error || 'Failed to load class details'}
                </ThemedText>
            </ThemedView>
        );
    }

    const weeks = getAllWeeks();

    return (
        <>
            <ThemedView style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refreshClassDetail}
                        />
                    }
                >
                    <Button onPress={handleOpenWeeklySheet}>Create Weekly Section</Button>

                    {weeks.length === 0 ? (
                        <ThemedView style={styles.emptyState}>
                            <ThemedText style={styles.emptyText}>
                                No weekly content available yet
                            </ThemedText>
                        </ThemedView>
                    ) : (
                        weeks.map((week) => (
                            <WeeklyCard
                                key={week.id}
                                count={week.week_number}
                                title={week.item_pembelajaran?.headingPertemuan || `Week ${week.week_number}`}
                                description={week.item_pembelajaran?.bodyPertemuan || 'No description available'}
                                videoUrl={week.item_pembelajaran?.urlVideo}
                                attachment={week.item_pembelajaran?.file_link ? {
                                    name: week.item_pembelajaran.fileName || 'Download File',
                                    url: week.item_pembelajaran.file_link,
                                } : undefined}
                                assignment={week.assignment ? {
                                    id: week.assignment.ID.toString(),
                                    title: week.assignment.title,
                                    dueDate: new Date(week.assignment.deadline).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }),
                                    description: week.assignment.description,
                                } : undefined}
                            />
                        ))
                    )}
                </ScrollView>
            </ThemedView>
            <CreateWeeklySectionBottomSheet
                ref={createSectionRef}
                onSubmit={handleCreateSection}
            />
        </>
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
    contentContainer: {
        gap: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    loadingText: {
        marginTop: 12,
        opacity: 0.7,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 20,
    },
    emptyText: {
        opacity: 0.7,
        textAlign: 'center',
    },
});

export default WeeklyScreen;