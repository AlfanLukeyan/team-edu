import { Button } from "@/components/Button";
import CreateWeeklySectionBottomSheet, {
    CreateWeeklySectionBottomSheetRef,
} from "@/components/teacher/CreateWeeklySectionBottomSheet";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { WeeklyCard } from "@/components/WeeklyCard";
import { useClass } from "@/contexts/ClassContext";
import { classService } from "@/services/classService";
import { WeeklySection } from "@/types/api";
import { WeeklySectionFormData } from "@/types/common";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet } from "react-native";

const WeeklyScreen = () => {
    const { classId } = useClass();
    const [weeklySections, setWeeklySections] = useState<WeeklySection[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const createSectionRef = useRef<CreateWeeklySectionBottomSheetRef>(null);

    const fetchWeeklySections = async () => {
        if (!classId) {
            console.log('WeeklyScreen: No classId available yet');
            return;
        }
        
        try {
            setError(null);
            console.log('WeeklyScreen: Fetching weekly sections for class ID:', classId);
            const data = await classService.getWeeklySections(classId);
            const sortedData = data.sort((a, b) => a.week_number - b.week_number);
            setWeeklySections(sortedData);
        } catch (err) {
            setError('Failed to load weekly sections');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchWeeklySections();
        setRefreshing(false);
    };

    const handleOpenWeeklySheet = useCallback(() => createSectionRef.current?.open(), []);
    
    const handleCreateSection = useCallback((data: WeeklySectionFormData) => {
        console.log("New section created:", data);
        // TODO: Add API call to create weekly section
        // After successful creation, refresh the data
        handleRefresh();
    }, []);

    useEffect(() => {
        if (classId) {
            fetchWeeklySections();
        }
    }, [classId]);

    if (loading) {
        return (
            <ThemedView style={styles.centered}>
                <ActivityIndicator size="large" />
                <ThemedText style={styles.loadingText}>Loading weekly content...</ThemedText>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={styles.centered}>
                <ThemedText style={styles.errorText}>
                    {error}
                </ThemedText>
            </ThemedView>
        );
    }

    return (
        <>
            <ThemedView style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                >
                    <Button onPress={handleOpenWeeklySheet}>Create Weekly Section</Button>

                    {weeklySections.length === 0 ? (
                        <ThemedView style={styles.emptyState}>
                            <ThemedText style={styles.emptyText}>
                                No weekly content available yet
                            </ThemedText>
                        </ThemedView>
                    ) : (
                        weeklySections.map((week) => (
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