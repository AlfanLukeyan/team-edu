import AssessmentActionsMenu from '@/components/AssessmentActionsMenu';
import { AssessmentCard } from '@/components/AssessmentCard';
import { Button } from '@/components/Button';
import AssessmentBottomSheet, { AssessmentBottomSheetRef } from '@/components/teacher/AssessmentBottomSheet';
import QuestionBottomSheet, { QuestionBottomSheetRef } from '@/components/teacher/QuestionBottomSheet';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useClass } from '@/contexts/ClassContext';
import { useHeader } from '@/contexts/HeaderContext'; // ✅ Add this import
import { assessmentService } from '@/services/assessmentService';
import { classService } from '@/services/classService';
import { ModalEmitter } from '@/services/modalEmitter';
import { Assessment, CreateQuestionItem } from '@/types/api';
import { AssessmentFormData } from '@/types/common';
import { formatDate } from '@/utils/utils';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface QuestionsFormData {
    questions: CreateQuestionItem[];
}

const AssessmentsScreen = () => {
    const { classId } = useClass();
    const router = useRouter();
    const { setHeaderConfig, resetHeader } = useHeader(); // ✅ Use header context
    const theme = useColorScheme();

    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [selectedAssessmentIds, setSelectedAssessmentIds] = useState<string[]>([]);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const assessmentBottomSheetRef = useRef<AssessmentBottomSheetRef>(null);
    const questionBottomSheetRef = useRef<QuestionBottomSheetRef>(null);
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

    const handleOpenAssessmentSheet = useCallback(() => assessmentBottomSheetRef.current?.open(), []);

    const handleCreateOrUpdateAssessment = useCallback(async (data: AssessmentFormData, assessmentId?: string) => {
        if (!classId) {
            ModalEmitter.showError('Class ID not found');
            return;
        }

        assessmentBottomSheetRef.current?.close();

        try {
            let response;
            if (assessmentId) {
                const updatedAssessment = {
                    ...assessments.find(a => a.assessment_id === assessmentId)!,
                    name: data.title,
                    description: data.description,
                    duration: parseInt(data.duration) * 60,
                    start_time: data.start_date,
                    end_time: data.end_date,
                    updated_at: new Date().toISOString()
                };

                setAssessments(prev =>
                    prev.map(assessment =>
                        assessment.assessment_id === assessmentId ? updatedAssessment : assessment
                    )
                );

                response = await assessmentService.updateAssessment(assessmentId, data);
                await fetchAssessments();
                ModalEmitter.showSuccess('Assessment updated successfully');
            } else {
                response = await assessmentService.createAssessment(classId, data);
                setCurrentAssessmentId(response.data.assessment_id);
                ModalEmitter.showSuccess('Assessment created successfully');
                questionBottomSheetRef.current?.open();
            }
        } catch (error) {
            if (assessmentId) {
                await fetchAssessments();
            }
        }
    }, [classId, assessments]);

    const handleCreateQuestions = useCallback(async (data: QuestionsFormData) => {
        if (!currentAssessmentId) {
            ModalEmitter.showError('Assessment ID not found');
            return;
        }

        try {
            await assessmentService.createQuestions(currentAssessmentId, data);
            setCurrentAssessmentId(null);
            await handleRefresh();
        } catch (error) {
            console.error('Failed to create questions:', error);
        }
    }, [currentAssessmentId]);

    // ✅ Memoize the header component
    const headerRightComponent = useMemo(() => {
        if (selectedAssessmentIds.length === 0) return null;

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity
                    onPress={() => setSelectedAssessmentIds([])}
                    style={{ padding: 8 }}
                >
                    <Text style={{ color: Colors[theme ?? 'light'].tint }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setShowActionsMenu(!showActionsMenu)}
                    style={{ padding: 8 }}
                >
                    <Ionicons
                        name="ellipsis-vertical"
                        size={20}
                        color={Colors[theme ?? 'light'].tint}
                    />
                </TouchableOpacity>
            </View>
        );
    }, [selectedAssessmentIds.length, showActionsMenu, theme]);

    // ✅ Use header context instead of navigation.setOptions
    useEffect(() => {
        if (selectedAssessmentIds.length > 0) {
            setHeaderConfig({
                title: `${selectedAssessmentIds.length} selected`,
                rightComponent: headerRightComponent
            });
        } else {
            resetHeader();
        }
    }, [selectedAssessmentIds.length, headerRightComponent, setHeaderConfig, resetHeader]);

    // Selection handlers
    const handleAssessmentLongPress = (id: string) => {
        setSelectedAssessmentIds([id]);
        setShowActionsMenu(false);
    };

    const handleAssessmentPress = (id: string) => {
        if (selectedAssessmentIds.length > 0) {
            if (selectedAssessmentIds.includes(id)) {
                setSelectedAssessmentIds(selectedAssessmentIds.filter(assessmentId => assessmentId !== id));
            } else {
                setSelectedAssessmentIds([...selectedAssessmentIds, id]);
            }
            setShowActionsMenu(false);
        } else {
            router.push(`/(class)/${classId}/(assessment)/${id}/(tabs)`);
        }
    };

    const handleSelectAllAssessments = () => {
        const allAssessmentIds = assessments.map(assessment => assessment.assessment_id);
        setSelectedAssessmentIds(allAssessmentIds);
        setShowActionsMenu(false);
    };

    const handleEditAssessments = () => {
        if (selectedAssessmentIds.length === 1) {
            const assessment = assessments.find(a => a.assessment_id === selectedAssessmentIds[0]);
            if (assessment) {
                assessmentBottomSheetRef.current?.openForEdit(assessment);
            }
        }
        setSelectedAssessmentIds([]);
        setShowActionsMenu(false);
    };

    const handleDeleteAssessments = () => {
        ModalEmitter.showAlert({
            title: "Delete Assessments",
            message: `Are you sure you want to delete the ${selectedAssessmentIds.length} selected assessment(s)?`,
            confirmText: "Delete",
            cancelText: "Cancel",
            type: "danger",
            onConfirm: async () => {
                try {
                    ModalEmitter.showLoading("Deleting assessments...");

                    await assessmentService.deleteMultipleAssessments(selectedAssessmentIds);

                    setAssessments(assessments.filter(assessment =>
                        !selectedAssessmentIds.includes(assessment.assessment_id)
                    ));
                    setSelectedAssessmentIds([]);
                    setShowActionsMenu(false);

                    ModalEmitter.hideLoading();
                    ModalEmitter.showSuccess(`Successfully deleted ${selectedAssessmentIds.length} assessment(s)`);
                } catch (error) {
                    ModalEmitter.hideLoading();
                    console.error('Failed to delete assessments:', error);
                    await handleRefresh();
                }
            },
        });
    };

    // ✅ Clean up with header context instead of navigation
    useFocusEffect(
        useCallback(() => {
            return () => {
                setSelectedAssessmentIds([]);
                setShowActionsMenu(false);
                resetHeader(); // ✅ Use resetHeader instead of navigation.setOptions
            };
        }, [resetHeader])
    );

    // ✅ Remove the old useLayoutEffect completely

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
                <AssessmentActionsMenu
                    visible={showActionsMenu && selectedAssessmentIds.length > 0}
                    onClose={() => setShowActionsMenu(false)}
                    onDelete={handleDeleteAssessments}
                    onEdit={handleEditAssessments}
                    onSelectAll={handleSelectAllAssessments}
                    selectedCount={selectedAssessmentIds.length}
                />

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
                                key={assessment.assessment_id}
                                title={assessment.name}
                                startDate={formatDate(assessment.start_time)}
                                endDate={formatDate(assessment.end_time)}
                                isSelected={selectedAssessmentIds.includes(assessment.assessment_id)}
                                onPress={() => handleAssessmentPress(assessment.assessment_id)}
                                onLongPress={() => handleAssessmentLongPress(assessment.assessment_id)}
                            />
                        ))
                    )}
                </ScrollView>
            </ThemedView>
            <AssessmentBottomSheet
                ref={assessmentBottomSheetRef}
                onSubmit={handleCreateOrUpdateAssessment}
            />
            <QuestionBottomSheet
                ref={questionBottomSheetRef}
                onSubmit={handleCreateQuestions}
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
        gap: 8,
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