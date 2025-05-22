import { useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SceneMap, TabView } from "react-native-tab-view";

import { ClassHeader } from "@/components/ClassHeader";
import { CustomTabBar } from "@/components/TabBar";
import { ThemedView } from "@/components/ThemedView";

import CreateAssessmentBottomSheet, {
  CreateAssessmentBottomSheetRef
} from "@/components/teacher/CreateAssessmentBottomSheet";
import CreateWeeklySectionBottomSheet, {
  CreateWeeklySectionBottomSheetRef
} from "@/components/teacher/CreateWeeklySectionBottomSheet";

import { response } from "@/data/response";
import { useTabNavigation } from "@/hooks/useTabNavigation";

import CreateQuestionsBottomSheet, { CreateQuestionsBottomSheetRef } from "@/components/teacher/CreateQuestionsBottomSheet";
import { AssessmentFormData, QuestionsFormData, WeeklySectionFormData } from "@/types/common";
import AssessmentsTab from "./tabs/AssessmentsTab";
import StudentsTab from "./tabs/StudentsTab";
import WeeklyTab from "./tabs/WeeklyTab";

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const classData = response.getAllClasses.data.find(item => item.id === id);
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null);

  const createSectionRef = useRef<CreateWeeklySectionBottomSheetRef>(null);
  const createAssessmentRef = useRef<CreateAssessmentBottomSheetRef>(null);
  const createQuestionsRef = useRef<CreateQuestionsBottomSheetRef>(null);

  const { index, routes, setIndex } = useTabNavigation({
    initialRoutes: [
      { key: "weekly", title: "Weekly" },
      { key: "assessments", title: "Assessments" },
      { key: "students", title: "Students" },
    ],
  });

  const handleOpenWeeklySheet = useCallback(() => createSectionRef.current?.open(), []);
  const handleOpenAssessmentSheet = useCallback(() => createAssessmentRef.current?.open(), []);

  const handleCreateSection = useCallback((data: WeeklySectionFormData) => {
    console.log("New section created:", data);
  }, []);

  const handleCreateAssessment = useCallback((data: AssessmentFormData) => {
    console.log("New assessment created:", data);
    
    // Create an ID for the assessment (in a real app this would come from your API)
    const newAssessmentId = `assessment_${Date.now()}`;
    setCurrentAssessmentId(newAssessmentId);
    
    // Open the questions bottom sheet
    createQuestionsRef.current?.open();
  }, []);
  
  // Update your questions handler to use the assessment ID
  const handleCreateQuestions = useCallback((data: QuestionsFormData) => {
    console.log("Questions created for assessment:", data.assessment_id);
    console.log("Questions:", data.questions);
    
    // Clear the current assessment ID
    setCurrentAssessmentId(null);
  }, []);

  const renderScene = SceneMap({
    weekly: () => <WeeklyTab onCreatePress={handleOpenWeeklySheet} />,
    assessments: () => <AssessmentsTab onCreatePress={handleOpenAssessmentSheet} />,
    students: () => <StudentsTab />,
  });

  return (
    <ThemedView style={styles.container}>
        <ClassHeader
          title={classData?.title}
          classCode={classData?.class_code}
          description={classData?.desc}
          style={{ paddingTop: insets.top > 0 ? 0 : 16 }}
        />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
          renderTabBar={(props) => <CustomTabBar props={props} />}
      />

      <CreateWeeklySectionBottomSheet
        ref={createSectionRef}
        onSubmit={handleCreateSection}
      />

      <CreateAssessmentBottomSheet
        ref={createAssessmentRef}
        onSubmit={handleCreateAssessment}
      />

      <CreateQuestionsBottomSheet
        ref={createQuestionsRef}
        onSubmit={handleCreateQuestions}
        assessmentId={currentAssessmentId || undefined}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});