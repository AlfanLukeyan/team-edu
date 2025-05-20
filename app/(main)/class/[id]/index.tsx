import { useLocalSearchParams } from "expo-router";
import { useCallback, useRef } from "react";
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

import { AssessmentFormData, WeeklySectionFormData } from "@/types/common";
import AssessmentsTab from "./tabs/AssessmentsTab";
import StudentsTab from "./tabs/StudentsTab";
import WeeklyTab from "./tabs/WeeklyTab";

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const classData = response.getAllClasses.data.find(item => item.id === id);
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const createSectionRef = useRef<CreateWeeklySectionBottomSheetRef>(null);
  const createAssessmentRef = useRef<CreateAssessmentBottomSheetRef>(null);

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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});