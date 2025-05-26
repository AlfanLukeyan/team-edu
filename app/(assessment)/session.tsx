import { Button } from '@/components/Button';
import ErrorModal from '@/components/ErrorModal';
import { QuestionSavedCountCard } from '@/components/QuestionSavedCountCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TimeRemainingCard } from '@/components/TimeRemainingCard';
import { Colors } from '@/constants/Colors';
import { response } from '@/data/response';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AssessmentSessionScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const theme = useColorScheme() || 'light';

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [showTimeUpModal, setShowTimeUpModal] = useState(false);

    const assessment = response.getAllAssessments.data.find(
        (item) => item.id === id
    );

    const questions = response.getAssessmentById.data;

    useEffect(() => {
        if (assessment) {
            const durationInSeconds = assessment.duration;
            setTimeRemaining(durationInSeconds);
            setHasStarted(true);
        }
    }, [assessment]);

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

    const handleAnswerSelect = (choiceId: string) => {
        const currentQuestion = questions[currentQuestionIndex];
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: choiceId
        }));
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

    const handleAutoSubmit = () => {
        console.log('Assessment auto-submitted:', selectedAnswers);
        setShowTimeUpModal(true);
    };

    const handleTimeUpModalClose = () => {
        setShowTimeUpModal(false);
        router.back();
    };

    const handleSubmitAssessment = () => {
        Alert.alert(
            'Submit Assessment',
            'Are you sure you want to submit your assessment?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Submit',
                    onPress: () => {
                        console.log('Assessment submitted:', selectedAnswers);
                        router.back();
                    }
                }
            ]
        );
    };

    const getSavedCount = () => {
        return Object.keys(selectedAnswers).length;
    };

    if (!assessment || questions.length === 0 || timeRemaining === null) {
        return (
            <ThemedView style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator
                    size="large"
                    color={Colors[theme].tint}
                />
            </ThemedView>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header Cards */}
                <View style={styles.headerCards}>
                    <View style={{ flex: 1 }}>
                        <TimeRemainingCard timeRemaining={timeRemaining} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <QuestionSavedCountCard
                            savedCount={getSavedCount()}
                            totalCount={questions.length}
                        />
                    </View>
                </View>

                {/* Question */}
                <View style={styles.questionContainer}>
                    <ThemedText type='defaultSemiBold' style={styles.questionText}>
                        {currentQuestion.question_text}
                    </ThemedText>

                    {/* Choices */}
                    <View style={styles.choicesContainer}>
                        {currentQuestion.choice.map((choice) => {
                            const isSelected = selectedAnswers[currentQuestion.id] === choice.id;

                            return (
                                <TouchableOpacity
                                    key={choice.id}
                                    style={styles.choiceButton}
                                    onPress={() => handleAnswerSelect(choice.id)}
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

            {/* Navigation Buttons */}
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
                    >
                        Submit
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

            {/* Time Up Modal */}
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