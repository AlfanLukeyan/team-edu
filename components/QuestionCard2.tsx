import { Button } from "@/components/Button";
import ThemedBottomSheetTextInput from "@/components/ThemedBottomSheetTextInput";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { View } from "react-native";
import ChoiceRow from "./ChoiceRow";
import { ThemedView } from "./ThemedView";

interface Choice {
    id: string;
    choice_text: string;
    is_correct: boolean;
}

interface Question {
    id: string;
    question_text: string;
    choices: Choice[];
}

interface QuestionCardProps {
    question: Question;
    questionIndex: number;
    onQuestionTextChange: (questionId: string, text: string) => void;
    onChoiceTextChange: (questionId: string, choiceId: string, text: string) => void;
    onToggleCorrect: (questionId: string, choiceId: string) => void;
    onAddChoice: (questionId: string) => void;
    onRemoveChoice: (questionId: string, choiceId: string) => void;
    onRemoveQuestion: (questionId: string) => void;
    canDeleteQuestion: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    questionIndex,
    onQuestionTextChange,
    onChoiceTextChange,
    onToggleCorrect,
    onAddChoice,
    onRemoveChoice,
    onRemoveQuestion,
    canDeleteQuestion,
}) => {
    const theme = useColorScheme() || "light";

    return (
        <ThemedView
            isCard={true}
            style={{ padding: 16, marginBottom: 8, borderRadius: 15 }}
        >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <View style={{ paddingRight: 4 }}>
                    <View
                        style={{
                            backgroundColor:
                                theme === "dark"
                                    ? Colors.light.background
                                    : Colors.dark.background,
                            borderRadius: 12,
                            paddingHorizontal: 14,
                            paddingTop: 4,
                            marginTop: 2,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ThemedText
                            type="defaultSemiBold"
                            style={{
                                textAlign: "center",
                                alignItems: "center",
                                color:
                                    theme === "dark"
                                        ? Colors.light.text
                                        : Colors.dark.text,
                            }}
                        >
                            {questionIndex + 1}
                        </ThemedText>
                    </View>
                </View>
                <ThemedBottomSheetTextInput
                    placeholder="Enter your question"
                    multiline
                    numberOfLines={2}
                    value={question.question_text}
                    onChangeText={(text) => onQuestionTextChange(question.id, text)}
                />
            </View>

            <View style={{ gap: 8, paddingVertical: 8 }}>
                {question.choices.map((choice, choiceIndex) => (
                    <ChoiceRow
                        key={choice.id}
                        choice={choice}
                        choiceIndex={choiceIndex}
                        questionId={question.id}
                        totalChoices={question.choices.length}
                        onChoiceTextChange={onChoiceTextChange}
                        onToggleCorrect={onToggleCorrect}
                        onAddChoice={onAddChoice}
                        onRemoveChoice={onRemoveChoice}
                    />
                ))}
            </View>

            <Button
                type="delete"
                disabled={!canDeleteQuestion}
                icon={{ name: "trash.circle.fill" }}
                onPress={() => onRemoveQuestion(question.id)}
            >
                Delete Question
            </Button>
        </ThemedView>
    );
};

export default QuestionCard;