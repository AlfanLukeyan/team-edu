import { AssessmentCard } from "@/components/AssesmentCard";
import { Button } from "@/components/Button";
import { ThemedView } from "@/components/ThemedView";
import { response } from "@/data/response";
import { TabContentProps } from "@/types/common";
import { useRouter } from "expo-router";
import React from "react";
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

export default function AssessmentsTab({ onCreatePress }: TabContentProps) {
  const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <Button 
          onPress={onCreatePress}
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
              pathname: "/(main)/class/[id]/assessment/[assessmentId]",
              params: {
                id: assessment.class_id,
                assessmentId: assessment.id,
              },
            })}
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  createButton: {
    marginBottom: 16,
  },
});