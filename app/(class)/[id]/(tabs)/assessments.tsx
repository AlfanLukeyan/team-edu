import { AssessmentCard } from '@/components/AssesmentCard';
import { Button } from '@/components/Button';
import CreateAssessmentBottomSheet, { CreateAssessmentBottomSheetRef } from '@/components/teacher/CreateAssessmentBottomSheet';
import CreateQuestionsBottomSheet, { CreateQuestionsBottomSheetRef } from '@/components/teacher/CreateQuestionsBottomSheet';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useClass } from '@/contexts/ClassContext';
import { classService } from '@/services/classService';
import { Assessment } from '@/types/api';
import { AssessmentFormData, QuestionsFormData } from '@/types/common';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet } from "react-native";

function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const AssessmentsScreen = () => {
    const { classId } = useClass();
    const router = useRouter();
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createAssessmentRef = useRef<CreateAssessmentBottomSheetRef>(null);
    const createQuestionsRef = useRef<CreateQuestionsBottomSheetRef>(null);
    const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null);

    const fetchAssessments = async () => {
        if (!classId) {
            setLoading(false);
            return;
        }
        
        try {
            setError(null);
            const data = await classService.getClassAssessments(classId);
            setAssessments(data);
        } catch (err) {
            setError('Failed to load assessments');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAssessments();
        setRefreshing(false);
    };

    const handleOpenAssessmentSheet = useCallback(() => createAssessmentRef.current?.open(), []);

    const handleCreateAssessment = useCallback((data: AssessmentFormData) => {
        const newAssessmentId = `assessment_${Date.now()}`;
        setCurrentAssessmentId(newAssessmentId);
        createQuestionsRef.current?.open();
    }, []);

    const handleCreateQuestions = useCallback((data: QuestionsFormData) => {
        setCurrentAssessmentId(null);
        handleRefresh();
    }, []);

    useEffect(() => {
        if (classId) {
            fetchAssessments();
        }
    }, [classId]);

    if (loading) {
        return (
            <ThemedView style={styles.centered}>
                <ActivityIndicator size="large" />
                <ThemedText style={styles.loadingText}>Loading assessments...</ThemedText>
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
                    <Button onPress={handleOpenAssessmentSheet}>
                        Create Assessment
                    </Button>

                    {assessments.length === 0 ? (
                        <ThemedView style={styles.emptyState}>
                            <ThemedText style={styles.emptyText}>
                                No assessments available yet
                            </ThemedText>
                        </ThemedView>
                    ) : (
                        assessments.map((assessment) => (
                            <AssessmentCard
                                key={assessment.id}
                                title={assessment.name}
                                startDate={formatDate(assessment.start_time)}
                                endDate={formatDate(assessment.end_time)}
                                onPress={() => router.push(`/(assessment)/${assessment.id}/(tabs)`)}
                            />
                        ))
                    )}
                </ScrollView>
            </ThemedView>
            <CreateAssessmentBottomSheet
                ref={createAssessmentRef}
                onSubmit={handleCreateAssessment}
            />
            <CreateQuestionsBottomSheet
                ref={createQuestionsRef}
                onSubmit={handleCreateQuestions}
                assessmentId={currentAssessmentId || undefined}
            />
        </>
    )
}

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

export default AssessmentsScreen;