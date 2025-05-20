import { Button } from "@/components/teacher/Button";
import { ThemedView } from "@/components/ThemedView";
import { WeeklyCard } from "@/components/WeeklyCard";
import { response } from "@/data/response";
import { TabContentProps } from "@/types/common";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";


export default function WeeklyTab({ onCreatePress }: TabContentProps) {
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <Button
          icon="plus"
          onPress={onCreatePress}
        >
          Create Weekly Section
        </Button>

        {response.getWeeklyContent.data.map((item) => (
          <WeeklyCard
            key={item.id}
            count={item.count}
            title={item.title}
            description={item.description}
            videoUrl={item.videoUrl}
            attachment={{
              name: item.attachment.name,
              url: item.attachment.url,
            }}
            assignment={item.assignment && {
              title: item.assignment.title,
              dueDate: item.assignment.dueDate,
              description: item.assignment.description,
            }}
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
    gap: 16,
  },
  createButton: {
    marginBottom: 8,
  },
});