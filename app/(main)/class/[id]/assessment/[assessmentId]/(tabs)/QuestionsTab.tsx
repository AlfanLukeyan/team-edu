import { QuestionCard } from "@/components/QuestionCard";
import { ThemedView } from "@/components/ThemedView";
import { response } from "@/data/response";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function QuestionsTab() {
    const [questions, setQuestions] = useState(response.getAssessmentById.data);
    
    const handleDeleteQuestion = (id: string) => {
        setQuestions(questions.filter(question => question.id !== id));
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ gap: 8, paddingVertical: 8 }}>
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