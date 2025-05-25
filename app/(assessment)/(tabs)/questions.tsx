import { QuestionCard } from "@/components/QuestionCard";
import { ThemedView } from "@/components/ThemedView";
import { response } from "@/data/response";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function QuestionsScreen() {
    const params = useLocalSearchParams();
    const assessmentId = params.id as string;
    
    const [questions, setQuestions] = useState(response.getAssessmentById.data);
    
    useEffect(() => {
        console.log('QuestionsScreen mounted with params:', params)
    }, [params])
    
    const handleDeleteQuestion = (id: string) => {
        setQuestions(questions.filter(question => question.id !== id));
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={{ flex: 1, borderRadius: 15 }}>
                <View style={{ gap: 8 }}>
                    {questions.map((question, index) => (
                        <QuestionCard
                            key={question.id}
                            id={question.id}
                            questionNumber={index + 1}
                            questionText={question.question_text}
                            onDelete={handleDeleteQuestion}
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
});