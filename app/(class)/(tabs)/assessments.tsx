import { AssessmentCard } from '@/components/AssesmentCard';
import { Button } from '@/components/Button';
import CreateAssessmentBottomSheet, { CreateAssessmentBottomSheetRef } from '@/components/teacher/CreateAssessmentBottomSheet';
import CreateQuestionsBottomSheet, { CreateQuestionsBottomSheetRef } from '@/components/teacher/CreateQuestionsBottomSheet';
import { ThemedView } from '@/components/ThemedView';
import { response } from "@/data/response";
import { AssessmentFormData, QuestionsFormData } from '@/types/common';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from "react-native";

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
  const router = useRouter();
  const createAssessmentRef = useRef<CreateAssessmentBottomSheetRef>(null);
  const createQuestionsRef = useRef<CreateQuestionsBottomSheetRef>(null);

  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null);


  const handleOpenAssessmentSheet = useCallback(() => createAssessmentRef.current?.open(), []);

  const handleCreateAssessment = useCallback((data: AssessmentFormData) => {
    console.log("New assessment created:", data);

    const newAssessmentId = `assessment_${Date.now()}`;
    setCurrentAssessmentId(newAssessmentId);

    createQuestionsRef.current?.open();
  }, []);

  const handleCreateQuestions = useCallback((data: QuestionsFormData) => {
    console.log("Questions created for assessment:", data.assessment_id);
    console.log("Questions:", data.questions);

    setCurrentAssessmentId(null);
  }, []);

  return (
    <>
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
        >
          <Button
            onPress={handleOpenAssessmentSheet}
          >
            Create Assessment
          </Button>

          {response.getAllAssessments.data.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              title={assessment.title}
              startDate={formatDate(assessment.start_date)}
              endDate={formatDate(assessment.end_date)}
              onPress={() => router.push({
                pathname: "/(assessment)/(tabs)",
                params: { id: assessment.id }
              })}
            />
          ))}
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
  },
  createButton: {
    marginBottom: 16,
  },
});

export default AssessmentsScreen