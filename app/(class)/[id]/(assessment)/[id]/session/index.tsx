import { Button } from '@/components/Button';
import ErrorModal from '@/components/ErrorModal';
import { QuestionSavedCountCard } from '@/components/QuestionSavedCountCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TimeRemainingCard } from '@/components/TimeRemainingCard';
import { Colors } from '@/constants/Colors';
import { useAssessment } from '@/contexts/AssessmentContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { assessmentService } from '@/services/assessmentService';
import { ModalEmitter } from '@/services/modalEmitter';
import { AssessmentQuestion, AssessmentSessionResponse } from '@/types/api';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AssessmentSessionScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const theme = useColorScheme() || 'light';
    const { assessmentInfo } = useAssessment();

    const [sessionData, setSessionData] = useState<AssessmentSessionResponse | null>(null);
    const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
    const [answerIds, setAnswerIds] = useState<{ [key: string]: string }>({});
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [showTimeUpModal, setShowTimeUpModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeSession = async () => {
            if (!id || !assessmentInfo) return;

            try {
                setLoading(true);
                setError(null);

                if (assessmentInfo.submission_status === 'in_progress' && assessmentInfo.submission_id) {
                    const questionsResponse = await assessmentService.getAssessmentQuestions(id);
                    setQuestions(questionsResponse);

                    const existingSessionData: AssessmentSessionResponse = {
                        assessment_id: id,
                        submission_id: assessmentInfo.submission_id,
                        user_id: '',
                        ended_time: '',
                        question: questionsResponse
                    };
                    setSessionData(existingSessionData);

                    const existingAnswers = await assessmentService.getSubmissionAnswers(assessmentInfo.submission_id);
                    const answersMap: { [key: string]: string } = {};
                    const answerIdsMap: { [key: string]: string } = {};

                    existingAnswers.forEach(answer => {
                        answersMap[answer.question_id] = answer.choice_id;
                        answerIdsMap[answer.question_id] = answer.answer_id;
                    });

                    setSelectedAnswers(answersMap);
                    setAnswerIds(answerIdsMap);

                } else {
                    const sessionResponse = await assessmentService.startAssessmentSession(id);
                    setSessionData(sessionResponse);

                    if (sessionResponse.question && Array.isArray(sessionResponse.question)) {
                        setQuestions(sessionResponse.question);
                    } else {
                        throw new Error('No questions found in session response');
                    }
                }

                if (assessmentInfo.time_remaining) {
                    setTimeRemaining(assessmentInfo.time_remaining);
                } else {
                    const durationInSeconds = assessmentInfo.duration * 60;
                    setTimeRemaining(durationInSeconds);
                }

                setHasStarted(true);

            } catch (error) {
                setError(
                    `Failed to start assessment session: ${error instanceof Error ? error.message : String(error)
                    }`
                );
            } finally {
                setLoading(false);
            }
        };

        initializeSession();
    }, [id, assessmentInfo]);

    useEffect(() => {
        if (hasStarted && timeRemaining !== null && timeRemaining > 0) {
            const timer = setTimeout(() => {
                setTimeRemaining(prev => prev! - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (hasStarted && timeRemaining === 0) {
            handleAutoSubmit();
        }
    }, [timeRemaining, hasStarted]);

    const handleAnswerSelect = async (choiceId: string) => {
        const currentQuestion = questions[currentQuestionIndex];
        const existingAnswerId = answerIds[currentQuestion.question_id];

        try {
            // ✅ Optimistically update UI first
            setSelectedAnswers(prev => ({
                ...prev,
                [currentQuestion.question_id]: choiceId
            }));

            if (sessionData?.submission_id) {
                if (existingAnswerId) {
                    // ✅ Update existing answer
                    console.log('🔄 Updating existing answer:', {
                        answerId: existingAnswerId,
                        questionId: currentQuestion.question_id,
                        choiceId
                    });
                    
                    await assessmentService.updateAnswer(
                        existingAnswerId,
                        sessionData.submission_id,
                        currentQuestion.question_id,
                        choiceId
                    );
                    
                    console.log('✅ Answer updated successfully');
                } else {
                    // ✅ Create new answer and store the answer_id
                    console.log('➕ Creating new answer:', {
                        submissionId: sessionData.submission_id,
                        questionId: currentQuestion.question_id,
                        choiceId
                    });
                    
                    const newAnswer = await assessmentService.submitAnswer(
                        sessionData.submission_id,
                        currentQuestion.question_id,
                        choiceId
                    );
                    
                    // ✅ Store the answer_id for future updates
                    setAnswerIds(prev => ({
                        ...prev,
                        [currentQuestion.question_id]: newAnswer.answer_id
                    }));
                    
                    console.log('✅ New answer created:', {
                        answerId: newAnswer.answer_id,
                        questionId: currentQuestion.question_id
                    });
                }
            }
        } catch (error) {
            console.error('❌ Failed to save answer:', error);
            
            // ✅ Revert optimistic update on error
            setSelectedAnswers(prev => {
                const updated = { ...prev };
                delete updated[currentQuestion.question_id];
                return updated;
            });
            
            ModalEmitter.showError('Failed to save answer. Please try again.');
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleAutoSubmit = async () => {
        if (!sessionData?.submission_id) return;

        try {
            await assessmentService.submitAssessment(sessionData.submission_id);
            setShowTimeUpModal(true);
        } catch (error) {
            setShowTimeUpModal(true);
        }
    };

    const handleTimeUpModalClose = () => {
        setShowTimeUpModal(false);
        router.back();
    };

    const handleSubmitAssessment = () => {
        ModalEmitter.showAlert({
            title: 'Submit Assessment',
            message: 'Are you sure you want to submit your assessment?',
            confirmText: 'Submit',
            cancelText: 'Cancel',
            type: 'warning',
            onConfirm: async () => {
                if (!sessionData?.submission_id) return;

                try {
                    setSubmitting(true);
                    ModalEmitter.showLoading('Submitting assessment...');

                    await assessmentService.submitAssessment(sessionData.submission_id);

                    ModalEmitter.hideLoading();
                    ModalEmitter.showSuccess('Your assessment has been submitted successfully.');

                    setTimeout(() => {
                        router.back();
                    }, 1500);
                } catch (error) {
                    ModalEmitter.hideLoading();
                    ModalEmitter.showError('Failed to submit assessment. Please try again.');
                } finally {
                    setSubmitting(false);
                }
            },
            onCancel: () => {
            }
        });
    };

    const getSavedCount = () => {
        return Object.keys(selectedAnswers).length;
    };

    if (loading) {
        return (
            <ThemedView style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={Colors[theme].tint} />
                <ThemedText style={{ marginTop: 16 }}>
                    {assessmentInfo?.submission_status === 'in_progress'
                        ? 'Loading your progress...'
                        : 'Starting assessment...'}
                </ThemedText>
            </ThemedView>
        );
    }

    if (error || !sessionData || questions.length === 0) {
        return (
            <ThemedView style={[styles.container, styles.loadingContainer]}>
                <ThemedText style={{ textAlign: 'center', marginBottom: 16 }}>
                    {error || 'Failed to load assessment'}
                </ThemedText>
                <Button onPress={() => router.back()}>
                    Go Back
                </Button>
            </ThemedView>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.headerCards}>
                    <View style={{ flex: 1 }}>
                        <TimeRemainingCard timeRemaining={timeRemaining || 0} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <QuestionSavedCountCard
                            savedCount={getSavedCount()}
                            totalCount={questions.length}
                        />
                    </View>
                </View>

                <View style={styles.questionContainer}>
                    <ThemedText type='defaultSemiBold' style={styles.questionText}>
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </ThemedText>
                    <ThemedText type='defaultSemiBold' style={styles.questionText}>
                        {currentQuestion.question_text}
                    </ThemedText>

                    <View style={styles.choicesContainer}>
                        {currentQuestion.choice.map((choice) => {
                            const isSelected = selectedAnswers[currentQuestion.question_id] === choice.choice_id;

                            return (
                                <TouchableOpacity
                                    key={choice.choice_id}
                                    style={styles.choiceButton}
                                    onPress={() => handleAnswerSelect(choice.choice_id)}
                                >
                                    <ThemedView isCard={true} style={styles.choiceCard}>
                                        <View style={styles.choiceContent}>
                                            <Ionicons
                                                name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                                                size={24}
                                                color={isSelected ? "green" : Colors[theme].icon}
                                            />
                                            <ThemedText type="default" style={styles.choiceText}>
                                                {choice.choice_text}
                                            </ThemedText>
                                        </View>
                                    </ThemedView>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.navigationContainer}>
                <Button
                    type="secondary"
                    onPress={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    style={[
                        styles.navButton,
                        currentQuestionIndex === 0 && styles.disabledButton
                    ]}
                >
                    Previous
                </Button>

                {currentQuestionIndex === questions.length - 1 ? (
                    <Button
                        onPress={handleSubmitAssessment}
                        style={styles.navButton}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </Button>
                ) : (
                    <Button
                        onPress={handleNextQuestion}
                        style={styles.navButton}
                    >
                        Next
                    </Button>
                )}
            </View>

            <ErrorModal
                visible={showTimeUpModal}
                errorMessage="Time's up! Your assessment has been automatically submitted."
                onClose={handleTimeUpModalClose}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        padding: 20,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    headerCards: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    questionContainer: {
        marginBottom: 24,
    },
    questionText: {
        marginBottom: 24,
    },
    choicesContainer: {
        gap: 12,
    },
    choiceButton: {
        borderRadius: 15,
    },
    choiceCard: {
        borderRadius: 15,
        padding: 16,
    },
    choiceContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    choiceText: {
        flex: 1,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    navButton: {
        flex: 1,
    },
    disabledButton: {
        opacity: 0.5,
    },
});