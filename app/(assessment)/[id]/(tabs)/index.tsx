import { ButtonWithDescription } from "@/components/ButtonWithDescription";
import { CompletedCountCard } from "@/components/CompletedCountCard";
import { DueDateCard } from "@/components/DueDateCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TimeRemainingCard } from "@/components/TimeRemainingCard";
import { Colors } from "@/constants/Colors";
import { useAssessment } from "@/contexts/AssessmentContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { assessmentService } from "@/services/assessmentService";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from "react-native";

export default function AboutAssessmentScreen() {
    const router = useRouter();
    const theme = useColorScheme() ?? 'light';
    const { assessmentInfo, loading, error, refetchAssessmentInfo } = useAssessment();

    const handleRefresh = useCallback(async () => {
        await refetchAssessmentInfo();
    }, [refetchAssessmentInfo]);

    if (loading) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={Colors[theme].tint} />
                <ThemedText style={{ marginTop: 16 }}>Loading assessment...</ThemedText>
            </ThemedView>
        );
    }

    if (error || !assessmentInfo) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ThemedText style={{ textAlign: 'center', marginBottom: 16 }}>
                    {error || 'Assessment not found'}
                </ThemedText>
                <ThemedText 
                    style={{ color: Colors[theme].tint, textAlign: 'center' }}
                    onPress={refetchAssessmentInfo}
                >
                    Tap to retry
                </ThemedText>
            </ThemedView>
        );
    }

    const startDateTime = assessmentService.formatDateTime(assessmentInfo.start_time);
    const endDateTime = assessmentService.formatDateTime(assessmentInfo.end_time);
    const durationInSeconds = assessmentService.convertMinutesToSeconds(assessmentInfo.duration);

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
                    <ThemedText type="title">{assessmentInfo.name}</ThemedText>
                    
                    <ThemedText type="default" style={styles.description}>
                        Duration: {assessmentInfo.duration} minutes
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
                            completedCount={assessmentInfo.total_submission} 
                            totalCount={assessmentInfo.total_student} 
                            style={{ flex: 1 }} 
                        />
                    </View>
                    
                    <TimeRemainingCard timeRemaining={durationInSeconds} />
                    
                    <ButtonWithDescription
                        onPress={() => {
                            router.push({
                                pathname: "/(assessment)/session",
                                params: { id: assessmentInfo.id },
                            });
                        }}
                        description="Please ensure that you are prepared to take the assessment."
                    >
                        Start
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