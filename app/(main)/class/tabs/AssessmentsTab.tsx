import { AssessmentCard } from "@/components/AssesmentCard";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/teacher/Button";
import { CreateAssessmentBottomSheetRef } from "@/components/teacher/CreateAssessmentBottomSheet";
import { response } from "@/data/response";
import { ScrollView, StyleSheet } from "react-native";

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface AssessmentsTabProps {
  createAssessmentRef: React.RefObject<CreateAssessmentBottomSheetRef | null>;
  setIsBottomSheetVisible: (visible: boolean) => void;
}

export default function AssessmentsTab({ createAssessmentRef, setIsBottomSheetVisible }: AssessmentsTabProps) {

  return (
      <ThemedView style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
        >
          <Button 
            icon="plus" 
            onPress={() => {
              createAssessmentRef.current?.open();
              setIsBottomSheetVisible(true);
            }}
          >
            Create Assessment
          </Button>
          {response.getAllAssessments.data.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              title={assessment.title}
              startDate={formatDate(assessment.start_date)}
              endDate={formatDate(assessment.end_date)}
            />
          ))}
        </ScrollView>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});