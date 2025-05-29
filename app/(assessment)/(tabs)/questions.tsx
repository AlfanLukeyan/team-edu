import QuestionActionsMenu from "@/components/QuestionActionsMenu";
import { QuestionCard } from "@/components/QuestionCard";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { response } from "@/data/response";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";


export default function QuestionsScreen() {
    const params = useLocalSearchParams();
    const assessmentId = params.id as string;
    const navigation = useNavigation('/(assessment)');
    const theme = useColorScheme();

    const [questions, setQuestions] = useState(response.getAssessmentById.data);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
    const [showActionsMenu, setShowActionsMenu] = useState(false);

    useEffect(() => {
        console.log('QuestionsScreen mounted with params:', params)
    }, [params])

    useFocusEffect(
        useCallback(() => {
            return () => {
                setSelectedQuestionIds([]);
                setShowActionsMenu(false);
                navigation.setOptions({
                    headerTitle: undefined,
                    headerRight: undefined,
                });
            };
        }, [navigation])
    );

    useLayoutEffect(() => {
        if (selectedQuestionIds.length > 0) {
            navigation.setOptions({
                headerTitle: `${selectedQuestionIds.length} selected`,
                headerRight: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <TouchableOpacity
                            onPress={() => setSelectedQuestionIds([])}
                            style={{ padding: 8 }}
                        >
                            <Text style={{ color: Colors[theme ?? 'light'].tint }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowActionsMenu(!showActionsMenu)}
                            style={{ padding: 8 }}
                        >
                            <Ionicons
                                name="ellipsis-horizontal"
                                size={20}
                                color={Colors[theme ?? 'light'].tint}
                            />
                        </TouchableOpacity>
                    </View>
                ),
            });
        } else {
            navigation.setOptions({
                headerTitle: undefined,
                headerRight: undefined,
            });
        }
    }, [selectedQuestionIds, showActionsMenu, navigation, theme]);

    const handleSelectAllQuestions = () => {
        const allQuestionIds = questions.map(question => question.id);
        setSelectedQuestionIds(allQuestionIds);
        setShowActionsMenu(false);
    };

    const handleDeleteQuestions = () => {
        const selectedQuestions = questions.filter(q => selectedQuestionIds.includes(q.id));
        const questionNumbers = selectedQuestions.map((q, index) => `Question ${questions.findIndex(question => question.id === q.id) + 1}`).join(', ');

        Alert.alert(
            "Delete Questions",
            `Are you sure you want to delete ${selectedQuestionIds.length} question(s): ${questionNumbers}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setQuestions(questions.filter(question => !selectedQuestionIds.includes(question.id)));
                        setSelectedQuestionIds([]);
                        setShowActionsMenu(false);
                    }
                }
            ]
        );
    };

    const handleEditQuestions = () => {
        console.log("Edit questions:", selectedQuestionIds);
        setSelectedQuestionIds([]);
        setShowActionsMenu(false);
    };

    const handleQuestionLongPress = (id: string) => {
        setSelectedQuestionIds([id]);
        setShowActionsMenu(false);
    };

    const handleQuestionPress = (id: string) => {
        if (selectedQuestionIds.length > 0) {
            if (selectedQuestionIds.includes(id)) {
                setSelectedQuestionIds(selectedQuestionIds.filter(questionId => questionId !== id));
            } else {
                setSelectedQuestionIds([...selectedQuestionIds, id]);
            }
            setShowActionsMenu(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <QuestionActionsMenu
                visible={showActionsMenu && selectedQuestionIds.length > 0}
                onClose={() => setShowActionsMenu(false)}
                onEdit={() => handleEditQuestions()}
                onDelete={() => handleDeleteQuestions()}
                onSelectAll={() => handleSelectAllQuestions()}
            />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.questionsList}>
                    {questions.map((question, index) => (
                        <QuestionCard
                            key={question.id}
                            id={question.id}
                            questionNumber={index + 1}
                            questionText={question.question_text}
                            isSelected={selectedQuestionIds.includes(question.id)}
                            onLongPress={handleQuestionLongPress}
                            onPress={handleQuestionPress}
                        />
                    ))}
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        borderRadius: 15,
    },
    questionsList: {
        gap: 8,
    },
});