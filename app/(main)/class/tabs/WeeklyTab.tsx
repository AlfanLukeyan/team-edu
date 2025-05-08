import { ThemedView } from "@/components/ThemedView";
import { WeeklyCard } from "@/components/WeeklyCard";
import { response } from "@/data/response";
import { ScrollView, StyleSheet } from "react-native";

export default function WeeklyTab() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
      >
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
            assignment={{
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
});
