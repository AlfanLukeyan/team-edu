import { Button } from "@/components/teacher/Button";
import ThemedBottomSheetTextInput from "@/components/ThemedBottomSheetTextInput";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../ThemedView";

const generateId = () => {
  return `id_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
};

// Define data structures for questions and choices
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

interface QuestionsFormData {
  questions: Question[];
  assessment_id?: string;
}

export interface CreateQuestionsBottomSheetRef {
  open: () => void;
  close: () => void;
}

interface CreateQuestionsBottomSheetProps {
  onSubmit: (data: QuestionsFormData) => void;
  onClose?: () => void;
  assessmentId?: string;
}

const CreateQuestionsBottomSheet = forwardRef<
  CreateQuestionsBottomSheetRef,
  CreateQuestionsBottomSheetProps
>(({ onSubmit, onClose, assessmentId }, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { dismiss } = useBottomSheetModal();
  const theme = useColorScheme() || "light";
  const snapPoints = useMemo(() => ["50%", "75%", "95%"], []);

  // Initialize with one empty question
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: generateId(),
      question_text: "",
      choices: [
        { id: generateId(), choice_text: "", is_correct: false },
        { id: generateId(), choice_text: "", is_correct: false },
      ],
    },
  ]);

  const handleClose = useCallback(() => {
    if (onClose) onClose();
    dismiss();
  }, [onClose, dismiss]);

  const handleOpen = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCreate = useCallback(() => {
    // Validate questions before submitting
    if (questions.some((q) => !q.question_text.trim())) {
      alert("Please enter text for all questions");
      return;
    }

    if (questions.some((q) => q.choices.length < 2)) {
      alert("Each question must have at least 2 choices");
      return;
    }

    if (questions.some((q) => q.choices.some((c) => !c.choice_text.trim()))) {
      alert("Please enter text for all choices");
      return;
    }

    if (questions.some((q) => !q.choices.some((c) => c.is_correct))) {
      alert("Each question must have at least one correct answer");
      return;
    }

    onSubmit({ questions, assessment_id: assessmentId });
    // Reset form
    setQuestions([
      {
        id: generateId(),
        question_text: "",
        choices: [
          { id: generateId(), choice_text: "", is_correct: false },
          { id: generateId(), choice_text: "", is_correct: false },
        ],
      },
    ]);
    handleClose();
  }, [questions, onSubmit, handleClose, assessmentId]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // Update question text
  const handleQuestionTextChange = (id: string, text: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, question_text: text } : q
      )
    );
  };

  // Update choice text
  const handleChoiceTextChange = (
    questionId: string,
    choiceId: string,
    text: string
  ) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            choices: q.choices.map((c) =>
              c.id === choiceId ? { ...c, choice_text: text } : c
            ),
          }
          : q
      )
    );
  };

  // Toggle correct answer
  const handleToggleCorrect = (questionId: string, choiceId: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            choices: q.choices.map((c) =>
              c.id === choiceId
                ? { ...c, is_correct: true }
                : { ...c, is_correct: false }
            ),
          }
          : q
      )
    );
  };

  // Add a new choice to a question
  const handleAddChoice = (questionId: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            choices: [
              ...q.choices,
              { id: generateId(), choice_text: "", is_correct: false },
            ],
          }
          : q
      )
    );
  };

  // Remove a choice from a question
  const handleRemoveChoice = (questionId: string, choiceId: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            choices: q.choices.filter((c) => c.id !== choiceId),
          }
          : q
      )
    );
  };

  // Add a new question
  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: generateId(),
        question_text: "",
        choices: [
          { id: generateId(), choice_text: "", is_correct: false },
          { id: generateId(), choice_text: "", is_correct: false },
        ],
      },
    ]);
  };

  // Remove a question
  const handleRemoveQuestion = (questionId: string) => {
    if (questions.length === 1) {
      // Don't remove if it's the last question
      return;
    }
    setQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.id !== questionId)
    );
  };

  useImperativeHandle(ref, () => ({ open: handleOpen, close: handleClose }));

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={2}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor:
          theme === "dark" ? Colors.dark.text : Colors.light.text,
        opacity: 0.5,
      }}
      backgroundStyle={{
        backgroundColor:
          theme === "dark" ? Colors.dark.background : Colors.light.background,
      }}
    >
      <BottomSheetScrollView style={styles.contentContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <ThemedText type="bold">Create</ThemedText>
            <ThemedText style={{ fontSize: 16 }}> Questions</ThemedText>
          </View>

          {questions.map((question, questionIndex) => (
            <View key={question.id}>
              <ThemedView
                isCard={true}
                style={{ padding: 16, marginBottom: 8, borderRadius: 15 }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
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
                      marginRight: 16,
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
                  <ThemedBottomSheetTextInput
                    placeholder="Enter your question"
                    multiline
                    numberOfLines={2}
                    value={question.question_text}
                    onChangeText={(text) =>
                      handleQuestionTextChange(question.id, text)
                    }
                  />
                </View>

                <View style={{ gap: 8, paddingVertical: 8 }}>
                  {question.choices.map((choice, choiceIndex) => (
                    <View key={choice.id} style={styles.choiceRow}>
                      <Pressable
                        style={[
                          styles.checkboxContainer,
                          choice.is_correct ? styles.checkedContainer : styles.checkbox
                        ]}
                        onPress={() => handleToggleCorrect(question.id, choice.id)}
                      >
                        {choice.is_correct && (
                          <IconSymbol
                            name="checkmark.circle.fill"
                            color="green"
                            size={28}
                          />
                        )}
                      </Pressable>

                      <View style={styles.choiceInput}>
                        <ThemedBottomSheetTextInput
                          placeholder="Enter choice text"
                          value={choice.choice_text}
                          onChangeText={(text) =>
                            handleChoiceTextChange(question.id, choice.id, text)
                          }
                        />
                      </View>

                      {choiceIndex === question.choices.length - 1 ? (
                        // Last choice - show add button
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleAddChoice(question.id)}
                        >
                          <IconSymbol
                            name="plus.circle.fill"
                            color={Colors[theme].button}
                            size={28}
                          />
                        </TouchableOpacity>
                      ) : question.choices.length > 2 ? (
                        // Not last choice and more than minimum - show delete button
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleRemoveChoice(question.id, choice.id)}
                        >
                          <IconSymbol
                            name="minus.circle.fill"
                            color={Colors[theme].error}
                            size={28}
                          />
                        </TouchableOpacity>
                      ) : (
                        // Not last choice but at minimum - show disabled delete
                        <View style={styles.actionButtonDisabled}>
                          <IconSymbol
                            name="minus.circle.fill"
                            color={theme === "dark" ? "#555" : "#ccc"}
                            size={28}
                          />
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </ThemedView>
            </View>
          ))}

          <Button
            onPress={() => handleAddQuestion()}
          >Add New Questions</Button>

          <View style={styles.buttonContainer}>
            <Button onPress={handleCreate}>Save Questions</Button>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 0,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 4,
  },
  choiceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  choiceInput: {
    flex: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    marginTop: 20,
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkbox: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 100,
  },
  checkedContainer: {
    // No border needed when checked
  },
  actionButton: {
    padding: 5,
    alignSelf: "flex-end",
  },
  actionButtonDisabled: {
    padding: 5,
    alignSelf: "flex-end",
    opacity: 0.5,
  },
});

export default CreateQuestionsBottomSheet;
