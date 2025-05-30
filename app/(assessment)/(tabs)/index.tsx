import { ButtonWithDescription } from "@/components/ButtonWithDescription";
import { CompletedCountCard } from "@/components/CompletedCountCard";
import { DueDateCard } from "@/components/DueDateCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TimeRemainingCard } from "@/components/TimeRemainingCard";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { assessmentService } from "@/services/assessmentService";
import { AssessmentDetails } from "@/types/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from "react-native";

export default function AboutAssessmentScreen() {
    const params = useLocalSearchParams();
    const assessmentId = params.id as string;
    const router = useRouter();
    const theme = useColorScheme() ?? 'light';
    
    const [assessment, setAssessment] = useState<AssessmentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAssessmentDetails = useCallback(async () => {
        if (!assessmentId) {
            setError('Assessment ID is required');
            setLoading(false);
            return;
        }

        try {
            setError(null);
            const data = await assessmentService.getAssessmentDetails(assessmentId);
            setAssessment(data);
        } catch (error: any) {
            console.error('Failed to fetch assessment details:', error);
            setError(error.message || 'Failed to load assessment details');
        } finally {
            setLoading(false);
        }
    }, [assessmentId]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchAssessmentDetails();
        setRefreshing(false);
    }, [fetchAssessmentDetails]);

    useEffect(() => {
        console.log('AboutAssessmentScreen mounted with params:', params);
        fetchAssessmentDetails();
    }, [fetchAssessmentDetails]);

    if (loading) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={Colors[theme].tint} />
                <ThemedText style={{ marginTop: 16 }}>Loading assessment...</ThemedText>
            </ThemedView>
        );
    }

    if (error || !assessment) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ThemedText style={{ textAlign: 'center', marginBottom: 16 }}>
                    {error || 'Assessment not found'}
                </ThemedText>
                <ThemedText 
                    style={{ color: Colors[theme].tint, textAlign: 'center' }}
                    onPress={fetchAssessmentDetails}
                >
                    Tap to retry
                </ThemedText>
            </ThemedView>
        );
    }

    const startDateTime = assessmentService.formatDateTime(assessment.start_time);
    const endDateTime = assessmentService.formatDateTime(assessment.end_time);
    const durationInSeconds = assessmentService.convertMinutesToSeconds(assessment.duration);

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[Colors[theme].tint]}
                        tintColor={Colors[theme].tint}
                    />
                }
            >
                <View style={styles.content}>
                    <ThemedText type="title">{assessment.name}</ThemedText>
                    
                    <ThemedText type="default" style={styles.description}>
                        Duration: {assessment.duration} minutes
                    </ThemedText>
                    
                    <View style={styles.cardsRow}>
                        <DueDateCard
                            startTime={startDateTime.time}
                            startDate={startDateTime.date}
                            endTime={endDateTime.time}
                            endDate={endDateTime.date}
                            style={{ flex: 1 }}
                        />
                        <CompletedCountCard 
                            comletedCount={assessment.total_submission} 
                            totalCount={assessment.total_student} 
                            style={{ flex: 1 }} 
                        />
                    </View>
                    
                    <TimeRemainingCard timeRemaining={durationInSeconds} />
                    
                    <ButtonWithDescription
                        onPress={() => {
                            router.push({
                                pathname: "/(assessment)/session",
                                params: { id: assessment.id },
                            });
                        }}
                        description="Please ensure that you are prepared to take the assessment."
                    >
                        Start Assessment
                    </ButtonWithDescription>
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
    description: {
        opacity: 0.8,
    },
    cardsRow: {
        flexDirection: "row",
        gap: 12,
    },
});