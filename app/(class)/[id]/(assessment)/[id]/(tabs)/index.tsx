import { AnsweredQuestionsCard } from "@/components/AnsweredQuestionsCard";
import { ButtonWithDescription } from "@/components/ButtonWithDescription";
import { CompletedCountCard } from "@/components/CompletedCountCard";
import { DueDateCard } from "@/components/DueDateCard";
import { DurationCard } from "@/components/DurationCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TimeRemainingCard } from "@/components/TimeRemainingCard";
import { Colors } from "@/constants/Colors";
import { useAssessment } from "@/contexts/AssessmentContext";
import { useClass } from "@/contexts/ClassContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useUserRole } from "@/hooks/useUserRole";
import { convertMinutesToSeconds, formatDateTime } from "@/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from "react-native";

export default function AboutAssessmentScreen() {
    const router = useRouter();
    const { classId } = useClass();
    const theme = useColorScheme() ?? 'light';
    const { assessmentInfo, loading, error, refetchAssessmentInfo } = useAssessment();
    const { isStudent } = useUserRole();

    const handleRefresh = useCallback(async () => {
        await refetchAssessmentInfo();
    }, [refetchAssessmentInfo]);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'submitted':
                return { color: '#4CAF50', text: 'Completed', icon: 'checkmark-circle' as const };
            case 'in_progress':
                return { color: '#FF9800', text: 'In Progress', icon: 'time' as const };
            case 'todo':
                return { color: '#F44336', text: 'Not Started', icon: 'alert-circle' as const };
            default:
                return { color: '#9E9E9E', text: 'Unknown', icon: 'help-circle' as const };
        }
    };

    const getButtonText = () => {
        if (isStudent() && assessmentInfo?.submission_status) {
            switch (assessmentInfo.submission_status) {
                case 'submitted':
                    return 'View Results';
                case 'in_progress':
                    return 'Continue';
                case 'todo':
                default:
                    return 'Start';
            }
        }
        return 'Start';
    };

    const getButtonDescription = () => {
        if (isStudent() && assessmentInfo?.submission_status === 'submitted') {
            return `Assessment completed. Score: ${assessmentInfo.score || 0}/${assessmentInfo.max_score || 100}`;
        }
        return "Please ensure that you are prepared to take the assessment.";
    };

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

    const startDateTime = formatDateTime(assessmentInfo.start_time);
    const endDateTime = formatDateTime(assessmentInfo.end_time);
    const durationInSeconds = convertMinutesToSeconds(assessmentInfo.duration);

    const statusInfo = isStudent() && assessmentInfo?.submission_status
        ? getStatusInfo(assessmentInfo.submission_status)
        : null;

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
                    <ThemedText type="title" style={styles.assessmentTitle}>
                        {assessmentInfo.name}
                    </ThemedText>

                    {statusInfo && (
                        <View style={styles.statusContainer}>
                            <Ionicons
                                name={statusInfo.icon}
                                size={16}
                                color={statusInfo.color}
                            />
                            <ThemedText style={[styles.statusText, { color: statusInfo.color }]}>
                                {statusInfo.text}
                            </ThemedText>
                        </View>
                    )}

                    <View style={styles.cardsRow}>
                        <DueDateCard
                            startTime={startDateTime.time}
                            startDate={startDateTime.date}
                            endTime={endDateTime.time}
                            endDate={endDateTime.date}
                            style={{ flex: 1 }}
                        />

                        {isStudent() ? (
                            <AnsweredQuestionsCard
                                answeredCount={assessmentInfo.submitted_answer || 0}
                                totalQuestions={assessmentInfo.question || 0}
                                style={{ flex: 1 }}
                            />
                        ) : (
                            <CompletedCountCard
                                completedCount={assessmentInfo.total_submission || 0}
                                totalCount={assessmentInfo.total_student || 0}
                                style={{ flex: 1 }}
                            />
                        )}
                    </View>

                    <DurationCard
                        duration={assessmentInfo.duration}
                    />
                    <TimeRemainingCard
                        timeRemaining={durationInSeconds}
                    />

                    {isStudent() && (
                        <ButtonWithDescription
                            onPress={() => {
                                router.push(`/(class)/${classId}/(assessment)/${assessmentInfo.id}/session`);
                            }}
                            description={getButtonDescription()}
                            disabled={assessmentInfo.submission_status === 'submitted'}
                        >
                            {getButtonText()}
                        </ButtonWithDescription>
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
    cardsRow: {
        flexDirection: "row",
        gap: 12,
    },
    assessmentTitle: {
        textAlign: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: -8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
